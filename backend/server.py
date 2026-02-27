from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
from jose import jwt, JWTError
import httpx
import hmac
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7

PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', '')

security = HTTPBearer()

# Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    addresses: List[Dict[str, Any]] = []
    favorites: List[str] = []
    is_admin: bool = False
    created_at: str

class Restaurant(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    cuisine_type: str
    rating: float
    image: str
    delivery_time: str
    min_order: float
    is_open: bool = True

class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    restaurant_id: str
    name: str
    description: str
    price: float
    category: str
    image: str
    available: bool = True

class OrderItem(BaseModel):
    menu_item_id: str
    name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    restaurant_id: str
    items: List[OrderItem]
    delivery_address: Dict[str, str]
    notes: Optional[str] = None

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_name: str
    restaurant_id: str
    restaurant_name: str
    items: List[Dict[str, Any]]
    total: float
    status: str
    payment_status: str
    payment_reference: Optional[str] = None
    delivery_address: Dict[str, str]
    notes: Optional[str] = None
    created_at: str
    updated_at: str

class ReviewCreate(BaseModel):
    restaurant_id: str
    order_id: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_name: str
    restaurant_id: str
    order_id: str
    rating: int
    comment: Optional[str] = None
    created_at: str

class PaymentInitRequest(BaseModel):
    order_id: str
    callback_url: str

class AdminLogin(BaseModel):
    username: str
    password: str

class OrderStatusUpdate(BaseModel):
    status: str

# Auth utilities
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {'user_id': user_id, 'exp': expiration}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        if not user_id:
            raise HTTPException(401, 'Invalid token')
        user = await db.users.find_one({'id': user_id}, {'_id': 0})
        if not user:
            raise HTTPException(401, 'User not found')
        return user
    except JWTError:
        raise HTTPException(401, 'Invalid token')

# Auth endpoints
@api_router.post('/auth/register')
async def register(data: UserCreate):
    existing = await db.users.find_one({'email': data.email}, {'_id': 0})
    if existing:
        raise HTTPException(400, 'Email already registered')
    
    user_id = str(uuid.uuid4())
    user_doc = {
        'id': user_id,
        'name': data.name,
        'email': data.email,
        'password_hash': hash_password(data.password),
        'phone': data.phone,
        'addresses': [],
        'favorites': [],
        'is_admin': False,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    token = create_token(user_id)
    return {'token': token, 'user': User(**{k: v for k, v in user_doc.items() if k != 'password_hash'})}

@api_router.post('/auth/login')
async def login(data: UserLogin):
    user = await db.users.find_one({'email': data.email}, {'_id': 0})
    if not user or not verify_password(data.password, user['password_hash']):
        raise HTTPException(401, 'Invalid email or password')
    
    token = create_token(user['id'])
    return {'token': token, 'user': User(**{k: v for k, v in user.items() if k != 'password_hash'})}

@api_router.get('/auth/me', response_model=User)
async def get_me(user: dict = Depends(get_current_user)):
    return User(**user)

# Restaurant endpoints
@api_router.get('/restaurants', response_model=List[Restaurant])
async def get_restaurants(search: Optional[str] = None, cuisine: Optional[str] = None):
    query = {}
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    if cuisine:
        query['cuisine_type'] = cuisine
    
    restaurants = await db.restaurants.find(query, {'_id': 0}).to_list(100)
    return restaurants

@api_router.get('/restaurants/{restaurant_id}', response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    restaurant = await db.restaurants.find_one({'id': restaurant_id}, {'_id': 0})
    if not restaurant:
        raise HTTPException(404, 'Restaurant not found')
    return restaurant

@api_router.get('/restaurants/{restaurant_id}/menu', response_model=List[MenuItem])
async def get_menu(restaurant_id: str):
    menu_items = await db.menu_items.find({'restaurant_id': restaurant_id}, {'_id': 0}).to_list(200)
    return menu_items

@api_router.get('/restaurants/{restaurant_id}/reviews', response_model=List[Review])
async def get_reviews(restaurant_id: str):
    reviews = await db.reviews.find({'restaurant_id': restaurant_id}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return reviews

# Order endpoints
@api_router.post('/orders', response_model=Order)
async def create_order(data: OrderCreate, user: dict = Depends(get_current_user)):
    restaurant = await db.restaurants.find_one({'id': data.restaurant_id}, {'_id': 0})
    if not restaurant:
        raise HTTPException(404, 'Restaurant not found')
    
    total = sum(item.price * item.quantity for item in data.items)
    
    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    order_doc = {
        'id': order_id,
        'user_id': user['id'],
        'user_name': user['name'],
        'restaurant_id': data.restaurant_id,
        'restaurant_name': restaurant['name'],
        'items': [item.model_dump() for item in data.items],
        'total': total,
        'status': 'pending',
        'payment_status': 'pending',
        'payment_reference': None,
        'delivery_address': data.delivery_address,
        'notes': data.notes,
        'created_at': now,
        'updated_at': now
    }
    await db.orders.insert_one(order_doc)
    return Order(**order_doc)

@api_router.get('/orders', response_model=List[Order])
async def get_orders(user: dict = Depends(get_current_user)):
    orders = await db.orders.find({'user_id': user['id']}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return orders

@api_router.get('/orders/{order_id}', response_model=Order)
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({'id': order_id, 'user_id': user['id']}, {'_id': 0})
    if not order:
        raise HTTPException(404, 'Order not found')
    return order

@api_router.patch('/orders/{order_id}/status')
async def update_order_status(order_id: str, data: OrderStatusUpdate, user: dict = Depends(get_current_user)):
    # Check if user is admin
    if not user.get('is_admin', False):
        raise HTTPException(403, 'Admin access required')
    
    result = await db.orders.update_one(
        {'id': order_id},
        {'$set': {'status': data.status, 'updated_at': datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, 'Order not found')
    return {'success': True, 'status': data.status}

# Admin endpoints
@api_router.post('/admin/login')
async def admin_login(data: AdminLogin):
    # Simple admin check - in production, use proper admin user management
    if data.username == 'admin' and data.password == 'admin123':
        admin_id = 'admin-user-id'
        admin_user = {
            'id': admin_id,
            'name': 'Admin',
            'email': 'mcaddytechsolutions@gmail.com',
            'is_admin': True
        }
        token = create_token(admin_id)
        # Store admin flag in database for token validation
        await db.users.update_one(
            {'id': admin_id},
            {'$set': admin_user},
            upsert=True
        )
        return {'token': token, 'user': admin_user}
    raise HTTPException(401, 'Invalid admin credentials')

@api_router.get('/admin/orders', response_model=List[Order])
async def get_all_orders(status: Optional[str] = None, user: dict = Depends(get_current_user)):
    if not user.get('is_admin', False):
        raise HTTPException(403, 'Admin access required')
    
    query = {}
    if status:
        query['status'] = status
    
    orders = await db.orders.find(query, {'_id': 0}).sort('created_at', -1).to_list(500)
    return orders

# Favorites endpoints
@api_router.post('/favorites/{restaurant_id}')
async def add_favorite(restaurant_id: str, user: dict = Depends(get_current_user)):
    restaurant = await db.restaurants.find_one({'id': restaurant_id}, {'_id': 0})
    if not restaurant:
        raise HTTPException(404, 'Restaurant not found')
    
    result = await db.users.update_one(
        {'id': user['id']},
        {'$addToSet': {'favorites': restaurant_id}}
    )
    return {'success': True, 'message': 'Added to favorites'}

@api_router.delete('/favorites/{restaurant_id}')
async def remove_favorite(restaurant_id: str, user: dict = Depends(get_current_user)):
    result = await db.users.update_one(
        {'id': user['id']},
        {'$pull': {'favorites': restaurant_id}}
    )
    return {'success': True, 'message': 'Removed from favorites'}

@api_router.get('/favorites')
async def get_favorites(user: dict = Depends(get_current_user)):
    user_data = await db.users.find_one({'id': user['id']}, {'_id': 0})
    favorite_ids = user_data.get('favorites', [])
    
    if not favorite_ids:
        return []
    
    favorites = await db.restaurants.find({'id': {'$in': favorite_ids}}, {'_id': 0}).to_list(100)
    return favorites

# Payment endpoints
@api_router.post('/payment/initialize')
async def initialize_payment(data: PaymentInitRequest, user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({'id': data.order_id, 'user_id': user['id']}, {'_id': 0})
    if not order:
        raise HTTPException(404, 'Order not found')
    
    if not PAYSTACK_SECRET_KEY:
        return {
            'authorization_url': f"{data.callback_url}?reference=mock_{order['id']}&status=success",
            'reference': f"mock_{order['id']}",
            'mock': True
        }
    
    amount_kobo = int(order['total'] * 100)
    reference = f"gomcaddy_{order['id']}_{uuid.uuid4().hex[:8]}"
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://api.paystack.co/transaction/initialize',
            headers={
                'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'email': user['email'],
                'amount': amount_kobo,
                'reference': reference,
                'callback_url': data.callback_url,
                'metadata': {
                    'order_id': order['id'],
                    'user_id': user['id']
                }
            }
        )
        result = response.json()
    
    if result.get('status'):
        await db.orders.update_one(
            {'id': data.order_id},
            {'$set': {'payment_reference': reference}}
        )
        return {
            'authorization_url': result['data']['authorization_url'],
            'reference': result['data']['reference']
        }
    raise HTTPException(400, result.get('message', 'Payment initialization failed'))

@api_router.get('/payment/verify/{reference}')
async def verify_payment(reference: str, user: dict = Depends(get_current_user)):
    if reference.startswith('mock_'):
        order_id = reference.replace('mock_', '')
        await db.orders.update_one(
            {'id': order_id},
            {'$set': {
                'payment_status': 'paid',
                'status': 'confirmed',
                'updated_at': datetime.now(timezone.utc).isoformat()
            }}
        )
        return {'status': 'success', 'mock': True}
    
    if not PAYSTACK_SECRET_KEY:
        raise HTTPException(400, 'Payment gateway not configured')
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'https://api.paystack.co/transaction/verify/{reference}',
            headers={'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}'}
        )
        result = response.json()
    
    if result.get('status') and result['data']['status'] == 'success':
        order_id = result['data']['metadata']['order_id']
        await db.orders.update_one(
            {'id': order_id},
            {'$set': {
                'payment_status': 'paid',
                'status': 'confirmed',
                'updated_at': datetime.now(timezone.utc).isoformat()
            }}
        )
        return {'status': 'success', 'data': result['data']}
    return {'status': 'failed'}

@api_router.post('/payment/webhook')
async def paystack_webhook(request: Request):
    signature = request.headers.get('x-paystack-signature')
    body = await request.body()
    
    if PAYSTACK_SECRET_KEY:
        computed_signature = hmac.new(
            PAYSTACK_SECRET_KEY.encode('utf-8'),
            body,
            hashlib.sha512
        ).hexdigest()
        
        if not hmac.compare_digest(computed_signature, signature or ''):
            raise HTTPException(401, 'Invalid signature')
    
    event = await request.json()
    
    if event.get('event') == 'charge.success':
        reference = event['data']['reference']
        order_id = event['data']['metadata']['order_id']
        await db.orders.update_one(
            {'id': order_id},
            {'$set': {
                'payment_status': 'paid',
                'status': 'confirmed',
                'updated_at': datetime.now(timezone.utc).isoformat()
            }}
        )
    
    return {'status': 'ok'}

# Review endpoints
@api_router.post('/reviews', response_model=Review)
async def create_review(data: ReviewCreate, user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({'id': data.order_id, 'user_id': user['id']}, {'_id': 0})
    if not order:
        raise HTTPException(404, 'Order not found')
    
    if order['status'] != 'delivered':
        raise HTTPException(400, 'Can only review delivered orders')
    
    existing = await db.reviews.find_one({'order_id': data.order_id}, {'_id': 0})
    if existing:
        raise HTTPException(400, 'Order already reviewed')
    
    review_id = str(uuid.uuid4())
    review_doc = {
        'id': review_id,
        'user_id': user['id'],
        'user_name': user['name'],
        'restaurant_id': data.restaurant_id,
        'order_id': data.order_id,
        'rating': data.rating,
        'comment': data.comment,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    await db.reviews.insert_one(review_doc)
    
    reviews = await db.reviews.find({'restaurant_id': data.restaurant_id}, {'_id': 0}).to_list(1000)
    avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
    await db.restaurants.update_one(
        {'id': data.restaurant_id},
        {'$set': {'rating': round(avg_rating, 1)}}
    )
    
    return Review(**review_doc)

# Seed data endpoint
@api_router.post('/seed')
async def seed_data():
    existing_restaurants = await db.restaurants.count_documents({})
    if existing_restaurants > 0:
        return {'message': 'Database already seeded'}
    
    restaurants_data = [
        {
            'id': str(uuid.uuid4()),
            'name': "Mama's Kitchen",
            'description': 'Authentic Nigerian home-style cooking',
            'cuisine_type': 'Nigerian',
            'rating': 4.8,
            'image': 'https://images.unsplash.com/photo-1720799359126-2cda1a741c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZnJpY2FuJTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwdmlicmFudCUyMGxpdmVseXxlbnwwfHx8fDE3NzE5NjcyMjV8MA&ixlib=rb-4.1.0&q=85',
            'delivery_time': '30-45 mins',
            'min_order': 2000,
            'is_open': True
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Calabar Pot',
            'description': 'Spicy delights from the South',
            'cuisine_type': 'Nigerian',
            'rating': 4.6,
            'image': 'https://images.pexels.com/photos/28673617/pexels-photo-28673617.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'delivery_time': '25-40 mins',
            'min_order': 1500,
            'is_open': True
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Lagos Grill',
            'description': 'Grilled perfection with a Nigerian twist',
            'cuisine_type': 'Nigerian',
            'rating': 4.7,
            'image': 'https://images.unsplash.com/photo-1687717324494-6476dd0d9dec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBhZnJpY2FuJTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwdmlicmFudCUyMGxpdmVseXxlbnwwfHx8fDE3NzE5NjcyMjV8MA&ixlib=rb-4.1.0&q=85',
            'delivery_time': '35-50 mins',
            'min_order': 2500,
            'is_open': True
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Abuja Spice',
            'description': 'Contemporary Nigerian cuisine',
            'cuisine_type': 'Nigerian',
            'rating': 4.9,
            'image': 'https://images.pexels.com/photos/17952746/pexels-photo-17952746.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'delivery_time': '20-35 mins',
            'min_order': 3000,
            'is_open': True
        }
    ]
    
    await db.restaurants.insert_many(restaurants_data)
    
    menu_items = []
    for restaurant in restaurants_data:
        items = [
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant['id'],
                'name': 'Jollof Rice with Chicken',
                'description': 'Signature Nigerian jollof rice with grilled chicken',
                'price': 3500,
                'category': 'Main Course',
                'image': 'https://images.pexels.com/photos/17952748/pexels-photo-17952748.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                'available': True
            },
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant['id'],
                'name': 'Egusi Soup with Pounded Yam',
                'description': 'Rich melon seed soup with smooth pounded yam',
                'price': 4000,
                'category': 'Main Course',
                'image': 'https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwyfHxib3dsJTIwb2YlMjBwb3VuZGVkJTIweWFtJTIwYW5kJTIwZWd1c2klMjBzb3VwJTIwbmlnZXJpYW4lMjBmb29kfGVufDB8fHx8MTc3MTk2NzIzMXww&ixlib=rb-4.1.0&q=85',
                'available': True
            },
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant['id'],
                'name': 'Suya Platter',
                'description': 'Spicy grilled beef skewers with yaji spice',
                'price': 2500,
                'category': 'Appetizer',
                'image': 'https://images.pexels.com/photos/31029949/pexels-photo-31029949.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                'available': True
            },
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant['id'],
                'name': 'Pepper Soup',
                'description': 'Spicy fish pepper soup',
                'price': 2000,
                'category': 'Soup',
                'image': 'https://images.pexels.com/photos/35490114/pexels-photo-35490114.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                'available': True
            },
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant['id'],
                'name': 'Fried Rice with Plantain',
                'description': 'Nigerian-style fried rice with sweet fried plantain',
                'price': 3000,
                'category': 'Main Course',
                'image': 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                'available': True
            },
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant['id'],
                'name': 'Chapman',
                'description': 'Refreshing Nigerian cocktail',
                'price': 1500,
                'category': 'Drinks',
                'image': 'https://images.pexels.com/photos/16238131/pexels-photo-16238131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                'available': True
            }
        ]
        menu_items.extend(items)
    
    await db.menu_items.insert_many(menu_items)
    
    return {'message': 'Database seeded successfully', 'restaurants': len(restaurants_data), 'menu_items': len(menu_items)}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()
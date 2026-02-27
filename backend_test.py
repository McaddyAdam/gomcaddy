import requests
import sys
import json
from datetime import datetime

class GoMcaddyAPITester:
    def __init__(self, base_url="https://gomcaddy-food.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"test_{datetime.now().strftime('%H%M%S')}@test.com"
        self.test_restaurant_id = None
        self.test_order_id = None

    def log_test(self, name, success, message=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED {message}")
        else:
            print(f"❌ {name}: FAILED {message}")

    def make_request(self, method, endpoint, data=None, expected_status=200, auth_required=False):
        """Make HTTP request with proper headers"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            
            success = response.status_code == expected_status
            return success, response.json() if success else response.text, response.status_code
            
        except Exception as e:
            return False, str(e), 0

    def test_user_registration(self):
        """Test user registration"""
        data = {
            "name": "Test User",
            "email": self.test_user_email,
            "password": "TestPass123!",
            "phone": "08012345678"
        }
        
        success, response, status = self.make_request('POST', 'auth/register', data, 200)
        
        if success and 'token' in response and 'user' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            self.log_test("User Registration", True, f"User ID: {self.user_id}")
            return True
        else:
            self.log_test("User Registration", False, f"Status: {status}, Response: {response}")
            return False

    def test_user_login(self):
        """Test user login with registered credentials"""
        data = {
            "email": self.test_user_email,
            "password": "TestPass123!"
        }
        
        success, response, status = self.make_request('POST', 'auth/login', data, 200)
        
        if success and 'token' in response:
            self.token = response['token']  # Update token
            self.log_test("User Login", True)
            return True
        else:
            self.log_test("User Login", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_user_profile(self):
        """Test getting authenticated user profile"""
        success, response, status = self.make_request('GET', 'auth/me', auth_required=True)
        
        if success and 'id' in response:
            self.log_test("Get User Profile", True, f"User: {response['name']}")
            return True
        else:
            self.log_test("Get User Profile", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_restaurants(self):
        """Test fetching restaurants"""
        success, response, status = self.make_request('GET', 'restaurants', expected_status=200)
        
        if success and isinstance(response, list) and len(response) > 0:
            self.test_restaurant_id = response[0]['id']  # Store for later tests
            self.log_test("Get Restaurants", True, f"Found {len(response)} restaurants")
            return True
        else:
            self.log_test("Get Restaurants", False, f"Status: {status}, Response: {response}")
            return False

    def test_search_restaurants(self):
        """Test restaurant search"""
        success, response, status = self.make_request('GET', 'restaurants?search=mama', expected_status=200)
        
        if success and isinstance(response, list):
            self.log_test("Search Restaurants", True, f"Found {len(response)} restaurants for 'mama'")
            return True
        else:
            self.log_test("Search Restaurants", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_restaurant_detail(self):
        """Test getting restaurant details"""
        if not self.test_restaurant_id:
            self.log_test("Get Restaurant Detail", False, "No restaurant ID available")
            return False
            
        success, response, status = self.make_request('GET', f'restaurants/{self.test_restaurant_id}')
        
        if success and 'id' in response:
            self.log_test("Get Restaurant Detail", True, f"Restaurant: {response['name']}")
            return True
        else:
            self.log_test("Get Restaurant Detail", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_menu_items(self):
        """Test fetching menu items for restaurant"""
        if not self.test_restaurant_id:
            self.log_test("Get Menu Items", False, "No restaurant ID available")
            return False
            
        success, response, status = self.make_request('GET', f'restaurants/{self.test_restaurant_id}/menu')
        
        if success and isinstance(response, list) and len(response) > 0:
            self.log_test("Get Menu Items", True, f"Found {len(response)} menu items")
            return True
        else:
            self.log_test("Get Menu Items", False, f"Status: {status}, Response: {response}")
            return False

    def test_create_order(self):
        """Test creating an order"""
        if not self.test_restaurant_id:
            self.log_test("Create Order", False, "No restaurant ID available")
            return False
            
        # Get menu items first
        success, menu_items, _ = self.make_request('GET', f'restaurants/{self.test_restaurant_id}/menu')
        if not success or not menu_items:
            self.log_test("Create Order", False, "No menu items available")
            return False
            
        order_data = {
            "restaurant_id": self.test_restaurant_id,
            "items": [
                {
                    "menu_item_id": menu_items[0]['id'],
                    "name": menu_items[0]['name'],
                    "price": menu_items[0]['price'],
                    "quantity": 2
                }
            ],
            "delivery_address": {
                "street": "123 Test Street",
                "city": "Lagos",
                "state": "Lagos",
                "phone": "08012345678"
            },
            "notes": "Test order"
        }
        
        success, response, status = self.make_request('POST', 'orders', order_data, 200, auth_required=True)
        
        if success and 'id' in response:
            self.test_order_id = response['id']
            self.log_test("Create Order", True, f"Order ID: {self.test_order_id}")
            return True
        else:
            self.log_test("Create Order", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_orders(self):
        """Test fetching user orders"""
        success, response, status = self.make_request('GET', 'orders', auth_required=True)
        
        if success and isinstance(response, list):
            self.log_test("Get Orders", True, f"Found {len(response)} orders")
            return True
        else:
            self.log_test("Get Orders", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_order_detail(self):
        """Test getting order details"""
        if not self.test_order_id:
            self.log_test("Get Order Detail", False, "No order ID available")
            return False
            
        success, response, status = self.make_request('GET', f'orders/{self.test_order_id}', auth_required=True)
        
        if success and 'id' in response:
            self.log_test("Get Order Detail", True, f"Order status: {response['status']}")
            return True
        else:
            self.log_test("Get Order Detail", False, f"Status: {status}, Response: {response}")
            return False

    def test_payment_initialization(self):
        """Test payment initialization (mock mode)"""
        if not self.test_order_id:
            self.log_test("Payment Initialization", False, "No order ID available")
            return False
            
        payment_data = {
            "order_id": self.test_order_id,
            "callback_url": "https://gomcaddy-food.preview.emergentagent.com/payment/callback"
        }
        
        success, response, status = self.make_request('POST', 'payment/initialize', payment_data, 200, auth_required=True)
        
        if success and 'authorization_url' in response:
            mock_mode = response.get('mock', False)
            self.log_test("Payment Initialization", True, f"Mock mode: {mock_mode}")
            return True
        else:
            self.log_test("Payment Initialization", False, f"Status: {status}, Response: {response}")
            return False

    def test_payment_verification(self):
        """Test payment verification (mock mode)"""
        if not self.test_order_id:
            self.log_test("Payment Verification", False, "No order ID available")
            return False
            
        mock_reference = f"mock_{self.test_order_id}"
        success, response, status = self.make_request('GET', f'payment/verify/{mock_reference}', auth_required=True)
        
        if success and response.get('status') == 'success':
            self.log_test("Payment Verification", True, "Mock payment verified")
            return True
        else:
            self.log_test("Payment Verification", False, f"Status: {status}, Response: {response}")
            return False

    def test_update_order_status(self):
        """Test updating order status to delivered for review testing"""
        if not self.test_order_id:
            self.log_test("Update Order Status", False, "No order ID available")
            return False
            
        success, response, status = self.make_request('PATCH', f'orders/{self.test_order_id}/status?status=delivered')
        
        if success:
            self.log_test("Update Order Status", True, "Order marked as delivered")
            return True
        else:
            self.log_test("Update Order Status", False, f"Status: {status}, Response: {response}")
            return False

    def test_create_review(self):
        """Test creating a review for delivered order"""
        if not self.test_order_id or not self.test_restaurant_id:
            self.log_test("Create Review", False, "Missing order or restaurant ID")
            return False
            
        review_data = {
            "restaurant_id": self.test_restaurant_id,
            "order_id": self.test_order_id,
            "rating": 5,
            "comment": "Excellent food and service!"
        }
        
        success, response, status = self.make_request('POST', 'reviews', review_data, 200, auth_required=True)
        
        if success and 'id' in response:
            self.log_test("Create Review", True, f"Rating: {response['rating']}")
            return True
        else:
            self.log_test("Create Review", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_reviews(self):
        """Test getting restaurant reviews"""
        if not self.test_restaurant_id:
            self.log_test("Get Reviews", False, "No restaurant ID available")
            return False
            
        success, response, status = self.make_request('GET', f'restaurants/{self.test_restaurant_id}/reviews')
        
        if success and isinstance(response, list):
            self.log_test("Get Reviews", True, f"Found {len(response)} reviews")
            return True
        else:
            self.log_test("Get Reviews", False, f"Status: {status}, Response: {response}")
            return False

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting GoMcaddy API Testing...")
        print(f"📡 Testing API: {self.api_url}")
        print("-" * 60)
        
        # Authentication Tests
        print("\n👤 AUTHENTICATION TESTS")
        if not self.test_user_registration():
            return self.print_results()
            
        if not self.test_user_login():
            return self.print_results()
            
        self.test_get_user_profile()
        
        # Restaurant Tests
        print("\n🍽️ RESTAURANT TESTS")
        if not self.test_get_restaurants():
            return self.print_results()
            
        self.test_search_restaurants()
        self.test_get_restaurant_detail()
        self.test_get_menu_items()
        
        # Order Tests
        print("\n📦 ORDER TESTS")
        if not self.test_create_order():
            return self.print_results()
            
        self.test_get_orders()
        self.test_get_order_detail()
        
        # Payment Tests
        print("\n💳 PAYMENT TESTS")
        self.test_payment_initialization()
        self.test_payment_verification()
        
        # Review Tests (requires delivered order)
        print("\n⭐ REVIEW TESTS")
        self.test_update_order_status()  # Mark order as delivered
        self.test_create_review()
        self.test_get_reviews()
        
        return self.print_results()

    def print_results(self):
        """Print test results summary"""
        print("\n" + "="*60)
        print(f"📊 TEST RESULTS SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "0%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL TESTS PASSED!")
            return 0
        else:
            print("⚠️ SOME TESTS FAILED")
            return 1

if __name__ == "__main__":
    tester = GoMcaddyAPITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
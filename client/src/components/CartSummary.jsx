export default function CartSummary({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <aside className="cart-box">
      <h3>Cart ({cart.length})</h3>
      <ul>
        {cart.map((item, idx) => (
          <li key={`${item.id}-${idx}`}>
            {item.name} - ₦{item.price.toLocaleString()}
          </li>
        ))}
      </ul>
      <p className="price">Total: ₦{total.toLocaleString()}</p>
    </aside>
  );
}

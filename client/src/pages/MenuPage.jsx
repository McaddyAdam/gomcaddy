export default function MenuPage({ menuItems, addToCart }) {
  return (
    <section>
      <h2>Menu</h2>
      <p>Explore popular Nigerian meals and add them to your cart.</p>

      <div className="card-grid">
        {menuItems.map((item) => (
          <article key={item.id} className="card">
            <h3>{item.name}</h3>
            <p>{item.category}</p>
            <p className="price">₦{item.price.toLocaleString()}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </article>
        ))}
      </div>
    </section>
  );
}

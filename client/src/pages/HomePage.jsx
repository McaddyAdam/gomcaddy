export default function HomePage({ search, setSearch, restaurants }) {
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <div className="hero">
        <h1>GoMcaddy</h1>
        <p>Your trusted Nigerian food delivery website.</p>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <h2>Restaurants</h2>
      <div className="card-grid">
        {filteredRestaurants.map((restaurant) => (
          <article key={restaurant.id} className="card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisine}</p>
            <small>{restaurant.eta}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

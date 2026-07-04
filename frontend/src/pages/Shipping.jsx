function Shipping() {
  return (
    <section className="content">
      <h1 className="content__title">Shipping</h1>
      <p className="content__lead">
        Fast, tracked delivery — and free on every order.
      </p>

      <h2 className="content__subtitle">Delivery options</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Time</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard</td>
              <td>3–5 business days</td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Express</td>
              <td>1–2 business days</td>
              <td>$9.99</td>
            </tr>
            <tr>
              <td>International</td>
              <td>7–14 business days</td>
              <td>Calculated at checkout</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="content__subtitle">Tracking your order</h2>
      <p>
        Once your order ships, we’ll email you a tracking link. You can also see
        the status of every order in your{" "}
        <a href="/orders">account order history</a>.
      </p>

      <h2 className="content__subtitle">Order processing</h2>
      <p>
        Orders placed before 2pm ship the same business day. Orders placed on
        weekends or holidays ship the next business day.
      </p>
    </section>
  );
}

export default Shipping;

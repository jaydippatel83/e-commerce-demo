function Returns() {
  return (
    <section className="content">
      <h1 className="content__title">Returns &amp; Exchanges</h1>
      <p className="content__lead">
        Changed your mind? No problem — you have 30 days.
      </p>

      <h2 className="content__subtitle">Our return policy</h2>
      <ul className="content__list">
        <li>Return any item within <strong>30 days</strong> of delivery.</li>
        <li>Items must be unworn, unwashed, and have their original tags.</li>
        <li>Refunds are issued to your original payment method.</li>
        <li>Exchanges for a different size or color are always free.</li>
      </ul>

      <h2 className="content__subtitle">How to return</h2>
      <ol className="content__list">
        <li>Go to your <a href="/orders">order history</a> and select the order.</li>
        <li>Choose the items you’d like to return and the reason.</li>
        <li>Print the prepaid return label we email you.</li>
        <li>Drop it off at any carrier location.</li>
      </ol>

      <h2 className="content__subtitle">Refund timeline</h2>
      <p>
        Once we receive your return, refunds are processed within{" "}
        <strong>5–7 business days</strong>. You’ll get an email as soon as it’s
        on its way back to you.
      </p>

      <p className="content__note">
        Need help? Reach us at{" "}
        <a href="mailto:support@trendora.com">support@trendora.com</a>.
      </p>
    </section>
  );
}

export default Returns;

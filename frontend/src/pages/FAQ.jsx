import { useState } from "react";

const FAQS = [
  {
    q: "How do I find my size?",
    a: "Each product page has a size selector and a Size guide link with measurements. Kids sizes are age-based (e.g. 4-5Y).",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping is free and takes 3–5 business days. Express (1–2 days) is available at checkout. See our Shipping page for details.",
  },
  {
    q: "What is your return policy?",
    a: "You can return unworn items with tags within 30 days for a full refund. Exchanges for a different size or color are free. See our Returns page.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept all major cards and UPI through our secure Razorpay checkout. Your payment details are never stored on our servers.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. You’ll get a tracking link by email once your order ships, and you can view every order’s status in your account order history.",
  },
  {
    q: "Do I need an account to order?",
    a: "You’ll need to sign in to check out, so we can send order updates and let you track your purchases.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq ${isOpen ? "faq--open" : ""}`}>
      <button className="faq__q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="faq__icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <p className="faq__a">{item.a}</p>}
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="content">
      <h1 className="content__title">Frequently asked questions</h1>
      <p className="content__lead">Everything you need to know before you shop.</p>

      <div className="faqs">
        {FAQS.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>

      <p className="content__note">
        Still have questions? <a href="/contact">Contact us</a> — we’re happy to
        help.
      </p>
    </section>
  );
}

export default FAQ;

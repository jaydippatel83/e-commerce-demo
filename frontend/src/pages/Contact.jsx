import { useState } from "react";
import { toast } from "react-toastify";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint yet — acknowledge and reset.
    toast.success("Thanks! We’ll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="content">
      <h1 className="content__title">Contact us</h1>
      <p className="content__lead">
        Questions, feedback, or order help — we’re here for you.
      </p>

      <div className="content__cols">
        <div className="content__info">
          <h2 className="content__subtitle">Get in touch</h2>
          <p>
            <strong>Email</strong>
            <br />
            <a href="mailto:support@trendora.com">support@trendora.com</a>
          </p>
          <p>
            <strong>Phone</strong>
            <br />
            +1 (555) 012-3456
          </p>
          <p>
            <strong>Address</strong>
            <br />
            221B Fashion Street, Suite 4<br />
            New York, NY 10001
          </p>
          <p>
            <strong>Hours</strong>
            <br />
            Mon–Fri, 9am–6pm
          </p>
        </div>

        <form className="form content__form" onSubmit={handleSubmit}>
          <label className="form__field">
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form__field">
            <span>Message</span>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn btn--primary">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;

const ROLES = [
  {
    title: "Senior Frontend Engineer",
    type: "Full-time · Remote",
    desc: "Build delightful shopping experiences with React and modern tooling.",
  },
  {
    title: "Fashion Buyer",
    type: "Full-time · New York",
    desc: "Curate the collections our customers will love next season.",
  },
  {
    title: "Customer Care Associate",
    type: "Part-time · Remote",
    desc: "Be the friendly voice that makes every order feel effortless.",
  },
];

function Careers() {
  return (
    <section className="content">
      <h1 className="content__title">Careers at Trendora</h1>
      <p className="content__lead">
        Help us bring fashion for every you to the world.
      </p>
      <p>
        We’re a small, fast-moving team that cares about craft, customers and
        each other. If that sounds like you, we’d love to talk.
      </p>

      <h2 className="content__subtitle">Open roles</h2>
      <div className="jobs">
        {ROLES.map((role) => (
          <div className="job" key={role.title}>
            <div>
              <h3 className="job__title">{role.title}</h3>
              <p className="job__desc">{role.desc}</p>
            </div>
            <div className="job__meta">
              <span className="chip">{role.type}</span>
              <a href="mailto:careers@trendora.com" className="btn btn--ghost">
                Apply
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="content__note">
        Don’t see your role? Email us at{" "}
        <a href="mailto:careers@trendora.com">careers@trendora.com</a>.
      </p>
    </section>
  );
}

export default Careers;

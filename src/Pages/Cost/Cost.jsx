import React from "react";
import "./cost.css";

function Cost() {
  const plans = [
    {
      title: "Basic",
      price: "$29",
      duration: "/month",
      features: [
        "2 Classes / Week",
        "Live Sessions",
        "Student Support",
      ],
    },
    {
      title: "Standard",
      price: "$59",
      duration: "/month",
      features: [
        "4 Classes / Week",
        "Expert Teachers",
        "Progress Tracking",
      ],
    },
    {
      title: "Premium",
      price: "$99",
      duration: "/month",
      features: [
        "Daily Classes",
        "1-on-1 Sessions",
        "Priority Support",
      ],
    },
  ];

  return (
    <div className="cost-page">

      <section className="pricing-hero">
        <h1>Affordable Quran Learning Plans</h1>

        <p>
          Flexible pricing for kids and adults with guided online learning.
        </p>
      </section>

      <section className="pricing">

        {plans.map((plan, index) => (
          <div className="price-card" key={index}>

            <h2>{plan.title}</h2>

            <h1>
              {plan.price}
              <span>{plan.duration}</span>
            </h1>

            <ul>
              {plan.features.map((item, i) => (
                <li key={i}>✓ {item}</li>
              ))}
            </ul>

            <button>
              Start Free Trial
            </button>

          </div>
        ))}

      </section>

      <section className="register">

        <h2>
          Begin Your Quran Journey Today
        </h2>

        <button>
          Get Registered
        </button>

      </section>

    </div>
  );
}

export default Cost;
module.exports = {
    routes: [
      {
        method: "POST",
        path: "/subscribe",
        handler: "newsletter-subscriber.subscribe",
        config: {
          auth: false,
        },
      },
      {
        method: "POST",
        path: "/unsubscribe",
        handler: "newsletter-subscriber.unsubscribe",
        config: {
          auth: false,
        },
      },
    ],
  };
export default function Features() {
  const features = [
    {
      title: "Fast Performance",
      description: "Lightning-fast load times and optimized performance for the best user experience.",
      icon: "⚡",
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee.",
      icon: "🔒",
    },
    {
      title: "Easy Integration",
      description: "Simple APIs and comprehensive documentation for seamless integration.",
      icon: "🔌",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you whenever you need it.",
      icon: "💬",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to build and scale your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


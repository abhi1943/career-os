function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700 text-white py-32">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h1 className="text-6xl font-bold leading-tight">
          Discover Your
          <span className="block text-yellow-300">
            Perfect Career Path
          </span>
        </h1>

        <p className="mt-8 text-xl max-w-3xl mx-auto text-blue-100">
          Explore careers, colleges, exams, companies,
          roadmaps, and opportunities—all in one place.
        </p>

        <button className="mt-10 bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition">
          Start Your Journey
        </button>

      </div>
    </section>
  );
}

export default HeroSection;
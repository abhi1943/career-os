function CareerYoutube({ channels }) {
  if (!channels?.length) return null;

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        🎥 Best YouTube Channels
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {channels.map((channel) => (
          <div
            key={channel}
            className="bg-white rounded-xl shadow p-5 text-center font-semibold hover:shadow-lg transition"
          >
            ▶ {channel}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerYoutube;
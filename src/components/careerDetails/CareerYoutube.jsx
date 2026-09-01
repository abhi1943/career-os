function CareerYoutube({ channels = [] }) {
  if (!Array.isArray(channels) || channels.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        🎥 Best YouTube Channels
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {channels.map((channel, index) => {
          const channelName =
            typeof channel === "string"
              ? channel
              : channel?.name ||
                channel?.title ||
                `YouTube Channel ${index + 1}`;

          const description =
            typeof channel === "object"
              ? channel?.description || ""
              : "";

          const url =
            typeof channel === "object"
              ? channel?.url ||
                channel?.link ||
                channel?.channelUrl ||
                ""
              : "";

          const content = (
            <>
              <div className="text-3xl mb-3">
                ▶️
              </div>

              <h3 className="font-semibold text-slate-800">
                {channelName}
              </h3>

              {description && (
                <p className="text-sm text-gray-500 mt-2">
                  {description}
                </p>
              )}
            </>
          );

          return url ? (
            <a
              key={
                typeof channel === "object"
                  ? channel?.id || channelName
                  : `${channelName}-${index}`
              }
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-white
                rounded-xl
                shadow
                p-5
                text-center
                hover:shadow-lg
                hover:-translate-y-1
                transition
                block
              "
            >
              {content}

              <div className="mt-5">
                <span className="inline-flex items-center justify-center w-full bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition">
                  Visit Channel →
                </span>
              </div>
            </a>
          ) : (
            <div
              key={
                typeof channel === "object"
                  ? channel?.id || channelName
                  : `${channelName}-${index}`
              }
              className="
                bg-white
                rounded-xl
                shadow
                p-5
                text-center
                hover:shadow-lg
                transition
              "
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CareerYoutube;
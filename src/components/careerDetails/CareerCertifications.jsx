function CareerCertifications({ career }) {

  if (!career.certifications) return null;

  return (

    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        📜 Recommended Certifications
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {career.certifications.map(cert => (

          <div
            key={cert}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            🏆 {cert}

          </div>

        ))}

      </div>

    </div>

  );
}

export default CareerCertifications;
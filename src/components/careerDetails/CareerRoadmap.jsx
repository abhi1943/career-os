import RoadmapFlow from "../roadmap/RoadmapFlow";

function CareerRoadmap({ roadmap }) {

  if (!roadmap?.length) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🗺 Career Roadmap
      </h2>

      <RoadmapFlow roadmap={roadmap} />

    </div>
  );
}

export default CareerRoadmap;
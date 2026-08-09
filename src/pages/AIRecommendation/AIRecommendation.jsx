import CareerRecommendation from "../../components/careers/CareerRecommendation";
import StudentForm from "@/components/forms/StudentForm";
function AIRecommendation() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <StudentForm />
      <CareerRecommendation />
    </div>
  );
}

export default AIRecommendation;
import { getCareerAdvice } from "../../services/careerCoach";

function CareerCoach({ role }) {

    const advice = getCareerAdvice(role);

    if (!advice) {

        return (

            <div className="bg-white rounded-3xl shadow-lg p-8">

                <h2 className="text-2xl font-bold">

                    AI Career Coach

                </h2>

                <p className="mt-5">

                    Select a target role to receive personalized guidance.

                </p>

            </div>

        );

    }

    return (

        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-6">

                🤖 AI Career Coach

            </h2>

            <h3 className="text-xl font-semibold">

                Salary Range

            </h3>

            <p className="mb-6">

                {advice.salary}

            </p>

            <h3 className="text-xl font-semibold mb-3">

                Skills to Learn

            </h3>

            <ul className="list-disc pl-6 mb-6">

                {advice.skills.map(skill => (

                    <li key={skill}>{skill}</li>

                ))}

            </ul>

            <h3 className="text-xl font-semibold mb-3">

                Recommended Projects

            </h3>

            <ul className="list-disc pl-6 mb-6">

                {advice.projects.map(project => (

                    <li key={project}>{project}</li>

                ))}

            </ul>

            <h3 className="text-xl font-semibold mb-3">

                Certifications

            </h3>

            <ul className="list-disc pl-6 mb-6">

                {advice.certifications.map(cert => (

                    <li key={cert}>{cert}</li>

                ))}

            </ul>

            <h3 className="text-xl font-semibold mb-3">

                Career Roadmap

            </h3>

            <ol className="list-decimal pl-6">

                {advice.roadmap.map(step => (

                    <li key={step}>{step}</li>

                ))}

            </ol>

        </div>

    );

}

export default CareerCoach;
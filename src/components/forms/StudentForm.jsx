import { useState, useContext } from "react";
import { CareerContext } from "../../context/CareerContext";
import {
GraduationCap,
Heart,
Target,
Code2,
MapPin,
ArrowRight,
ArrowLeft,
CheckCircle2,
Sparkles,
} from "lucide-react";

function StudentForm() {
const { setStudent } = useContext(CareerContext);

const [step, setStep] = useState(1);

const [formData, setFormData] = useState({
name: "",
age: "",
education: "",
specialization: "",
interest: "",
dreamCareer: "",
state: "",
skills: [],
});

const specializationOptions = {
intermediate: [
"MPC",
"BiPC",
"MEC",
"CEC",
"HEC",
"Vocational",
],

polytechnic: [
  "CSE",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "AI & ML",
],

btech: [
  "CSE",
  "AI & ML",
  "Data Science",
  "Cyber Security",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "IT",
],

degree: [
  "B.Sc",
  "B.Com",
  "BBA",
  "BA",
  "BCA",
],

medical: [
  "MBBS",
  "BDS",
  "BAMS",
  "BHMS",
  "B.Pharmacy",
],

};

const careerSkillOptions = {
"Frontend Developer": [
"HTML",
"CSS",
"JavaScript",
"React",
"Tailwind CSS",
"Bootstrap",
"Redux",
"TypeScript",
"Next.js",
"Git",
],

"Backend Developer": [
  "Java",
  "Spring Boot",
  "Hibernate",
  "Node.js",
  "Express.js",
  "SQL",
  "MongoDB",
  "REST API",
  "Docker",
  "Git",
],

"Full Stack Developer": [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "SQL",
  "MongoDB",
  "Git",
],

"Software Engineer": [
  "Java",
  "Python",
  "DSA",
  "SQL",
  "Git",
  "OOP",
  "Problem Solving",
],

"AI Engineer": [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "Statistics",
],

"Data Scientist": [
  "Python",
  "SQL",
  "Pandas",
  "NumPy",
  "Power BI",
  "Tableau",
  "Machine Learning",
],

"Cyber Security Engineer": [
  "Linux",
  "Networking",
  "Ethical Hacking",
  "Python",
  "Cryptography",
  "Kali Linux",
],

"Cloud Engineer": [
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Linux",
  "Terraform",
],

Doctor: [
  "Biology",
  "Patient Care",
  "Diagnosis",
  "Communication",
],

"Government Officer": [
  "Reasoning",
  "Aptitude",
  "General Knowledge",
  "Current Affairs",
],

};

const careerGoalOptions = {
MPC: [
"Software Engineer",
"AI Engineer",
"Data Scientist",
"Cloud Engineer",
"Mechanical Engineer",
"Civil Engineer",
],

BiPC: [
  "Doctor",
  "Dentist",
  "Pharmacist",
  "Nurse",
  "Biotechnologist",
],

MEC: [
  "Business Analyst",
  "Financial Analyst",
  "Chartered Accountant",
  "Bank Officer",
],

CEC: [
  "Lawyer",
  "Government Officer",
  "Bank Officer",
  "Business Executive",
],

HEC: [
  "IAS Officer",
  "Teacher",
  "Journalist",
  "Content Writer",
],

CSE: [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Cloud Engineer",
  "DevOps Engineer",
],

"AI & ML": [
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Research Engineer",
],

"Data Science": [
  "Data Scientist",
  "Data Analyst",
  "Business Analyst",
  "AI Engineer",
],

"Cyber Security": [
  "Cyber Security Engineer",
  "Ethical Hacker",
  "SOC Analyst",
  "Security Consultant",
],

ECE: [
  "Embedded Engineer",
  "VLSI Engineer",
  "IoT Engineer",
],

EEE: [
  "Electrical Engineer",
  "Power Systems Engineer",
],

Mechanical: [
  "Mechanical Engineer",
  "Automobile Engineer",
  "Production Engineer",
],

Civil: [
  "Civil Engineer",
  "Structural Engineer",
],

IT: [
  "Software Engineer",
  "Backend Developer",
  "Cloud Engineer",
],

};

const handleChange = (e) => {
const { name, value } = e.target;

if (name === "education") {
  setFormData((prev) => ({
    ...prev,
    education: value,
    specialization: "",
    dreamCareer: "",
    skills: [],
  }));

  return;
}

if (name === "specialization") {
  setFormData((prev) => ({
    ...prev,
    specialization: value,
    dreamCareer: "",
    skills: [],
  }));

  return;
}

if (name === "dreamCareer") {
  setFormData((prev) => ({
    ...prev,
    dreamCareer: value,
    skills: [],
  }));

  return;
}

setFormData((prev) => ({
  ...prev,
  [name]: value,
}));

};

const handleSkillChange = (e) => {
const { value, checked } = e.target;

setFormData((prev) => ({
  ...prev,
  skills: checked
    ? [...prev.skills, value]
    : prev.skills.filter((skill) => skill !== value),
}));

};

const canGoToStep2 =
formData.name.trim() &&
formData.age &&
formData.education;

const canGoToStep3 =
canGoToStep2 &&
(!specializationOptions[formData.education] ||
formData.specialization);

const canGoToStep4 =
canGoToStep3 &&
formData.interest &&
formData.dreamCareer;

const handleNext = () => {
if (step === 1 && canGoToStep2) {
setStep(2);
return;
}

if (step === 2 && canGoToStep3) {
  setStep(3);
  return;
}

if (step === 3 && canGoToStep4) {
  setStep(4);
}

};

const handleBack = () => {
if (step > 1) {
setStep((prev) => prev - 1);
}
};

const handleSubmit = (e) => {
e.preventDefault();

if (!formData.name || !formData.education) {
  return;
}

setStudent(formData);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

};

const steps = [
{
number: 1,
title: "Education",
icon: GraduationCap,
},
{
number: 2,
title: "Interests",
icon: Heart,
},
{
number: 3,
title: "Career Goal",
icon: Target,
},
{
number: 4,
title: "Skills",
icon: Code2,
},
];

return ( <section className="bg-slate-100 py-20">

  <div className="max-w-5xl mx-auto px-6">

    {/* Header */}

    <div className="text-center mb-10">

      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">

        <Sparkles size={16} />

        Personalized Career Planning

      </div>

      <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mt-5">

        Build Your Career Profile

      </h2>

      <p className="text-slate-500 mt-4 max-w-2xl mx-auto">

        Tell CareerOS about yourself and we'll use your education,
        interests, career goals and skills to create your personalized
        career journey.

      </p>

    </div>

    {/* Main Card */}

    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">

      {/* Progress Header */}

      <div className="border-b bg-slate-50 px-6 md:px-10 py-7">

        <div className="flex items-center justify-between max-w-3xl mx-auto">

          {steps.map((item, index) => {

            const Icon = item.icon;

            const completed = step > item.number;
            const active = step === item.number;

            return (
              <div
                key={item.number}
                className="flex items-center flex-1"
              >

                <div className="flex flex-col items-center">

                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                      completed
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >

                    {completed ? (
                      <CheckCircle2 size={21} />
                    ) : (
                      <Icon size={21} />
                    )}

                  </div>

                  <span
                    className={`text-xs md:text-sm font-semibold mt-2 ${
                      active
                        ? "text-blue-600"
                        : completed
                        ? "text-green-600"
                        : "text-slate-400"
                    }`}
                  >
                    {item.title}
                  </span>

                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 md:mx-4 rounded-full ${
                      step > item.number
                        ? "bg-green-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}

              </div>
            );
          })}

        </div>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-10"
      >

        {/* STEP 1 */}

        {step === 1 && (

          <div>

            <div className="mb-8">

              <h3 className="text-2xl font-bold text-slate-800">
                Let's start with the basics
              </h3>

              <p className="text-slate-500 mt-2">
                Tell us about yourself and your current education.
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  required
                />

              </div>

              <div>

                <label className="block font-semibold text-slate-700 mb-2">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  placeholder="Your age"
                  min="10"
                  max="100"
                  className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  required
                />

              </div>

              <div>

                <label className="block font-semibold text-slate-700 mb-2">
                  Completed Education
                </label>

                <select
                  name="education"
                  value={formData.education}
                  className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select your education
                  </option>

                  <option value="after10th">
                    10th
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="polytechnic">
                    Polytechnic
                  </option>

                  <option value="iti">
                    ITI
                  </option>

                  <option value="degree">
                    Degree
                  </option>

                  <option value="btech">
                    B.Tech / Engineering
                  </option>

                  <option value="medical">
                    Medical
                  </option>

                  <option value="government">
                    Government Jobs
                  </option>

                </select>

              </div>

              <div>

                <label className="block font-semibold text-slate-700 mb-2">
                  State
                </label>

                <div className="relative">

                  <MapPin
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    placeholder="e.g. Andhra Pradesh"
                    className="w-full border border-slate-200 p-4 pl-11 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {specializationOptions[formData.education] && (

              <div className="mt-6">

                <label className="block font-semibold text-slate-700 mb-2">
                  Stream / Branch
                </label>

                <select
                  name="specialization"
                  value={formData.specialization}
                  className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Stream / Branch
                  </option>

                  {specializationOptions[
                    formData.education
                  ].map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </select>

              </div>

            )}

          </div>

        )}

        {/* STEP 2 */}

        {step === 2 && (

          <div>

            <div className="mb-8">

              <h3 className="text-2xl font-bold text-slate-800">
                What interests you?
              </h3>

              <p className="text-slate-500 mt-2">
                Your interests help CareerOS understand which direction
                may suit you.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

              {[
                "Technology",
                "Medical",
                "Government Jobs",
                "Business",
                "Arts",
              ].map((interest) => (

                <label
                  key={interest}
                  className={`cursor-pointer border-2 rounded-2xl p-5 transition ${
                    formData.interest === interest
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >

                  <input
                    type="radio"
                    name="interest"
                    value={interest}
                    checked={formData.interest === interest}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.interest === interest
                          ? "border-blue-600"
                          : "border-slate-300"
                      }`}
                    >

                      {formData.interest === interest && (
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                      )}

                    </div>

                    <span className="font-semibold">
                      {interest}
                    </span>

                  </div>

                </label>

              ))}

            </div>

          </div>

        )}

        {/* STEP 3 */}

        {step === 3 && (

          <div>

            <div className="mb-8">

              <h3 className="text-2xl font-bold text-slate-800">
                Choose your career direction
              </h3>

              <p className="text-slate-500 mt-2">
                Based on your education and stream, here are career
                directions you can explore.
              </p>

            </div>

            {formData.specialization &&
            careerGoalOptions[formData.specialization] ? (

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

                {careerGoalOptions[
                  formData.specialization
                ].map((career) => (

                  <label
                    key={career}
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition ${
                      formData.dreamCareer === career
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="dreamCareer"
                      value={career}
                      checked={formData.dreamCareer === career}
                      onChange={handleChange}
                      className="sr-only"
                    />

                    <div className="flex items-start gap-3">

                      <Target
                        size={21}
                        className={
                          formData.dreamCareer === career
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />

                      <div>

                        <p className="font-semibold">
                          {career}
                        </p>

                        {formData.dreamCareer === career && (
                          <p className="text-xs text-blue-600 mt-1">
                            Selected
                          </p>
                        )}

                      </div>

                    </div>

                  </label>

                ))}

              </div>

            ) : (

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

                <p className="font-semibold text-blue-800">
                  Career options will be personalized based on your
                  selected education.
                </p>

                <p className="text-sm text-blue-600 mt-2">
                  Select your education and stream first to see matching
                  career paths.
                </p>

              </div>

            )}

          </div>

        )}

        {/* STEP 4 */}

        {step === 4 && (

          <div>

            <div className="mb-8">

              <h3 className="text-2xl font-bold text-slate-800">
                What skills do you have?
              </h3>

              <p className="text-slate-500 mt-2">
                Select the skills you already have. You can update them
                later from your profile.
              </p>

            </div>

            {formData.dreamCareer &&
            careerSkillOptions[formData.dreamCareer] ? (

              <div>

                <div className="bg-blue-50 rounded-2xl p-5 mb-6">

                  <p className="text-sm text-blue-600 font-semibold">
                    Selected Career
                  </p>

                  <p className="text-xl font-bold text-blue-800 mt-1">
                    {formData.dreamCareer}
                  </p>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                  {careerSkillOptions[
                    formData.dreamCareer
                  ].map((skill) => {

                    const selected =
                      formData.skills.includes(skill);

                    return (

                      <label
                        key={skill}
                        className={`cursor-pointer border rounded-xl p-3 transition ${
                          selected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-slate-50 border-slate-200 hover:border-blue-300"
                        }`}
                      >

                        <input
                          type="checkbox"
                          value={skill}
                          checked={selected}
                          onChange={handleSkillChange}
                          className="sr-only"
                        />

                        <div className="flex items-center gap-2">

                          {selected && (
                            <CheckCircle2 size={17} />
                          )}

                          <span className="text-sm font-medium">
                            {skill}
                          </span>

                        </div>

                      </label>

                    );
                  })}

                </div>

                <p className="text-sm text-slate-500 mt-5">

                  {formData.skills.length} skill
                  {formData.skills.length !== 1 ? "s" : ""} selected

                </p>

              </div>

            ) : (

              <div className="bg-slate-50 rounded-2xl p-8 text-center">

                <Code2
                  size={40}
                  className="mx-auto text-slate-400 mb-3"
                />

                <p className="text-slate-500">
                  Select a career goal to see recommended skills.
                </p>

              </div>

            )}

          </div>

        )}

        {/* Navigation */}

        <div className="flex justify-between items-center mt-10 pt-7 border-t">

          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
              step === 1
                ? "text-slate-300 cursor-not-allowed"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >

            <ArrowLeft size={18} />

            Back

          </button>

          {step < 4 ? (

            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !canGoToStep2) ||
                (step === 2 && !canGoToStep3) ||
                (step === 3 && !canGoToStep4)
              }
              className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition ${
                (step === 1 && !canGoToStep2) ||
                (step === 2 && !canGoToStep3) ||
                (step === 3 && !canGoToStep4)
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
              }`}
            >

              Continue

              <ArrowRight size={18} />

            </button>

          ) : (

            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold hover:scale-[1.02] transition shadow-lg"
            >

              <Sparkles size={18} />

              Generate My Career Roadmap

              <ArrowRight size={18} />

            </button>

          )}

        </div>

      </form>

    </div>

  </div>

</section>

);
}

export default StudentForm;

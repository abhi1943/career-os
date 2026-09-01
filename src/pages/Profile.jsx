import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CareerContext } from "../context/CareerContext";

import {
User,
GraduationCap,
Target,
Heart,
MapPin,
Code2,
Pencil,
CheckCircle2,
Briefcase,
Sparkles,
ArrowLeft,
X,
Save,
} from "lucide-react";

// ======================================================
// DISPLAY HELPERS
// ======================================================

const EDUCATION_LABELS = {
after10th: "10th",
intermediate: "Intermediate",
polytechnic: "Polytechnic",
iti: "ITI",
degree: "Degree",
btech: "B.Tech / Engineering",
medical: "Medical",
government: "Government Jobs",
};

const formatEducation = (education) => {
if (!education) {
return "Not specified";
}

return (
EDUCATION_LABELS[education] ||
education
.replace(/-/g, " ")
.replace(/\b\w/g, (letter) => letter.toUpperCase())
);
};

// ======================================================
// PROFILE PAGE
// ======================================================

function Profile() {
const { student, setStudent } =
useContext(CareerContext);

// ====================================================
// EDIT MODE
// ====================================================

const [isEditing, setIsEditing] =
useState(false);

// ====================================================
// EDIT FORM
// ====================================================

const [formData, setFormData] = useState({
name: student?.name || "",
age: student?.age || "",
education: student?.education || "",
specialization:
student?.specialization || "",
interest: student?.interest || "",
dreamCareer:
student?.dreamCareer || "",
state: student?.state || "",
skills: Array.isArray(student?.skills)
? student.skills.join(", ")
: "",
});

// ====================================================
// OPEN EDIT MODE
// ====================================================

const handleEdit = () => {
setFormData({
name: student?.name || "",
age: student?.age || "",
education:
student?.education || "",
specialization:
student?.specialization || "",
interest:
student?.interest || "",
dreamCareer:
student?.dreamCareer || "",
state:
student?.state || "",
skills:
Array.isArray(student?.skills)
? student.skills.join(", ")
: "",
});

  
setIsEditing(true);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});
  

};

// ====================================================
// CANCEL EDIT
// ====================================================

const handleCancel = () => {
setFormData({
name: student?.name || "",
age: student?.age || "",
education:
student?.education || "",
specialization:
student?.specialization || "",
interest:
student?.interest || "",
dreamCareer:
student?.dreamCareer || "",
state:
student?.state || "",
skills:
Array.isArray(student?.skills)
? student.skills.join(", ")
: "",
});

  
setIsEditing(false);
  

};

// ====================================================
// INPUT CHANGE
// ====================================================

const handleChange = (event) => {
const {
name,
value,
} = event.target;

  
setFormData((previous) => ({
  ...previous,
  [name]: value,
}));
  

};

// ====================================================
// SAVE PROFILE
// ====================================================

const handleSave = () => {
const updatedStudent = {
...student,

  
  name: formData.name.trim(),

  age: formData.age,

  education:
    formData.education,

  specialization:
    formData.specialization.trim(),

  interest:
    formData.interest.trim(),

  dreamCareer:
    formData.dreamCareer.trim(),

  state:
    formData.state.trim(),

  skills:
    formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
};

setStudent(updatedStudent);

setIsEditing(false);
  

};

// ====================================================
// DISPLAY VALUES
// ====================================================

const name =
student?.name?.trim() ||
"CareerOS Student";

const age =
student?.age ||
"Not specified";

const education =
formatEducation(
student?.education
);

const specialization =
student?.specialization ||
"Not specified";

const dreamCareer =
student?.dreamCareer ||
"Not specified";

const interest =
student?.interest ||
"Not specified";

const state =
student?.state?.trim() ||
"Not specified";

const skills =
Array.isArray(student?.skills)
? student.skills
: [];

const careerId =
student?.careerId ||
student?.dreamCareerId ||
"";

// ====================================================
// INITIAL
// ====================================================

const initial = name
.charAt(0)
.toUpperCase();

// ====================================================
// PROFILE COMPLETION
// ====================================================

const profileFields = [
student?.name,
student?.age,
student?.education,
student?.specialization,
student?.dreamCareer,
student?.interest,
student?.state,
skills.length > 0,
];

const completedFields =
profileFields.filter(Boolean).length;

const completionPercentage =
Math.round(
(completedFields /
profileFields.length) *
100
);

// ====================================================
// RENDER
// ====================================================

return ( <div className="min-h-screen bg-slate-100 py-10 md:py-14">

  
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* ==================================================
        BACK
    ================================================== */}

    <div className="mb-6">

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft size={17} />

        Back to Dashboard
      </Link>

    </div>

    {/* ==================================================
        PROFILE HEADER
    ================================================== */}

    <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">

      {/* TOP BACKGROUND */}

      <div className="h-32 md:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      {/* PROFILE CONTENT */}

      <div className="px-6 md:px-10 pb-8">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          {/* USER */}

          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14">

            {/* AVATAR */}

            <div className="w-28 h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white">

              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">

                <span className="text-4xl font-extrabold">
                  {initial}
                </span>

              </div>

            </div>

            {/* NAME */}

            <div className="pb-1">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                  {name}
                </h1>

                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  <CheckCircle2 size={13} />

                  Active
                </span>

              </div>

              <p className="text-slate-500 mt-1">
                CareerOS Student
              </p>

            </div>

          </div>

          {/* EDIT BUTTON */}

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              <Pencil size={17} />

              Edit Profile
            </button>
          )}

        </div>

      </div>

    </div>

    {/* ==================================================
        EDIT PROFILE FORM
    ================================================== */}

    {isEditing && (

      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-6">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                <Pencil size={21} />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Edit Profile
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update your CareerOS profile information.
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-semibold transition"
          >
            <X size={17} />

            Cancel
          </button>

        </div>

        {/* FORM */}

        <div className="grid md:grid-cols-2 gap-5">

          {/* NAME */}

          <div>

            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

          {/* AGE */}

          <div>

            <label
              htmlFor="profile-age"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Age
            </label>

            <input
              id="profile-age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="1"
              max="100"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

          {/* EDUCATION */}

          <div>

            <label
              htmlFor="profile-education"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Education
            </label>

            <select
              id="profile-education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >

              <option value="">
                Select education
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

          {/* SPECIALIZATION */}

          <div>

            <label
              htmlFor="profile-specialization"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Stream / Branch
            </label>

            <input
              id="profile-specialization"
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

          {/* DREAM CAREER */}

          <div>

            <label
              htmlFor="profile-career"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Dream Career
            </label>

            <input
              id="profile-career"
              type="text"
              name="dreamCareer"
              value={formData.dreamCareer}
              onChange={handleChange}
              placeholder="e.g. Software Developer"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

          {/* INTEREST */}

          <div>

            <label
              htmlFor="profile-interest"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Area of Interest
            </label>

            <input
              id="profile-interest"
              type="text"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              placeholder="e.g. Technology"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

          {/* STATE */}

          <div>

            <label
              htmlFor="profile-state"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              State
            </label>

            <input
              id="profile-state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Andhra Pradesh"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

          {/* SKILLS */}

          <div className="md:col-span-2">

            <label
              htmlFor="profile-skills"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Skills
            </label>

            <input
              id="profile-skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, Python"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

            <p className="text-xs text-slate-400 mt-2">
              Separate multiple skills with commas.
            </p>

          </div>

        </div>

        {/* SAVE */}

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-slate-100">

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold transition"
          >
            <X size={17} />

            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
          >
            <Save size={17} />

            Save Changes
          </button>

        </div>

      </div>
    )}

    {/* ==================================================
        PROFILE COMPLETION
    ================================================== */}

    {!isEditing && (
      <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <Sparkles
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-bold text-slate-800">
                Profile Completion
              </h2>

            </div>

            <p className="text-sm text-slate-500 mt-1">
              Keep your profile updated to improve your personalized CareerOS recommendations.
            </p>

          </div>

          <div className="text-right">

            <p className="text-2xl font-extrabold text-blue-600">
              {completionPercentage}%
            </p>

            <p className="text-xs text-slate-400">
              Complete
            </p>

          </div>

        </div>

        <div className="mt-5 h-3 bg-slate-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{
              width: `${completionPercentage}%`,
            }}
          />

        </div>

      </div>
    )}

    {/* ==================================================
        MAIN PROFILE CONTENT
    ================================================== */}

    {!isEditing && (

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

              <User size={21} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500">
                Your basic profile information
              </p>

            </div>

          </div>

          <div className="grid sm:grid-cols-2 gap-5">

            {/* NAME */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Full Name
              </p>

              <p className="font-bold text-slate-800 mt-2">
                {name}
              </p>

            </div>

            {/* AGE */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Age
              </p>

              <p className="font-bold text-slate-800 mt-2">
                {age}
              </p>

            </div>

            {/* STATE */}

            <div className="bg-slate-50 rounded-2xl p-5 sm:col-span-2">

              <div className="flex items-center gap-2">

                <MapPin
                  size={16}
                  className="text-slate-400"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  State
                </p>

              </div>

              <p className="font-bold text-slate-800 mt-2">
                {state}
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            STATUS CARD
        ================================================== */}

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">

              <Briefcase size={21} />

            </div>

            <div>

              <p className="text-blue-100 text-sm">
                Profile Status
              </p>

              <h2 className="text-2xl font-extrabold">
                Active
              </h2>

            </div>

          </div>

          <div className="border-t border-white/20 my-7" />

          <p className="text-blue-100 text-sm leading-6">
            Your CareerOS profile is being used to personalize your career exploration, recommendations and roadmap.
          </p>

        </div>

        {/* ==================================================
            EDUCATION
        ================================================== */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

              <GraduationCap size={22} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Education
              </h2>

              <p className="text-sm text-slate-500">
                Your current education background
              </p>

            </div>

          </div>

          <div className="grid sm:grid-cols-2 gap-5">

            <div className="border border-slate-200 rounded-2xl p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Education
              </p>

              <p className="text-lg font-bold text-slate-800 mt-2">
                {education}
              </p>

            </div>

            <div className="border border-slate-200 rounded-2xl p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Stream / Branch
              </p>

              <p className="text-lg font-bold text-slate-800 mt-2">
                {specialization}
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            CAREER GOAL
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">

              <Target size={21} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Career Goal
              </h2>

              <p className="text-sm text-slate-500">
                Your selected direction
              </p>

            </div>

          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
              Dream Career
            </p>

            <p className="text-xl font-extrabold text-blue-800 mt-2">
              {dreamCareer}
            </p>

          </div>

          {careerId && (

            <div className="mt-4">

              <p className="text-xs text-slate-400">
                Career Profile ID
              </p>

              <p className="text-xs font-mono text-slate-500 mt-1 break-all">
                {careerId}
              </p>

            </div>

          )}

        </div>

        {/* ==================================================
            INTEREST
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">

              <Heart size={21} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Area of Interest
              </h2>

              <p className="text-sm text-slate-500">
                Your selected interest
              </p>

            </div>

          </div>

          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5">

            <p className="text-lg font-bold text-pink-700">
              {interest}
            </p>

          </div>

        </div>

        {/* ==================================================
            CAREER JOURNEY
        ================================================== */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

              <Target size={21} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Career Profile
              </h2>

              <p className="text-sm text-slate-500">
                Your current career journey
              </p>

            </div>

          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5">

              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                Education
              </p>

              <p className="font-bold text-slate-800 mt-2">
                {education}
              </p>

            </div>

            <div className="hidden md:block text-slate-300 text-2xl">
              →
            </div>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5">

              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                Specialization
              </p>

              <p className="font-bold text-slate-800 mt-2">
                {specialization}
              </p>

            </div>

            <div className="hidden md:block text-slate-300 text-2xl">
              →
            </div>

            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-5">

              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">
                Career
              </p>

              <p className="font-bold text-blue-800 mt-2">
                {dreamCareer}
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            SKILLS
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">

              <Code2 size={21} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Skills
              </h2>

              <p className="text-sm text-slate-500">
                Skills you've selected
              </p>

            </div>

          </div>

          {skills.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {skills.map((skill) => (

                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl text-sm font-semibold"
                >
                  <CheckCircle2 size={14} />

                  {skill}

                </span>

              ))}

            </div>

          ) : (

            <div className="bg-slate-50 rounded-2xl p-5 text-center">

              <Code2
                size={28}
                className="mx-auto text-slate-300 mb-2"
              />

              <p className="text-sm text-slate-500">
                No skills selected yet.
              </p>

            </div>

          )}

        </div>

      </div>

    )}

    {/* ==================================================
        BOTTOM EDIT
    ================================================== */}

    {!isEditing && (

      <div className="mt-6 bg-white rounded-3xl shadow-md p-6 text-center">

        <div className="flex flex-col items-center">

          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">

            <Pencil size={20} />

          </div>

          <h2 className="text-lg font-bold text-slate-800">
            Want to update your profile?
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-5">
            Update your education, career goal and skills whenever your plans change.
          </p>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <Pencil size={17} />

            Edit Profile
          </button>

        </div>

      </div>

    )}

  </div>

</div>
  

);
}

export default Profile;

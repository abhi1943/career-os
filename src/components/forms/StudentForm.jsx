import { useState } from "react";
import { useContext } from "react";
import { CareerContext } from "../../context/CareerContext";

function StudentForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
    interest: "",
    dreamCareer: "",
    state: "",
  });
  const { setStudent } = useContext(CareerContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setStudent(formData);
  };

  return (
    <section className="bg-slate-100 py-20">

      <div className="max-w-5xl mx-auto">

        <div className="bg-white shadow-2xl rounded-3xl p-10">

          <h2 className="text-4xl font-bold text-center text-slate-800">
            Student Career Profile
          </h2>

          <p className="text-center text-slate-500 mt-3">
            Fill in your details and let CareerOS guide your future.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6 mt-10"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="border p-4 rounded-xl"
              onChange={handleChange}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              className="border p-4 rounded-xl"
              onChange={handleChange}
            />

            <select
              name="education"
              className="border p-4 rounded-xl"
              onChange={handleChange}
            >
              <option value="">Current Education</option>

              <option value="after10th">10th</option>

              <option value="intermediate">Intermediate</option>

              <option value="polytechnic">Polytechnic</option>

              <option value="iti">ITI</option>

              <option value="degree">Degree</option>

              <option value="engineering">B.Tech / Engineering</option>

              <option value="medical">Medical</option>

              <option value="government">Government Jobs</option>
            </select>

            <select
              name="interest"
              className="border p-4 rounded-xl"
              onChange={handleChange}
            >
              <option value="">Interest</option>
              <option>Technology</option>
              <option>Medical</option>
              <option>Government Jobs</option>
              <option>Business</option>
              <option>Arts</option>
            </select>

            <input
              type="text"
              name="dreamCareer"
              placeholder="Dream Career"
              className="border p-4 rounded-xl"
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              className="border p-4 rounded-xl"
              onChange={handleChange}
            />

            <button
              className="md:col-span-2 bg-blue-600 text-white py-4 rounded-xl text-lg hover:bg-blue-700 transition"
            >
              Generate My Career Roadmap
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default StudentForm;
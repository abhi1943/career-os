```jsx
import { useEffect, useState } from "react";

const initialState = {
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "Applied",
    appliedDate: "",
    jobLink: "",
    notes: "",
};

function ApplicationForm({ editing, onSave }) {

    const [form, setForm] = useState(initialState);

    useEffect(() => {

        if (editing) {

            setForm({
                company: editing.company || "",
                role: editing.role || "",
                location: editing.location || "",
                salary: editing.salary || "",
                status: editing.status || "Applied",
                appliedDate: editing.appliedDate || "",
                jobLink: editing.jobLink || "",
                notes: editing.notes || "",
            });

        } else {

            setForm(initialState);

        }

    }, [editing]);

    function handleChange(e) {

        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    }

    function handleSubmit(e) {

        e.preventDefault();

        if (!form.company || !form.role) {

            alert("Company and Role are required.");

            return;

        }

        onSave(form);

        setForm(initialState);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-lg p-8 mt-8"
        >

            <h2 className="text-2xl font-bold mb-6">

                {editing
                    ? "Edit Application"
                    : "Add New Application"}

            </h2>

            <div className="grid md:grid-cols-2 gap-5">

                <input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                />

                <input
                    name="role"
                    placeholder="Role"
                    value={form.role}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                />

                <input
                    name="salary"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                />

                <input
                    type="date"
                    name="appliedDate"
                    value={form.appliedDate}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                >

                    <option>Applied</option>

                    <option>Interview</option>

                    <option>Rejected</option>

                    <option>Offer</option>

                </select>

                <input
                    name="jobLink"
                    placeholder="Job URL"
                    value={form.jobLink}
                    onChange={handleChange}
                    className="border rounded-xl p-3 md:col-span-2"
                />

                <textarea
                    name="notes"
                    rows={4}
                    placeholder="Notes..."
                    value={form.notes}
                    onChange={handleChange}
                    className="border rounded-xl p-3 md:col-span-2"
                />

            </div>

            <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >

                {editing
                    ? "Update Application"
                    : "Add Application"}

            </button>

        </form>

    );

}

export default ApplicationForm;
```

```jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
    addApplication,
    getApplications,
    updateApplication,
    deleteApplication,
} from "../../services/jobTrackerService";

import ApplicationForm from "../../components/jobTracker/ApplicationForm";
import ApplicationTable from "../../components/jobTracker/ApplicationTable";
import ApplicationFilters from "../../components/jobTracker/ApplicationFilters";
import ApplicationStats from "../../components/jobTracker/ApplicationStats";

function JobTracker() {

    const { user } = useAuth();

    const [applications, setApplications] = useState([]);

    const [editing, setEditing] = useState(null);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    async function loadApplications() {

        if (!user) return;

        const data = await getApplications(user.uid);

        setApplications(data);

    }

    useEffect(() => {

        loadApplications();

    }, [user]);

    async function handleSave(application) {

        if (!user) return;

        if (editing) {

            await updateApplication(editing.id, application);

            setEditing(null);

        } else {

            await addApplication(user.uid, application);

        }

        loadApplications();

    }

    async function handleDelete(id) {

        if (!window.confirm("Delete this application?")) return;

        await deleteApplication(id);

        loadApplications();

    }

    const filteredApplications = applications.filter((app) => {

        const companyMatch =
            app.company
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const roleMatch =
            app.role
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const statusMatch =
            statusFilter === "All"
                ? true
                : app.status === statusFilter;

        return (companyMatch || roleMatch) && statusMatch;

    });

    return (

        <section className="min-h-screen bg-slate-100 py-10">

            <div className="max-w-7xl mx-auto px-6">

                <h1 className="text-4xl font-bold mb-8">

                    Job Application Tracker

                </h1>

                <ApplicationStats
                    applications={applications}
                />

                <ApplicationFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <ApplicationForm
                    editing={editing}
                    onSave={handleSave}
                />

                <ApplicationTable
                    applications={filteredApplications}
                    onEdit={setEditing}
                    onDelete={handleDelete}
                />

            </div>

        </section>

    );

}

export default JobTracker;
```

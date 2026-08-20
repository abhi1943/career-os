import axios from "axios";

// ======================================================
// CareerOS Saved Jobs API
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// ======================================================
// GET ALL SAVED JOBS
// ======================================================

export async function getSavedJobs() {
  const response = await axios.get(
    `${API_BASE_URL}/api/saved-jobs`
  );

  return response.data;
}

// ======================================================
// GET SAVED JOB COUNT
// ======================================================

export async function getSavedJobCount() {
  const response = await axios.get(
    `${API_BASE_URL}/api/saved-jobs/count`
  );

  return response.data;
}

// ======================================================
// CHECK SAVED JOB
// ======================================================

export async function checkSavedJob(jobId) {
  const response = await axios.get(
    `${API_BASE_URL}/api/saved-jobs/${jobId}`
  );

  return response.data;
}

// ======================================================
// SAVE JOB
// ======================================================

export async function saveJob(job) {
  const response = await axios.post(
    `${API_BASE_URL}/api/saved-jobs`,
    job
  );

  return response.data;
}

// ======================================================
// REMOVE SAVED JOB
// ======================================================

export async function removeSavedJob(jobId) {
  const response = await axios.delete(
    `${API_BASE_URL}/api/saved-jobs/${jobId}`
  );

  return response.data;
}
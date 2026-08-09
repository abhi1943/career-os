export function saveRecentCareer(career) {
  const existing =
    JSON.parse(localStorage.getItem("recentCareers")) || [];

  const updated = [
    career,
    ...existing.filter((item) => item.id !== career.id),
  ].slice(0, 5);

  localStorage.setItem(
    "recentCareers",
    JSON.stringify(updated)
  );
}

export function getRecentCareers() {
  return (
    JSON.parse(localStorage.getItem("recentCareers")) || []
  );
}
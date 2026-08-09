const STORAGE_KEY = "careeros_recent_searches";

export function getRecentSearches() {
  const searches = localStorage.getItem(STORAGE_KEY);

  return searches ? JSON.parse(searches) : [];
}

export function saveRecentSearch(search) {
  if (!search) return;

  let searches = getRecentSearches();

  // Remove duplicate
  searches = searches.filter(
    (item) => item.toLowerCase() !== search.toLowerCase()
  );

  searches.unshift({
    text: search,
    time: new Date().toLocaleString(),
  });

  // Keep only latest 5 searches
  searches = searches.slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}
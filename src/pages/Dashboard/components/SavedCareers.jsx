import { useContext } from "react";
import { FavoritesContext } from "../../../context/FavoritesContext";

function SavedCareers() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">
        ❤️ Saved Careers
      </h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">
          No saved careers yet.
        </p>
      ) : (
        <div className="space-y-4">
          {favorites.map((career) => (
            <div
              key={career.id}
              className="border rounded-xl p-4"
            >
              <h3 className="font-bold">
                {career.name}
              </h3>

              <p className="text-gray-500">
                {career.averageSalary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedCareers;
// // ======================================================
// // CareerOS Search History API
// // ======================================================


// import api from "./api";
// import { auth } from "../firebase/firebase";

// // ======================================================
// // USER CONFIG
// // ======================================================

// function getUserHeaders() {
//   const uid =
//     auth.currentUser?.uid;

//   if (!uid) {
//     throw new Error(
//       "CareerOS: User is not authenticated."
//     );
//   }

//   return {
//     headers: {
//       "X-User-Id": uid,
//     },
//   };
// }
// // ======================================================
// // GET SEARCH HISTORY
// // ======================================================

// // ======================================================

// export async function getSearchHistory() {
//   try {
//     const response = await api.get(
//   "/search-history",
//   getUserHeaders()
// );

//     return (
//       response?.data?.history ||
//       []
//     );
//   } catch (error) {
//     console.error(
//       "CareerOS Search History Error:",
//       error
//     );

//     throw error;
//   }
// }

// // ======================================================
// // GET SEARCH HISTORY COUNT
// // ======================================================
// //
// // Backend:
// // GET /api/search-history/count
// //
// // ======================================================

// export async function getSearchHistoryCount() {
//   try {
//     const response = await api.get(
//   "/search-history/count",
//   getUserHeaders()
// );

//     return Number(
//       response?.data?.count || 0
//     );
//   } catch (error) {
//     console.error(
//       "CareerOS Search History Count Error:",
//       error
//     );

//     throw error;
//   }
// }

// // ======================================================
// // GET SINGLE SEARCH HISTORY ITEM
// // ======================================================
// //
// // Backend:
// // GET /api/search-history/:id
// //
// // ======================================================

// export async function getSearchHistoryById(
//   id
// ) {
//   if (!id) {
//     return null;
//   }

//   try {
//     const response =
//       await api.get(
//         `/search-history/${id}`
//       );

//     return (
//       response?.data?.history ||
//       null
//     );
//   } catch (error) {
//     console.error(
//       "CareerOS Search History Details Error:",
//       error
//     );

//     throw error;
//   }
// }

// // ======================================================
// // DELETE SEARCH HISTORY ITEM
// // ======================================================
// //
// // Backend:
// // DELETE /api/search-history/:id
// //
// // ======================================================

// export async function deleteSearchHistory(
//   id
// ) {
//   if (!id) {
//     return false;
//   }

//   try {
//     const response =
//   await api.delete(
//     `/search-history/${id}`,
//     getUserHeaders()
//   );
//     return Boolean(
//       response?.data?.success
//     );
//   } catch (error) {
//     console.error(
//       "CareerOS Delete Search History Error:",
//       error
//     );

//     throw error;
//   }
// }

// // ======================================================
// // CLEAR SEARCH HISTORY
// // ======================================================
// //
// // Backend:
// // DELETE /api/search-history
// //
// // ======================================================

// export async function clearSearchHistory() {
//   try {
//     const response =
//   await api.delete(
//     "/search-history",
//     getUserHeaders()
//   );

//     return {
//       success:
//         Boolean(
//           response?.data?.success
//         ),

//       removed:
//         Number(
//           response?.data?.removed || 0
//         ),
//     };
//   } catch (error) {
//     console.error(
//       "CareerOS Clear Search History Error:",
//       error
//     );

//     throw error;
//   }
// }

// // ======================================================
// // DEFAULT EXPORT
// // ======================================================

// export default {
//   getSearchHistory,
//   getSearchHistoryCount,
//   getSearchHistoryById,
//   deleteSearchHistory,
//   clearSearchHistory,
// };

// ======================================================
// CareerOS Search History API
// ======================================================

import api from "./api";
import { auth } from "../firebase/firebase";

// ======================================================
// GET FIREBASE AUTH HEADERS
// ======================================================

async function getAuthHeaders() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "CareerOS: User is not authenticated."
    );
  }

  const token = await user.getIdToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Id": user.uid,
    },
  };
}

// ======================================================
// GET SEARCH HISTORY
// GET /api/search-history
// ======================================================

export async function getSearchHistory() {
  try {
    const config = await getAuthHeaders();

    const response = await api.get(
      "/search-history",
      config
    );

    return Array.isArray(
      response?.data?.history
    )
      ? response.data.history
      : [];
  } catch (error) {
    console.error(
      "CareerOS Search History Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// GET SEARCH HISTORY COUNT
// GET /api/search-history/count
// ======================================================

export async function getSearchHistoryCount() {
  try {
    const config = await getAuthHeaders();

    const response = await api.get(
      "/search-history/count",
      config
    );

    return Number(
      response?.data?.count || 0
    );
  } catch (error) {
    console.error(
      "CareerOS Search History Count Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// GET SINGLE SEARCH HISTORY ITEM
// GET /api/search-history/:id
// ======================================================

export async function getSearchHistoryById(id) {
  if (!id) {
    return null;
  }

  try {
    const config = await getAuthHeaders();

    const response = await api.get(
      `/search-history/${id}`,
      config
    );

    return (
      response?.data?.history ||
      null
    );
  } catch (error) {
    console.error(
      "CareerOS Search History Details Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// DELETE SEARCH HISTORY ITEM
// DELETE /api/search-history/:id
// ======================================================

export async function deleteSearchHistory(id) {
  if (!id) {
    return false;
  }

  try {
    const config = await getAuthHeaders();

    const response = await api.delete(
      `/search-history/${id}`,
      config
    );

    return Boolean(
      response?.data?.success
    );
  } catch (error) {
    console.error(
      "CareerOS Delete Search History Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// CLEAR SEARCH HISTORY
// DELETE /api/search-history
// ======================================================

export async function clearSearchHistory() {
  try {
    const config = await getAuthHeaders();

    const response = await api.delete(
      "/search-history",
      config
    );

    return {
      success: Boolean(
        response?.data?.success
      ),

      removed: Number(
        response?.data?.removed || 0
      ),
    };
  } catch (error) {
    console.error(
      "CareerOS Clear Search History Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  getSearchHistory,
  getSearchHistoryCount,
  getSearchHistoryById,
  deleteSearchHistory,
  clearSearchHistory,
};
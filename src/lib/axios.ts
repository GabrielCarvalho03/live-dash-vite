import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/users/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("liveRefreshToken");
//       const token = localStorage.getItem("liveToken");
//       const userId = JSON.parse(atob(token?.split(".")[1] || "null"))?.id;

//       if (!refreshToken || !userId) {
//         localStorage.clear();
//         router.push("//");
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               originalRequest.headers["Authorization"] = token;
//               resolve(api(originalRequest));
//             },
//             reject: (err: any) => reject(err),
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const res = await api.post("/users/refresh-token", {
//           tokenId: refreshToken,
//           userId,
//         });

//         const newToken = res.data.token;
//         const newRefreshToken = res.data.refreshToken;

//         localStorage.setItem("liveToken", newToken);
//         localStorage.setItem("liveRefreshToken", newRefreshToken);

//         api.defaults.headers.common["Authorization"] = newToken;
//         processQueue(null, newToken);

//         originalRequest.headers["Authorization"] = newToken;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         localStorage.clear();
//         router.push("//");
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

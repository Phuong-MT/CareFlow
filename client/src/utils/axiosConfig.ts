import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const rawPersist = localStorage.getItem('persist:root');
      if (rawPersist) {
        try {
          const persistObj = JSON.parse(rawPersist);
          if (persistObj.user) {
            const userObj = JSON.parse(persistObj.user);
            const accessToken = userObj.access_token;
            if (accessToken && config.headers) {
              config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
          }
        } catch (e) {
          console.error('Error parsing persisted user', e);
        }
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               if (originalRequest.headers) {
//                 originalRequest.headers['Authorization'] = `Bearer ${token}`;
//               }
//               resolve(api(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const newToken = await refreshAccessToken();
//         localStorage.setItem('accessToken', newToken);
//         api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//         processQueue(null, newToken);

//         if (originalRequest.headers) {
//           originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//         }

//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError as AxiosError, null);
//         window.location.href = '/login'; // or dispatch logout
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;

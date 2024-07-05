import axios, { AxiosInstance } from "axios";


const createServerInstance = (): AxiosInstance => {
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {

          const accessToken = localStorage.getItem("accesToken");
          if(accessToken != "undefined"){
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )
    return axiosInstance;
  };
  
  const serverInstance = createServerInstance();
  
  export default serverInstance;
import type { AxiosError } from "axios";


export const handleApiError = (error: AxiosError) => {
  if (error.response) {
    console.error("Respuesta del servidor con error: ", error.response.data);
  } else if (error.request) {
    console.error("No hubo respuesta del servidor: ", error.request);
  } else {
    console.log("Error desconocido", error);
  }
};

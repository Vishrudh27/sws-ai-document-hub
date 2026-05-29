import api from "./api";

export const fetchDocuments = () => api.get("/files").then((response) => response.data);

export const downloadDocument = (id) => {
  window.open(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/files/download/${id}`, "_blank");
};

export const deleteDocument = (id) => api.delete(`/files/${id}`);

export const uploadFiles = (files, onUploadProgress) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return api.post("/files/upload/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
    validateStatus: (status) => status < 500,
  });
};

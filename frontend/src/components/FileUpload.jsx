import { useState } from "react";
import axios from "axios";

function FileUpload() {

  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {

    const selectedFiles = Array.from(e.target.files);

    const mappedFiles = selectedFiles.map(file => ({
      file,
      progress: 0,
      status: "pending"
    }));

    setFiles(mappedFiles);
  };

  const uploadFiles = async () => {

    files.forEach(async (item, index) => {

      const formData = new FormData();

      formData.append("file", item.file);

      await axios.post(
        "http://localhost:8080/api/files/upload",
        formData,
        {
          onUploadProgress: (event) => {

            const percent = Math.round(
              (event.loaded * 100) / event.total
            );

            setFiles(prev => {

              const updated = [...prev];

              updated[index] = {
                ...updated[index],
                progress: percent,
                status: percent === 100
                  ? "complete"
                  : "uploading"
              };

              return updated;
            });
          }
        }
      );
    });
  };

  return (
    <div>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFiles}
      />

      <button onClick={uploadFiles}>
        Upload
      </button>

      {files.map((item, index) => (

        <div key={index}>

          <p>{item.file.name}</p>

          <p>{item.status}</p>

          <progress
            value={item.progress}
            max="100"
          />

          <span>{item.progress}%</span>

        </div>

      ))}

    </div>
  );
}

export default FileUpload;

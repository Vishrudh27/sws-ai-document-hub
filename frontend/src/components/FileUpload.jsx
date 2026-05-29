import { useRef, useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFiles } from "../services/fileService";

const toKB = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;

function FileUpload() {
  const fileInputRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectedFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles).map((file) => ({
      file,
      progress: 0,
      status: "Pending",
      error: null,
    }));

    setQueue((current) => {
      const existing = new Set(current.map((item) => `${item.file.name}:${item.file.size}`));
      const unique = incoming.filter((item) => !existing.has(`${item.file.name}:${item.file.size}`));
      return [...current, ...unique];
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      handleSelectedFiles(event.dataTransfer.files);
    }
  };

  const updateProgress = (loaded) => {
    let remaining = loaded;
    setQueue((current) =>
      current.map((item) => {
        const allocated = Math.min(item.file.size, Math.max(0, remaining));
        const progress = item.file.size > 0 ? Math.round((allocated / item.file.size) * 100) : 0;
        remaining -= allocated;
        return {
          ...item,
          progress,
          status: progress === 100 ? "Uploading" : "Uploading",
        };
      })
    );
  };

  const handleUpload = async () => {
    if (queue.length === 0) {
      return;
    }

    setIsUploading(true);
    setQueue((current) => current.map((item) => ({ ...item, status: "Uploading", progress: 0 })));

    try {
      const response = await uploadFiles(queue.map((item) => item.file), (event) => {
        updateProgress(event.loaded);
      });

      if (response.status === 202) {
        setQueue((current) => current.map((item) => ({ ...item, status: "Processing", progress: 100 })));
        toast.success("Upload in progress — processing files in background");
      } else {
        setQueue((current) => current.map((item) => ({ ...item, status: "Complete", progress: 100 })));
        toast.success("Files uploaded successfully");
        window.dispatchEvent(new Event("documentsUpdated"));
      }
    } catch (error) {
      setQueue((current) => current.map((item) => ({ ...item, status: "Failed", error: "Upload failed" })));
      toast.error("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setQueue((current) => current.filter((_, idx) => idx !== index));
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Upload Area</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Drag and drop PDFs or choose files</h2>
          <p className="mt-2 text-sm text-slate-500">All files are uploaded to the backend API and tracked with full progress and status states.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <UploadCloud size={18} />
            Choose Files
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={queue.length === 0 || isUploading}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Upload
          </button>
        </div>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="mt-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-blue-400 hover:bg-slate-100"
      >
        <p className="text-sm font-medium text-slate-700">Drop PDF files here to add them to the upload queue.</p>
        <p className="mt-2 text-sm text-slate-500">Maximum 20MB per file. Files added here will be uploaded using the real API.</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf"
        className="hidden"
        onChange={(event) => event.target.files && handleSelectedFiles(event.target.files)}
      />

      <div className="mt-6 space-y-4">
        {queue.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No files added yet. Add PDF documents to start uploading.
          </div>
        ) : (
          queue.map((item, index) => (
            <div
              key={`${item.file.name}-${item.file.size}-${index}`}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:bg-white hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{item.file.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{toKB(item.file.size)} · PDF</p>
                  <p className="mt-1 text-xs text-slate-400">Status: {item.status}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
              <div className="mt-4 rounded-full bg-slate-200 h-3 overflow-hidden">
                <div
                  className={`h-3 ${item.status === "Failed" ? "bg-red-500" : "bg-blue-600"}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FileUpload;

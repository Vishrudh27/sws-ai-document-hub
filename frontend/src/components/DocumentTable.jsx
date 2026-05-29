import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteDocument, downloadDocument, fetchDocuments } from "../services/fileService";

function DocumentTable() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setError("Unable to load documents right now.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();

    const refresh = () => {
      loadDocuments();
    };

    window.addEventListener("documentsUpdated", refresh);
    return () => window.removeEventListener("documentsUpdated", refresh);
  }, []);

  const handleDownload = (id) => {
    downloadDocument(id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      toast.success("Document deleted successfully");
      loadDocuments();
    } catch (err) {
      toast.error("Could not delete document.");
      console.error(err);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Document Library</h2>
          <p className="mt-1 text-sm text-slate-500">Manage, download, and remove documents stored in the backend.</p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          {documents.length} documents
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left text-sm uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Uploaded</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <tr key={index} className="animate-pulse border-b border-slate-200 bg-slate-50">
                  <td className="h-16 px-6 py-4" colSpan="4" />
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-sm text-slate-500">
                  No documents available yet. Upload documents to populate your library.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-200 transition-all duration-200 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{doc.fileName}</div>
                    <div className="text-xs text-slate-500">{doc.fileType || "PDF"}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{(doc.fileSize / 1024).toFixed(2)} KB</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(doc.uploadedAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownload(doc.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
                      >
                        <Download size={16} /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentTable;

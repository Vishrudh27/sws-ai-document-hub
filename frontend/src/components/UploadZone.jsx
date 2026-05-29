import { Upload } from "lucide-react";

function UploadZone() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-blue-200 p-16 text-center">

      <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <Upload size={32} />
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        Drop files here or click to browse
      </h2>

      <p className="text-gray-500 mb-6">
        Any file type • Up to 20 MB per file
      </p>

      <div className="flex justify-center gap-3">
        <button className="px-5 py-2 rounded-full bg-gray-100">
          Single file
        </button>

        <button className="px-5 py-2 rounded-full bg-gray-100">
          Bulk upload
        </button>

        <button className="px-5 py-2 rounded-full bg-blue-100 text-blue-600">
          Try 4+ files to trigger notifications
        </button>
      </div>
    </div>
  );
}

export default UploadZone;

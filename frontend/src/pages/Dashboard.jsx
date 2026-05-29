
import Header from "../components/Header";
import UploadZone from "../components/UploadZone";
import UploadQueue from "../components/UploadQueue";
import DocumentTable from "../components/DocumentTable";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="max-w-6xl mx-auto p-6">

        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-6">
          <strong>Simulated demo</strong> —
          Upload 4 or more files to trigger notifications.
        </div>

        <UploadZone />

        <UploadQueue />

        <DocumentTable />

      </div>

    </div>
  );
}

export default Dashboard;

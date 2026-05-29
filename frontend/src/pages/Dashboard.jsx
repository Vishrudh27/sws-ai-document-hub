import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import DocumentTable from "../components/DocumentTable";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <section className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-blue-200">Document dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight">Manage documents with confidence</h1>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-blue-100">Upload files</p>
                <p className="mt-2 text-2xl font-semibold">PDF library</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-blue-100">Notifications</p>
                <p className="mt-2 text-2xl font-semibold">Real time alerts</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Quick summary</h2>
            <p className="mt-2 text-sm text-slate-500">Upload files, monitor notifications, and keep your document library current.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Ready for upload</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">PDF only</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Background processing</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">4+ files</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6">
          <FileUpload />
          <DocumentTable />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

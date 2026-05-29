import { ArrowLeft, FileText } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex flex-1 items-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-sm">
              <FileText size={20} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-slate-900">SWS AI Document Hub</h1>
              <p className="text-sm text-slate-500">Manage documents, upload files, and monitor notifications in real time.</p>
            </div>
          </div>
        </div>

        <NotificationCenter />
      </div>
    </header>
  );
}

export default Header;

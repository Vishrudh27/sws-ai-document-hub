import { Bell, ArrowLeft, FileText } from "lucide-react";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:text-black">
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={18} />
            </div>

            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl">
                SWS AI Document Hub
              </h1>

              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                LIVE DEMO
              </span>
            </div>
          </div>
        </div>

        <button className="relative">
          <Bell size={22} />
        </button>
      </div>
    </header>
  );
}

export default Header;

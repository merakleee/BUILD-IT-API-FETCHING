import { useState } from "react";
import FetchBasics from "./pages/FetchBasics";
import Temporary from "./pages/temporary";

export default function App() {
  const [active, setActive] = useState("fetch");

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 px-6 py-6">
        <h1 className="text-indigo-400 font-semibold mb-10">
         API Fetching 
        </h1>

        <nav className="space-y-2 text-sm">
          <button
            onClick={() => setActive("fetch")}
            className={`w-full text-left px-3 py-2 rounded-md transition ${
              active === "fetch"
                ? "bg-indigo-500/20 text-indigo-400"
                : "hover:bg-zinc-800"
            }`}
          >
            fetch()
          </button>

          <button
            onClick={() => setActive("other")}
            className={`w-full text-left px-3 py-2 rounded-md transition ${
              active === "other"
                ? "bg-indigo-500/20 text-indigo-400"
                : "hover:bg-zinc-800"
            }`}
          >
            another concept
          </button>
        </nav>
      </aside>

      {/* Page */}
      <main className="flex-1 p-10">
        {active === "fetch" && <FetchBasics />}
        {active === "other" && <Temporary />}
      </main>
    </div>
  );
}

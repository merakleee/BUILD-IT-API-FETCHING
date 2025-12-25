import { useState } from "react";
import FetchBasics from "./pages/FetchBasics";
import XhrLegacy from "./pages/XhrLegacy";
import PromisesAsync from "./pages/PromisesAsync";
import RequestConfig from "./pages/RequestConfig";
import ResponseParsing from "./pages/ResponseParsing";
import ErrorHandling from "./pages/ErrorHandling";

const TABS = [
  { id: "fetch", label: "fetch()", component: FetchBasics },
  { id: "xhr", label: "XMLHttpRequest (Legacy)", component: XhrLegacy },
  { id: "promises", label: "Promises & async/await", component: PromisesAsync },
  { id: "config", label: "Request configuration", component: RequestConfig },
  { id: "parsing", label: "Response parsing", component: ResponseParsing },
  { id: "errors", label: "Error handling", component: ErrorHandling },
];

export default function App() {
  const [active, setActive] = useState("fetch");
  const ActivePage =
    TABS.find((tab) => tab.id === active)?.component ?? FetchBasics;

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 px-6 py-6">
        <h1 className="text-indigo-400 font-semibold mb-8">API Fetching</h1>
        <p className="text-xs text-zinc-400 mb-6">
          Understanding HTTP requests step by step.
        </p>

        <nav className="space-y-2 text-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition ${active === tab.id
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-zinc-300 hover:bg-zinc-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Page */}
      <main className="flex-1 p-10 overflow-auto">
        <ActivePage />
      </main>
    </div>
  );
}

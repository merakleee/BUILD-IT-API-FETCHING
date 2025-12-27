import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import XhrLegacy from "./pages/XhrLegacy";
import PromisesAsync from "./pages/PromisesAsync";
import RequestConfig from "./pages/RequestConfig";
import ResponseParsing from "./pages/ResponseParsing";
import ErrorHandling from "./pages/ErrorHandling";
import APIMethodsComparison from "./pages/APIMethodsComparison";
import UseHook from "./pages/UseHook";

const queryClient = new QueryClient();

const TABS = [
  {
    id: "comparison",
    label: "Overview: Fetching Methods",
    component: APIMethodsComparison,
    icon: "🌐",
    description: "Compare Fetch, Axios, React Query and more",
    category: "Overview",
  },
  {
    id: "xhr",
    label: "XMLHttpRequest",
    component: XhrLegacy,
    icon: "⚙",
    description: "Legacy comparison",
    category: "Basics",
  },
  {
    id: "promises",
    label: "Promises & async/await",
    component: PromisesAsync,
    icon: "⏳",
    description: "Async patterns",
    category: "Patterns",
  },
  {
    id: "config",
    label: "Request Configuration",
    component: RequestConfig,
    icon: "⚡",
    description: "Methods, headers, body",
    category: "Configuration",
  },
  {
    id: "parsing",
    label: "Response Parsing",
    component: ResponseParsing,
    icon: "📦",
    description: ".json(), .text(), .blob()",
    category: "Responses",
  },
  {
    id: "errors",
    label: "Error Handling",
    component: ErrorHandling,
    icon: "⚠",
    description: "try/catch patterns",
    category: "Error Handling",
  },
  {
    id: "use-hook",
    label: "React use() hook",
    component: UseHook,
    icon: "🧠",
    description: "Suspense + Error Boundary flow",
    category: "React 19",
  },
];

export default function App() {
  const [active, setActive] = useState("comparison");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const ActivePage =
    TABS.find((tab) => tab.id === active)?.component ?? APIMethodsComparison;
  const activeTab = TABS.find((tab) => tab.id === active);
  const currentIndex = TABS.findIndex((t) => t.id === active);
  const total = TABS.length;

  const goPrev = () => {
    if (currentIndex > 0) setActive(TABS[currentIndex - 1].id);
  };
  const goNext = () => {
    if (currentIndex < total - 1) setActive(TABS[currentIndex + 1].id);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex bg-black text-zinc-100">
        {/* Sidebar */}
        <aside
          className={`${sidebarCollapsed ? "w-20" : "w-80"
            } border-r border-zinc-800 flex flex-col transition-all duration-300`}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    API Fetching
                  </h1>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Collapse sidebar"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-zinc-400">
                  Master HTTP requests with interactive visualizations
                </p>
              </>
            ) : (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-full p-2 hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center"
                title="Expand sidebar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`w-full text-left rounded-lg transition-all duration-200 ${active === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                >
                  {!sidebarCollapsed ? (
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0 mt-0.5">
                          {tab.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {tab.label}
                            </span>
                            {active === tab.id && (
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs opacity-80 line-clamp-1">
                            {tab.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900/50">
                              {index + 1}
                            </span>
                            <span className="text-xs opacity-60">
                              {tab.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 flex items-center justify-center">
                      <span className="text-2xl" title={tab.label}>
                        {tab.icon}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-zinc-800">
              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">?</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Need Help?</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Click any topic to explore interactive examples
                </p>
                <div className="text-xs text-zinc-500">
                  Progress: {currentIndex + 1} of {total}
                </div>
                <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                    style={{
                      width: `${((currentIndex + 1) / total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="border-b border-zinc-800 px-8 py-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{activeTab?.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {activeTab?.label}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {activeTab?.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Previous topic"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="text-sm text-zinc-500 min-w-[60px] text-center">
                    {currentIndex + 1} / {total}
                  </span>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === total - 1}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Next topic"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Category badge */}
                <div className="px-3 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 text-xs font-medium">
                  {activeTab?.category}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-10 animate-fade-in">
              <ActivePage />
            </div>
          </div>

          {/* Bottom Navigation */}
          <footer className="border-t border-zinc-800 px-8 py-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <span>Team archITects</span>
                <span>•</span>
                <span>API Fetching Guide</span>
              </div>

              <div className="flex items-center gap-3">
                {currentIndex > 0 && (
                  <button
                    onClick={goPrev}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                )}

                {currentIndex < total - 1 && (
                  <button
                    onClick={goNext}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    Next Topic
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </footer>

          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `}</style>
        </main>
      </div>
    </QueryClientProvider>
  );
}

import { useState, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { animations, diagrams } from "../Animations";

const CAT_API = "https://api.thecatapi.com/v1/images/search";

const methodDescriptions = {
  native: {
    name: "Native Fetch",
    emoji: "🔵",
    description: "Native Fetch uses the browser's built-in fetch API to make HTTP requests with minimal overhead. You manually parse JSON, check status codes, and handle errors in try/catch for full control and learning.",
    features: [
      "No dependencies",
      "Manual JSON parsing",
      "Manual error handling",
      "Great for learning"
    ],
  },
  axios: {
    name: "Axios",
    emoji: "🟢",
    description: "Axios is a promise-based HTTP client that automatically parses JSON and normalizes browser differences. It offers a clean API, timeouts, and richer error objects to simplify reliable requests.",
    features: [
      "Auto JSON parsing",
      "Built-in timeout",
      "Better error detection",
      "Smaller code"
    ],
  },
  "axios-improved": {
    name: "Axios Improved",
    emoji: "🟡",
    description: "Create a preconfigured Axios instance and attach request/response interceptors to centralize headers, auth, logging, and error handling. This keeps component code tiny and enforces consistent behavior across all API calls.",
    features: [
      "Request interceptors",
      "Response interceptors",
      "Global error handling",
      "Auth token injection"
    ],
  },
  "react-query": {
    name: "React Query",
    emoji: "🟣",
    description: "React Query manages fetching, caching, and synchronizing server state so components focus on rendering. It handles loading/error states, background refetching, and deduplication with minimal code.",
    features: [
      "Automatic caching",
      "Stale data management",
      "Background refetch",
      "Complex queries"
    ],
  }
};

// animations and diagrams imported from src/Animations/index.js
export default function APIMethodsComparison() {
  const [activeMethod, setActiveMethod] = useState("native");
  const [catImage, setCatImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showResult, setShowResult] = useState(true);
  const pendingImageRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  function stopAnimationCycle() {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setIsAnimating(false);
    setShowResult(true);
    if (pendingImageRef.current) {
      setCatImage(pendingImageRef.current);
    }
  }

  function startAnimationCycle() {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setIsAnimating(true);
    setShowResult(false);
    setCatImage(null);
    setAnimationKey((prev) => prev + 1);
    animationTimeoutRef.current = setTimeout(() => {
      stopAnimationCycle();
    }, 6300);
  }

  // NATIVE FETCH
  const handleNativeFetch = async () => {
    setLoading(true);
    startAnimationCycle();
    pendingImageRef.current = null;
    try {
      const response = await fetch(CAT_API);
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      pendingImageRef.current = data[0].url;
    } catch (error) {
      console.error(error);
      stopAnimationCycle();
    }
    setLoading(false);
  };

  // AXIOS
  const handleAxios = async () => {
    setLoading(true);
    startAnimationCycle();
    pendingImageRef.current = null;
    try {
      const response = await axios.get(CAT_API);
      pendingImageRef.current = response.data[0].url;
    } catch (error) {
      console.error(error);
      stopAnimationCycle();
    }
    setLoading(false);
  };

  // AXIOS IMPROVED (with interceptors)
  const axiosInstanceRef = useRef(null);

  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = axios.create({
      baseURL: "https://api.thecatapi.com/v1",
      timeout: 10000,
    });

    axiosInstanceRef.current.interceptors.request.use(
      (config) => {
        console.log("Request:", config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosInstanceRef.current.interceptors.response.use(
      (response) => {
        console.log("Response:", response.status);
        return response;
      },
      (error) => Promise.reject(error)
    );
  }

  const handleAxiosImproved = async () => {
    setLoading(true);
    startAnimationCycle();
    pendingImageRef.current = null;
    try {
      const response = await axiosInstanceRef.current.get("/images/search");
      pendingImageRef.current = response.data[0].url;
    } catch (error) {
      console.error(error);
      stopAnimationCycle();
    }
    setLoading(false);
  };

  // REACT QUERY
  const { isLoading, refetch } = useQuery({
    queryKey: ["cat-image"],
    queryFn: async () => {
      const response = await fetch(CAT_API);
      if (!response.ok) throw new Error("Request failed");
      return response.json();
    },
    enabled: false,
  });

  const handleReactQuery = () => {
    startAnimationCycle();
    pendingImageRef.current = null;
    refetch()
      .then((result) => {
        if (result.data) {
          pendingImageRef.current = result.data[0].url;
        }
      })
      .catch((err) => {
        console.error(err);
        stopAnimationCycle();
      });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <style>{`
        @keyframes flow {
          0%, 100% { opacity: 0.5; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .flow-item { animation: flow 2s infinite; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced styling */}
        <div className="mb-12 text-center fade-in">
          <h2 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            4 Ways to Fetch Data in React
          </h2>
          <p className="text-slate-400 text-xl font-light">Compare different HTTP request approaches with live examples</p>
          <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Enhanced Method Selector */}
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {[
            { id: "native", label: "Native Fetch", emoji: "🔵", gradient: "from-blue-600 via-blue-500 to-cyan-500", shadow: "shadow-blue-500/50" },
            { id: "axios", label: "Axios", emoji: "🟢", gradient: "from-green-600 via-green-500 to-emerald-500", shadow: "shadow-green-500/50" },
            { id: "axios-improved", label: "Axios Improved", emoji: "🟡", gradient: "from-yellow-600 via-yellow-500 to-amber-500", shadow: "shadow-yellow-500/50" },
            { id: "react-query", label: "React Query", emoji: "🟣", gradient: "from-purple-600 via-purple-500 to-fuchsia-500", shadow: "shadow-purple-500/50" },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`group relative px-6 py-3.5 rounded-xl font-bold transition-all duration-300 text-white text-sm overflow-hidden ${activeMethod === method.id
                  ? `bg-gradient-to-r ${method.gradient} shadow-xl ${method.shadow} scale-105`
                  : "bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/70 hover:scale-102 border border-slate-700/50"
                }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-2xl">{method.emoji}</span>
                {method.label}
              </span>
              {activeMethod !== method.id && (
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area with improved spacing */}
        <div className="space-y-8">
          {/* Enhanced Description Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-5xl shadow-lg">
                  {methodDescriptions[activeMethod].emoji}
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {methodDescriptions[activeMethod].name}
                </h3>
              </div>
              <p className="text-slate-300 mb-8 text-base leading-relaxed">
                {methodDescriptions[activeMethod].description}
              </p>

              <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-5 text-lg">
                ✨ Key Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {methodDescriptions[activeMethod].features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <span className="text-purple-400 font-bold text-lg group-hover:scale-110 transition-transform">✓</span>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Code + Animation Section */}
          <div className="grid grid-cols-1 gap-8">
            {/* Code Section with improved styling */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-7 border border-slate-700/50 shadow-2xl fade-in">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  &lt;/&gt;
                </div>
                <h3 className="text-xl font-bold text-white">Code Example</h3>
              </div>

              {activeMethod === "native" && (
                <>
                  <pre className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-5 text-xs text-slate-100 overflow-auto mb-5 border border-slate-800 shadow-inner font-mono leading-relaxed">
                    {`// native-fetch
async function fetchCat() {
  const response = await fetch(url);
  if (!response.ok) throw new Error();
  const data = await response.json();
  return data[0].url;
}`}
                  </pre>
                  <button
                    onClick={handleNativeFetch}
                    disabled={loading}
                    className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {loading ? "⏳ Loading..." : "▶ Run Example"}
                  </button>
                </>
              )}

              {activeMethod === "axios" && (
                <>
                  <pre className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-5 text-xs text-slate-100 overflow-auto mb-5 border border-slate-800 shadow-inner font-mono leading-relaxed">
                    {`// axios
// npm install axios
async function fetchCat() {
  const response = await axios.get(url);
  return response.data[0].url;
}`}
                  </pre>
                  <button
                    onClick={handleAxios}
                    disabled={loading}
                    className="w-full px-5 py-3.5 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-500 hover:via-green-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {loading ? "⏳ Loading..." : "▶ Run Example"}
                  </button>
                </>
              )}

              {activeMethod === "axios-improved" && (
                <>
                  <pre className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-5 text-xs text-slate-100 overflow-auto mb-5 border border-slate-800 shadow-inner font-mono leading-relaxed">
                    {`// axios-improved
const api = axios.create({ ... });

api.interceptors.request.use(
  config => { /* log/modify */ return config; }
);
api.interceptors.response.use(
  res => { /* handle */ return res; }
);
`}
                  </pre>
                  <button
                    onClick={handleAxiosImproved}
                    disabled={loading}
                    className="w-full px-5 py-3.5 bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {loading ? "⏳ Loading..." : "▶ Run Example"}
                  </button>
                </>
              )}

              {activeMethod === "react-query" && (
                <>
                  <pre className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-5 text-xs text-slate-100 overflow-auto mb-5 border border-slate-800 shadow-inner font-mono leading-relaxed">
                    {`// react-query
// npm install @tanstack/react-query
const { data, isLoading } = useQuery({
  queryKey: ["cat"],
  queryFn: () => fetch(url)
      .then(r => r.json())
});
`}
                  </pre>
                  <button
                    onClick={handleReactQuery}
                    disabled={isLoading}
                    className="w-full px-5 py-3.5 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 hover:from-purple-500 hover:via-purple-400 hover:to-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? "⏳ Loading..." : "▶ Run Example"}
                  </button>
                </>
              )}
            </div>

            {/* Enhanced Animation Section */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-7 border border-slate-700/50 shadow-2xl fade-in">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white">Live Visualization</h3>
              </div>
              <div className="relative w-full bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner min-h-[500px]">
                {isAnimating ? (
                  <img
                    key={`${activeMethod}-${animationKey}`}
                    className="w-full h-auto max-w-none"
                    src={animations[activeMethod]}
                    alt={`${activeMethod} animation`}
                  />
                ) : (
                  <img
                    className="w-full h-auto max-w-none"
                    src={diagrams[activeMethod]}
                    alt={`${activeMethod} diagram`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Cat Image Result */}
          {showResult && catImage && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Fetched Successfully
                </h3>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700/50">
                <img
                  src={catImage}
                  alt="Cat"
                  className="w-full max-h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
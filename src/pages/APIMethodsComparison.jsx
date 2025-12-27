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
    <div className="min-h-screen bg-black text-white p-6">
      <style>{`
        @keyframes flow {
          0%, 100% { opacity: 0.5; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(8px); }
        }
        .flow-item { animation: flow 2s infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-5xl font-bold mb-3">
            4 Ways to Fetch Data in <span className="text-indigo-400">React</span>
          </h2>
          <p className="text-zinc-400 text-lg">Compare different HTTP request approaches</p>
        </div>

        {/* Method Selector with Emojis and Colors */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { id: "native", label: "Native Fetch", emoji: "🔵", bg: "from-blue-600 to-blue-700" },
            { id: "axios", label: "Axios", emoji: "🟢", bg: "from-green-600 to-green-700" },
            { id: "axios-improved", label: "Axios Improved", emoji: "🟡", bg: "from-yellow-600 to-yellow-700" },
            { id: "react-query", label: "React Query", emoji: "🟣", bg: "from-purple-600 to-purple-700" },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`px-5 py-3 rounded-lg font-semibold transition-all text-white text-sm ${activeMethod === method.id
                  ? `bg-gradient-to-r ${method.bg} shadow-lg scale-105`
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
            >
              <span className="text-lg mr-2">{method.emoji}</span>{method.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Description Section (moved to top) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Method Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{methodDescriptions[activeMethod].emoji}</span>
                <h3 className="text-2xl font-bold">{methodDescriptions[activeMethod].name}</h3>
              </div>
              <p className="text-zinc-300 mb-6 text-sm leading-relaxed">
                {methodDescriptions[activeMethod].description}
              </p>

              <h4 className="font-semibold text-indigo-400 mb-4">Key Features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {methodDescriptions[activeMethod].features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-zinc-800/50 p-3 rounded-lg">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span className="text-xs text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Code + Animation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Section */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4">Code</h3>

              {activeMethod === "native" && (
                <>
                  <pre className="bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl p-4 text-xs text-zinc-100 overflow-auto mb-4 max-h-60 border border-zinc-800 shadow-inner font-mono">
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
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 rounded-lg font-medium text-white"
                  >
                    {loading ? "Loading..." : "Run"}
                  </button>
                </>
              )}

              {activeMethod === "axios" && (
                <>
                  <pre className="bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl p-4 text-xs text-zinc-100 overflow-auto mb-4 max-h-60 border border-zinc-800 shadow-inner font-mono">
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
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 rounded-lg font-medium text-white"
                  >
                    {loading ? "Loading..." : "Run"}
                  </button>
                </>
              )}

              {activeMethod === "axios-improved" && (
                <>
                  <pre className="bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl p-4 text-xs text-zinc-100 overflow-auto mb-4 max-h-60 border border-zinc-800 shadow-inner font-mono">
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
                    className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 rounded-lg font-medium text-white"
                  >
                    {loading ? "Loading..." : "Run"}
                  </button>
                </>
              )}

              {activeMethod === "react-query" && (
                <>
                  <pre className="bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl p-4 text-xs text-zinc-100 overflow-auto mb-4 max-h-60 border border-zinc-800 shadow-inner font-mono">
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
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 rounded-lg font-medium text-white"
                  >
                    {isLoading ? "Loading..." : "Run"}
                  </button>
                </>
              )}
            </div>

            {/* Animation Section */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4">Visualization</h3>
              <div className="relative w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
                {isAnimating ? (
                  <img
                    key={`${activeMethod}-${animationKey}`}
                    className="w-full h-auto"
                    src={animations[activeMethod]}
                    alt={`${activeMethod} animation`}
                  />
                ) : (
                  <img
                    className="w-full h-auto"
                    src={diagrams[activeMethod]}
                    alt={`${activeMethod} diagram`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description Section moved above */}

          {/* Cat Image Full Width (if needed) */}
          {showResult && catImage && (
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-sm font-semibold mb-4 text-zinc-400">Fetched Result:</h3>
              <img src={catImage} alt="Cat" className="rounded-lg max-h-96 mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
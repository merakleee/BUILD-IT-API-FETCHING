import { useState } from "react";

export default function XhrLegacy() {
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [imageUrl, setImageUrl] = useState(null);
    const [activeMethod, setActiveMethod] = useState("xhr"); // "xhr" or "fetch"
    const [logs, setLogs] = useState([]);
    const [codeMetrics, setCodeMetrics] = useState({
        xhr: { lines: 17, callbacks: 3, complexity: "High" },
        fetch: { lines: 8, callbacks: 0, complexity: "Low" }
    });

    const addLog = (msg, type = "info") => {
        setLogs(prev => [...prev, { msg, type, timestamp: Date.now() }]);
    };

    const reset = () => {
        setStep(0);
        setStatus("idle");
        setImageUrl(null);
        setLogs([]);
    };

    async function runXhrFlow() {
        reset();
        setStatus("loading");

        addLog(`Starting ${activeMethod.toUpperCase()} request flow...`, "info");

        setTimeout(() => {
            setStep(1);
            addLog(`Browser initiating ${activeMethod.toUpperCase()} request`, "info");
        }, 500);

        try {
            setTimeout(() => {
                setStep(2);
                addLog("Request sent to Cat API server", "info");
            }, 1400);

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search"
            );

            addLog(`Response received with status: ${response.status}`, "success");

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data = await response.json();
            addLog("JSON data parsed successfully", "success");

            setTimeout(() => {
                setStep(3);
                addLog(`${activeMethod === "xhr" ? "Callback" : "Promise"} processing response`, "info");
            }, 2400);

            setTimeout(() => {
                setImageUrl(data[0].url);
                setStatus("success");
                addLog("Image rendered in UI", "success");
            }, 3200);

        } catch (error) {
            setStatus("error");
            addLog(`Request failed: ${error.message}`, "error");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <div className="mb-10 text-center">
                    <h2 className="text-5xl font-bold mb-3">
                        Before <code className="text-indigo-400">fetch()</code> there was{" "}
                        <span className="text-red-400">XMLHttpRequest</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                        Same API, two completely different approaches. See why modern developers
                        prefer <code className="bg-zinc-800 px-2 py-1 rounded">fetch()</code> over
                        the legacy <code className="bg-zinc-800 px-2 py-1 rounded">XMLHttpRequest</code> pattern.
                    </p>
                </div>

                {/* Method Selector */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex rounded-xl border-2 border-zinc-700 p-1 bg-zinc-900">
                        <button
                            onClick={() => setActiveMethod("xhr")}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${activeMethod === "xhr"
                                ? "bg-red-600 text-white shadow-lg"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            XMLHttpRequest (Legacy)
                        </button>
                        <button
                            onClick={() => setActiveMethod("fetch")}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${activeMethod === "fetch"
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            fetch() (Modern)
                        </button>
                    </div>
                </div>

                {/* Code Comparison */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* XHR Code */}
                    <div className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all duration-300 shadow-2xl ${activeMethod === "xhr"
                        ? "border-red-500 shadow-red-500/20"
                        : "border-zinc-800"
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">XMLHttpRequest (Old Way)</h3>
                            <span className="text-xs bg-red-600 px-3 py-1 rounded-full">Legacy</span>
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Lines of Code</div>
                                <div className="text-xl font-bold text-red-400">{codeMetrics.xhr.lines}</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Callbacks</div>
                                <div className="text-xl font-bold text-red-400">{codeMetrics.xhr.callbacks}</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Complexity</div>
                                <div className="text-xl font-bold text-red-400">{codeMetrics.xhr.complexity}</div>
                            </div>
                        </div>

                        <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed">
                            {`const xhr = new XMLHttpRequest();

xhr.open(
  "GET", 
  "https://api.thecatapi.com/v1/images/search"
);

xhr.onload = function () {
  if (xhr.status === 200) {
    const data = JSON.parse(
      xhr.responseText
    );
    console.log("Image:", data[0].url);
  } else {
    console.error("Failed:", xhr.status);
  }
};

xhr.onerror = function () {
  console.error("Network error");
};

xhr.send();`}
                        </pre>

                        <div className="mt-4 space-y-2">
                            <ProblemBadge icon="✕" text="Callback-based (callback hell risk)" />
                            <ProblemBadge icon="✕" text="Verbose with lots of boilerplate" />
                            <ProblemBadge icon="✕" text="Manual error handling for each type" />
                            <ProblemBadge icon="✕" text="Harder to read and maintain" />
                        </div>
                    </div>

                    {/* Fetch Code */}
                    <div className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all duration-300 shadow-2xl ${activeMethod === "fetch"
                        ? "border-indigo-500 shadow-indigo-500/20"
                        : "border-zinc-800"
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">fetch() (Modern Way)</h3>
                            <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">Modern</span>
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Lines of Code</div>
                                <div className="text-xl font-bold text-green-400">{codeMetrics.fetch.lines}</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Callbacks</div>
                                <div className="text-xl font-bold text-green-400">{codeMetrics.fetch.callbacks}</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Complexity</div>
                                <div className="text-xl font-bold text-green-400">{codeMetrics.fetch.complexity}</div>
                            </div>
                        </div>

                        <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed">
                            {`async function fetchCat() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search"
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  return data[0].url;
}`}
                        </pre>

                        <div className="mt-4 space-y-2">
                            <BenefitBadge icon="✓" text="Promise-based (clean async/await)" />
                            <BenefitBadge icon="✓" text="Concise and readable" />
                            <BenefitBadge icon="✓" text="Unified error handling with try/catch" />
                            <BenefitBadge icon="✓" text="Easy to maintain and test" />
                        </div>
                    </div>
                </div>

                {/* Visual Flow Comparison */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* XHR Flow */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-6">XMLHttpRequest Flow</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="Browser (XHR)"
                                    active={activeMethod === "xhr" && step >= 1}
                                    completed={activeMethod === "xhr" && step > 1}
                                />
                                <FlowArrow active={activeMethod === "xhr" && step >= 1} />
                                <FlowBox
                                    label="Cat API"
                                    active={activeMethod === "xhr" && step >= 2}
                                    completed={activeMethod === "xhr" && step > 2}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="onload callback"
                                    active={activeMethod === "xhr" && step >= 3}
                                    completed={activeMethod === "xhr" && step >= 3}
                                />
                                <FlowArrow active={activeMethod === "xhr" && step >= 3} />
                                <FlowBox
                                    label="Parse & Render"
                                    active={activeMethod === "xhr" && step >= 3}
                                    completed={activeMethod === "xhr" && step >= 3}
                                />
                            </div>
                        </div>

                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Flow Characteristics:</p>
                            <ul className="text-xs text-zinc-300 space-y-1">
                                <li>• Callback-based event handling</li>
                                <li>• Separate success/error handlers</li>
                                <li>• Manual state tracking required</li>
                                <li>• Harder to chain operations</li>
                            </ul>
                        </div>
                    </div>

                    {/* Fetch Flow */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-6">fetch() Flow</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="Browser (fetch)"
                                    active={activeMethod === "fetch" && step >= 1}
                                    completed={activeMethod === "fetch" && step > 1}
                                />
                                <FlowArrow active={activeMethod === "fetch" && step >= 1} />
                                <FlowBox
                                    label="Cat API"
                                    active={activeMethod === "fetch" && step >= 2}
                                    completed={activeMethod === "fetch" && step > 2}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="Promise/await"
                                    active={activeMethod === "fetch" && step >= 3}
                                    completed={activeMethod === "fetch" && step >= 3}
                                />
                                <FlowArrow active={activeMethod === "fetch" && step >= 3} />
                                <FlowBox
                                    label="Parse & Render"
                                    active={activeMethod === "fetch" && step >= 3}
                                    completed={activeMethod === "fetch" && step >= 3}
                                />
                            </div>
                        </div>

                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Flow Characteristics:</p>
                            <ul className="text-xs text-zinc-300 space-y-1">
                                <li>• Promise-based async handling</li>
                                <li>• Single try/catch for all errors</li>
                                <li>• Automatic state management</li>
                                <li>• Easy to chain with .then() or await</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Controls and Status */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Controls */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4">Run Simulation</h3>

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 mb-4">
                            <p className="text-sm mb-2">
                                <span className="text-zinc-400">Current Step:</span>
                            </p>
                            <p className="text-base font-semibold">
                                {step === 0 && "Idle - Ready to start"}
                                {step === 1 && `Sending request with ${activeMethod.toUpperCase()}`}
                                {step === 2 && "Cat API processing request"}
                                {step === 3 && `${activeMethod === "xhr" ? "Callback" : "Promise"} parsing JSON and updating UI`}
                            </p>

                            <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${(step / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={runXhrFlow}
                                disabled={status === "loading"}
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100"
                            >
                                {status === "loading" ? "Running..." : `Run ${activeMethod.toUpperCase()} flow`}
                            </button>
                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold transition-all duration-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <span>Console Logs</span>
                            {logs.length > 0 && (
                                <span className="text-xs bg-zinc-700 px-2 py-1 rounded">{logs.length}</span>
                            )}
                        </h3>

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 h-48 overflow-y-auto font-mono text-xs space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-zinc-500 text-center mt-16">
                                    Select a method and click "Run" to see logs
                                </p>
                            ) : (
                                logs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded animate-fade-in ${log.type === "error" ? "bg-red-950/30 text-red-400 border-l-2 border-red-500" :
                                            log.type === "success" ? "bg-green-950/30 text-green-400 border-l-2 border-green-500" :
                                                "bg-zinc-800 text-zinc-300"
                                            }`}
                                    >
                                        {log.msg}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl mb-6">
                    <h3 className="font-semibold text-lg mb-4">Result</h3>

                    <div className="bg-black rounded-lg p-6 border border-zinc-800 min-h-80 flex items-center justify-center">
                        {status === "idle" && (
                            <div className="text-center text-zinc-500">
                                <div className="text-7xl mb-4">🐱</div>
                                <p className="text-lg">Select a method above and click "Run" to fetch a cat image</p>
                            </div>
                        )}

                        {status === "loading" && (
                            <div className="text-center">
                                <div className="animate-spin text-6xl mb-4">⏳</div>
                                <p className="text-yellow-400 font-medium text-lg">
                                    Fetching cat image using {activeMethod.toUpperCase()}...
                                </p>
                            </div>
                        )}

                        {status === "success" && imageUrl && (
                            <div className="text-center w-full animate-fade-in">
                                <img
                                    src={imageUrl}
                                    alt="Random cat"
                                    className="mx-auto rounded-lg max-h-96 object-cover shadow-lg mb-4"
                                />
                                <div className="bg-green-950/30 border border-green-800 rounded-lg p-4 inline-block">
                                    <p className="text-green-400 font-medium">
                                        Data fetched and rendered successfully using {activeMethod.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="text-center">
                                <div className="text-6xl mb-4">✕</div>
                                <div className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                                    <p className="text-red-400 font-medium text-lg">Request failed</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Key Takeaways */}
                <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl p-6 border border-indigo-800/30 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-300">Key Takeaways</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <TakeawayCard
                            title="Callbacks vs Promises"
                            description="XHR uses event callbacks (onload, onerror) which can lead to callback hell. fetch() uses Promises that work naturally with async/await for cleaner code."
                        />
                        <TakeawayCard
                            title="Code Complexity"
                            description="XMLHttpRequest requires more boilerplate code, manual status checking, and separate error handlers. fetch() is more concise and readable."
                        />
                        <TakeawayCard
                            title="Modern Standard"
                            description="fetch() is the modern web standard, actively maintained, and supported by all browsers. XHR exists only for legacy compatibility."
                        />
                    </div>
                </div>
            </div>

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
        </div>
    );
}

function FlowBox({ label, active, completed }) {
    return (
        <div
            className={`flex-1 h-16 rounded-lg flex items-center justify-center border-2 text-xs font-medium transition-all duration-500 ${completed
                ? "border-green-500 bg-green-950/20 text-green-400"
                : active
                    ? "border-indigo-400 bg-indigo-950/20 text-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                    : "border-zinc-700 text-zinc-500 bg-zinc-950"
                }`}
        >
            {label}
        </div>
    );
}

function FlowArrow({ active }) {
    return (
        <span className={`text-xl transition-colors duration-500 ${active ? "text-indigo-400" : "text-zinc-700"
            }`}>
            →
        </span>
    );
}

function ProblemBadge({ icon, text }) {
    return (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-800/30 rounded px-3 py-2">
            <span className="font-bold">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function BenefitBadge({ icon, text }) {
    return (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/20 border border-green-800/30 rounded px-3 py-2">
            <span className="font-bold">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function TakeawayCard({ title, description }) {
    return (
        <div className="bg-zinc-900/50 border border-indigo-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-indigo-300 mb-2">{title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
        </div>
    );
}
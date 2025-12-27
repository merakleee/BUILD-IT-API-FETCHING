import { useState } from "react";

export default function ResponseParsing() {
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [mode, setMode] = useState("json");
    const [imageUrl, setImageUrl] = useState(null);
    const [rawPreview, setRawPreview] = useState("");
    const [logs, setLogs] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [dataSize, setDataSize] = useState(null);

    const addLog = (msg, type = "info") => {
        setLogs(prev => [...prev, { msg, type, timestamp: Date.now() }]);
    };

    const reset = () => {
        setStep(0);
        setStatus("idle");
        setImageUrl(null);
        setRawPreview("");
        setLogs([]);
        setContentType(null);
        setDataSize(null);
    };

    async function runParse(selectedMode) {
        reset();
        setMode(selectedMode);
        setStatus("loading");

        addLog(`Starting response parsing with .${selectedMode}() method`, "info");

        try {
            setTimeout(() => {
                setStep(1);
                addLog("Sending HTTP request to API...", "info");
            }, 500);

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search"
            );

            setTimeout(() => {
                setStep(2);
                addLog(`Response received with status: ${response.status}`, "success");
                const ct = response.headers.get("content-type");
                setContentType(ct);
                addLog(`Content-Type: ${ct}`, "info");
            }, 1000);

            if (!response.ok) {
                throw new Error("Request failed: " + response.status);
            }

            setTimeout(() => {
                setStep(3);
                addLog(`Calling response.${selectedMode}() to parse body...`, "info");
            }, 1800);

            if (selectedMode === "json") {
                const data = await response.json();
                const preview = JSON.stringify(data, null, 2);
                const size = new Blob([preview]).size;
                setDataSize(size);

                addLog("JSON parsing successful", "success");
                addLog(`Parsed ${data.length} item(s) from response`, "info");

                setTimeout(() => {
                    setStatus("success");
                    setStep(4);
                    setRawPreview(preview);
                    addLog(`Data size: ${size} bytes`, "info");
                }, 2400);
            } else if (selectedMode === "text") {
                const txt = await response.text();
                const size = new Blob([txt]).size;
                setDataSize(size);

                addLog("Text parsing successful", "success");
                addLog(`Retrieved ${txt.length} characters`, "info");

                setTimeout(() => {
                    setStatus("success");
                    setStep(4);
                    setRawPreview(txt);
                    addLog(`Data size: ${size} bytes`, "info");
                }, 2400);
            } else {
                // blob demo - get JSON first to extract image URL
                const data = await response.json();
                const url = data[0]?.url;

                if (!url) {
                    throw new Error("No image URL in response");
                }

                addLog("Blob concept: Fetching image as binary data...", "info");

                // Fetch the actual image as blob
                const imgResponse = await fetch(url);
                const blob = await imgResponse.blob();
                const objectUrl = URL.createObjectURL(blob);
                setDataSize(blob.size);

                addLog("Image blob created successfully", "success");
                addLog(`Blob size: ${(blob.size / 1024).toFixed(2)} KB`, "info");
                addLog(`Blob type: ${blob.type}`, "info");

                setTimeout(() => {
                    setStatus("success");
                    setStep(4);
                    setImageUrl(objectUrl);
                }, 2400);
            }
        } catch (error) {
            console.error("Parsing error:", error);
            setStatus("error");
            addLog(`Error: ${error.message}`, "error");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <div className="mb-10 text-center">
                    <h2 className="text-5xl font-bold mb-3">
                        Parsing the <span className="text-indigo-400">Response</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                        <code className="bg-zinc-800 px-2 py-1 rounded">fetch()</code> returns a{" "}
                        <code className="bg-zinc-800 px-2 py-1 rounded">Response</code> object. Choose the right parsing method
                        and remember: you can only use one method once per response.
                    </p>
                </div>

                {/* Method Selector */}
                <div className="mb-6 bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-center">Select Parsing Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ParsingMethodCard
                            method="json"
                            active={mode === "json"}
                            onClick={() => setMode("json")}
                            icon="{ }"
                            title=".json()"
                            description="Parse JSON API responses"
                            useCases={["REST APIs", "JSON data", "Structured objects"]}
                        />
                        <ParsingMethodCard
                            method="text"
                            active={mode === "text"}
                            onClick={() => setMode("text")}
                            icon="Aa"
                            title=".text()"
                            description="Parse plain text responses"
                            useCases={["HTML pages", "CSV files", "Plain text"]}
                        />
                        <ParsingMethodCard
                            method="blob"
                            active={mode === "blob"}
                            onClick={() => setMode("blob")}
                            icon="📦"
                            title=".blob()"
                            description="Parse binary file data"
                            useCases={["Images", "PDFs", "Videos"]}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Code Examples */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Parsing Methods</h3>
                            <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">
                                Mode: .{mode}()
                            </span>
                        </div>

                        {/* Base Request */}
                        <div className="mb-4">
                            <p className="text-xs text-zinc-400 mb-2">Base fetch request:</p>
                            <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed">
                                {`const response = await fetch(
  "https://api.thecatapi.com/v1/images/search"
);

if (!response.ok) {
  throw new Error("Request failed");
}`}
                            </pre>
                        </div>

                        {/* Method-specific examples */}
                        <div className="space-y-4">
                            <MethodExample
                                title=".json() - API Data"
                                active={mode === "json"}
                                code={`const data = await response.json();
console.log(data); // Array or Object
const url = data[0].url;`}
                                description="Parses JSON and returns JavaScript object/array"
                            />
                            <MethodExample
                                title=".text() - Plain Text"
                                active={mode === "text"}
                                code={`const text = await response.text();
console.log(text); // String
// Can manually parse: JSON.parse(text)`}
                                description="Returns raw response body as string"
                            />
                            <MethodExample
                                title=".blob() - Binary Data"
                                active={mode === "blob"}
                                code={`const blob = await response.blob();
const url = URL.createObjectURL(blob);
img.src = url; // Display image`}
                                description="Returns binary data as Blob object"
                            />
                        </div>

                        {/* Critical Warning */}
                        <div className="mt-6 bg-red-950/20 border border-red-800/30 rounded-lg p-4">
                            <p className="text-sm font-semibold text-red-400 mb-2">Critical Rule:</p>
                            <p className="text-xs text-red-300">
                                You can only call ONE parsing method per response. The body is consumed
                                after the first call. Calling a second method will throw an error.
                            </p>
                        </div>
                    </div>

                    {/* Visual Flow + Controls */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg">Parsing Decision Flow</h3>
                        </div>

                        {/* Run + Reset controls (no emojis, shorter height) */}
                        <div className="flex gap-4 mb-6 p-3 bg-black/30 rounded-xl border border-zinc-700">
                            <button
                                onClick={() => runParse(mode)}
                                disabled={status === "loading"}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-zinc-700 disabled:to-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold text-sm shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] transition-all duration-200 border border-indigo-500/40 active:scale-[0.99] flex flex-col items-start justify-center"
                            >
                                <span className="text-xs uppercase tracking-wide opacity-80 mb-1">
                                    Run
                                </span>
                                <span className="font-mono text-sm">.{mode}()</span>
                            </button>

                            <button
                                onClick={reset}
                                className="w-32 px-6 py-3 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 rounded-lg font-semibold text-sm shadow-md hover:shadow-zinc-500/25 hover:scale-[1.01] transition-all duration-200 border border-zinc-600/50 active:scale-[0.99] flex items-center justify-center"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Step 1: Receive Response */}
                            <div>
                                <p className="text-sm text-zinc-400 mb-3">Step 1: Receive Response</p>
                                <div className="flex items-center gap-2">
                                    <FlowBox
                                        label="HTTP Response"
                                        active={step >= 1}
                                        completed={step > 1}
                                    />
                                    <FlowArrow active={step >= 1} />
                                    <FlowBox
                                        label="Check Content-Type"
                                        active={step >= 2}
                                        completed={step > 2}
                                    />
                                </div>
                            </div>

                            {/* Step 2: Choose Method */}
                            <div>
                                <p className="text-sm text-zinc-400 mb-3">Step 2: Choose Parsing Method</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <FlowBox
                                        label=".json()"
                                        active={mode === "json" && step >= 2}
                                        completed={mode === "json" && step > 2}
                                        highlight={mode === "json"}
                                    />
                                    <FlowBox
                                        label=".text()"
                                        active={mode === "text" && step >= 2}
                                        completed={mode === "text" && step > 2}
                                        highlight={mode === "text"}
                                    />
                                    <FlowBox
                                        label=".blob()"
                                        active={mode === "blob" && step >= 2}
                                        completed={mode === "blob" && step > 2}
                                        highlight={mode === "blob"}
                                    />
                                </div>
                            </div>

                            {/* Step 3: Parse */}
                            <div>
                                <p className="text-sm text-zinc-400 mb-3">Step 3: Parse Body</p>
                                <div className="flex items-center gap-2">
                                    <FlowBox
                                        label="Parse Data"
                                        active={step >= 3}
                                        completed={step > 3}
                                    />
                                    <FlowArrow active={step >= 3} />
                                    <FlowBox
                                        label="Data Ready"
                                        active={step >= 4}
                                        completed={step >= 4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Current Step Info */}
                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Current Step:</p>
                            <p className="text-base font-semibold">
                                {step === 0 && "Idle - Ready to start"}
                                {step === 1 && "Sending HTTP request"}
                                {step === 2 && "Response received, choosing parsing method"}
                                {step === 3 && `Calling response.${mode}() to parse body`}
                                {step === 4 && "Parsed data ready for use"}
                            </p>

                            <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${(step / 4) * 100}%` }}
                                />
                            </div>

                            {/* Response Metadata */}
                            {contentType && (
                                <div className="mt-4 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Content-Type:</span>
                                        <span className="text-green-400 font-mono">{contentType}</span>
                                    </div>
                                    {dataSize && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Data Size:</span>
                                            <span className="text-green-400 font-mono">
                                                {dataSize > 1024
                                                    ? `${(dataSize / 1024).toFixed(2)} KB`
                                                    : `${dataSize} bytes`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls and Logs */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Console Logs */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <span>Console Logs</span>
                            {logs.length > 0 && (
                                <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                                    {logs.length}
                                </span>
                            )}
                        </h3>

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 h-72 overflow-y-auto font-mono text-xs space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-zinc-500 text-center mt-28">
                                    Select a parsing method and click "Run" to see logs
                                </p>
                            ) : (
                                logs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded animate-fade-in ${log.type === "error"
                                                ? "bg-red-950/30 text-red-400 border-l-2 border-red-500"
                                                : log.type === "success"
                                                    ? "bg-green-950/30 text-green-400 border-l-2 border-green-500"
                                                    : "bg-zinc-800 text-zinc-300"
                                            }`}
                                    >
                                        {log.msg}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Parsed Preview */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4">Parsed Data Preview</h3>

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 h-72 overflow-auto">
                            {status === "idle" && (
                                <div className="text-center text-zinc-500 flex flex-col items-center justify-center h-full">
                                    <div className="w-16 h-16 border-2 border-zinc-700 rounded-full flex items-center justify-center mb-4 text-3xl">
                                        ?
                                    </div>
                                    <p>Select a method and click "Run" to see parsed data</p>
                                </div>
                            )}

                            {status === "loading" && (
                                <div className="text-center flex flex-col items-center justify-center h-full">
                                    <div className="w-12 h-12 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-yellow-400 font-medium">Fetching and parsing response...</p>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="text-center flex flex-col items-center justify-center h-full">
                                    <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center mb-4 text-3xl text-red-500">
                                        ✕
                                    </div>
                                    <p className="text-red-400 font-medium">Parsing failed</p>
                                </div>
                            )}

                            {status === "success" && mode !== "blob" && (
                                <pre className="text-xs text-zinc-200 whitespace-pre-wrap animate-fade-in">
                                    {rawPreview}
                                </pre>
                            )}

                            {status === "success" && mode === "blob" && imageUrl && (
                                <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                                    <img
                                        src={imageUrl}
                                        alt="Blob parsed image"
                                        className="max-h-56 rounded-lg shadow-lg mb-3"
                                    />
                                    <p className="text-xs text-zinc-400 text-center">
                                        Image loaded from blob object via URL.createObjectURL()
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl mb-6">
                    <h3 className="font-semibold text-lg mb-4">Quick Reference Comparison</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-700">
                                    <th className="text-left p-3 text-zinc-400">Method</th>
                                    <th className="text-left p-3 text-zinc-400">Returns</th>
                                    <th className="text-left p-3 text-zinc-400">Use Case</th>
                                    <th className="text-left p-3 text-zinc-400">Example</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                <tr className={mode === "json" ? "bg-indigo-950/20" : ""}>
                                    <td className="p-3">
                                        <code className="text-indigo-400 font-semibold">.json()</code>
                                    </td>
                                    <td className="p-3 text-zinc-300">JavaScript Object/Array</td>
                                    <td className="p-3 text-zinc-300">REST APIs, JSON data</td>
                                    <td className="p-3 text-zinc-400 text-xs">
                                        <code>const data = await res.json()</code>
                                    </td>
                                </tr>
                                <tr className={mode === "text" ? "bg-indigo-950/20" : ""}>
                                    <td className="p-3">
                                        <code className="text-purple-400 font-semibold">.text()</code>
                                    </td>
                                    <td className="p-3 text-zinc-300">String</td>
                                    <td className="p-3 text-zinc-300">HTML, CSV, plain text</td>
                                    <td className="p-3 text-zinc-400 text-xs">
                                        <code>const text = await res.text()</code>
                                    </td>
                                </tr>
                                <tr className={mode === "blob" ? "bg-indigo-950/20" : ""}>
                                    <td className="p-3">
                                        <code className="text-pink-400 font-semibold">.blob()</code>
                                    </td>
                                    <td className="p-3 text-zinc-300">Blob Object</td>
                                    <td className="p-3 text-zinc-300">Images, files, binary data</td>
                                    <td className="p-3 text-zinc-400 text-xs">
                                        <code>const blob = await res.blob()</code>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Key Points */}
                <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl p-6 border border-indigo-800/30 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-300">Important Parsing Rules</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KeyPoint
                            title="One Method Only"
                            description="You can only call ONE parsing method per response. The body is consumed after first use."
                        />
                        <KeyPoint
                            title="Check Content-Type"
                            description="Inspect response.headers.get('content-type') to choose the appropriate parsing method."
                        />
                        <KeyPoint
                            title="Async Operations"
                            description="All parsing methods return Promises. Always use await or .then() to handle them."
                        />
                        <KeyPoint
                            title="Error Handling"
                            description="Wrap parsing in try/catch. Invalid JSON or unexpected formats will throw errors."
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

function ParsingMethodCard({ method, active, onClick, icon, title, description, useCases }) {
    const colors = {
        json: "from-indigo-600 to-indigo-700",
        text: "from-purple-600 to-purple-700",
        blob: "from-pink-600 to-pink-700"
    };

    return (
        <button
            onClick={onClick}
            className={`p-5 rounded-lg border-2 transition-all duration-200 text-left ${active
                    ? `bg-gradient-to-br ${colors[method]} border-transparent shadow-lg scale-105`
                    : "border-zinc-700 bg-zinc-950 hover:border-zinc-600"
                }`}
        >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-bold text-lg mb-1">{title}</div>
            <div className="text-sm text-zinc-300 mb-3">{description}</div>
            <div className="space-y-1">
                {useCases.map((useCase, idx) => (
                    <div key={idx} className="text-xs text-zinc-400">
                        • {useCase}
                    </div>
                ))}
            </div>
        </button>
    );
}

function MethodExample({ title, active, code, description }) {
    return (
        <div
            className={`border rounded-lg p-4 transition-all duration-300 ${active
                    ? "border-indigo-500 bg-indigo-950/20"
                    : "border-zinc-700 bg-zinc-950"
                }`}
        >
            <p className="text-xs font-semibold mb-2 text-zinc-300">{title}</p>
            <pre className="bg-black rounded p-3 text-xs text-zinc-200 mb-2 overflow-auto">
                {code}
            </pre>
            <p className="text-xs text-zinc-400">{description}</p>
        </div>
    );
}

function FlowBox({ label, active, completed, highlight }) {
    return (
        <div
            className={`flex-1 h-14 rounded-lg flex items-center justify-center border-2 text-xs font-medium transition-all duration-500 ${completed
                    ? "border-green-500 bg-green-950/20 text-green-400"
                    : active
                        ? "border-indigo-400 bg-indigo-950/20 text-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                        : highlight
                            ? "border-purple-500 bg-purple-950/20 text-purple-400"
                            : "border-zinc-700 text-zinc-500 bg-zinc-950"
                }`}
        >
            {label}
        </div>
    );
}

function FlowArrow({ active }) {
    return (
        <span
            className={`text-lg transition-colors duration-500 ${active ? "text-indigo-400" : "text-zinc-700"
                }`}
        >
            →
        </span>
    );
}

function KeyPoint({ title, description }) {
    return (
        <div className="bg-zinc-900/50 border border-indigo-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-indigo-300 mb-2">{title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
        </div>
    );
}

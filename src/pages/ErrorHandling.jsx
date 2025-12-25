import { useState } from "react";

export default function ErrorHandling() {
    const [step, setStep] = useState(0);
    const [mode, setMode] = useState("success"); // "success" | "http" | "network" | "parsing"
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    async function runRequest(selectedMode) {
        setMode(selectedMode);
        setStatus("loading");
        setMessage("");
        setStep(1); // sending request

        try {
            // Visual steps
            setTimeout(() => setStep(2), 800);  // waiting
            setTimeout(() => setStep(3), 1600); // got response / error
            setTimeout(() => setStep(4), 2200); // showing UI message

            let url = "https://api.thecatapi.com/v1/images/search";

            if (selectedMode === "http") {
                // invalid path to force 404
                url = "https://api.thecatapi.com/v1/does-not-exist";
            }

            if (selectedMode === "network") {
                // clearly invalid domain to simulate network error
                url = "https://this-domain-will-not-resolve.example.test";
            }

            const response = await fetch(url);

            if (!response.ok) {
                // HTTP error
                throw new Error("HTTP " + response.status);
            }

            if (selectedMode === "parsing") {
                // force parsing error by calling .json() on plain text
                const text = await response.text();
                JSON.parse(text); // will usually throw
            } else {
                await response.json();
            }

            // If we reach here: success path
            setTimeout(() => {
                setStatus("success");
                setMessage("Everything went well. Data loaded successfully ✓");
            }, 2200);
        } catch (err) {
            console.error("Error demo:", err);
            setTimeout(() => {
                setStatus("error");
                setMessage(getUserMessage(err, mode));
            }, 2200);
        }
    }

    return (
        <>
            {/* Headline */}
            <div className="mb-10">
                <h2 className="text-4xl font-bold mb-2">
                    Handling <span className="text-red-300">errors</span> in fetch().
                </h2>
                <p className="text-zinc-400 max-w-xl">
                    Network requests can fail in different ways. Good error handling means
                    checking <code>response.ok</code>, catching exceptions, and showing
                    user‑friendly messages instead of raw stack traces.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Code column */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Basic try/catch pattern</h3>
                        <div className="inline-flex rounded-md border border-zinc-700 text-xs overflow-hidden">
                            <button
                                onClick={() => setMode("success")}
                                className={`px-3 py-1 ${mode === "success"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                Success
                            </button>
                            <button
                                onClick={() => setMode("http")}
                                className={`px-3 py-1 ${mode === "http"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                HTTP error
                            </button>
                            <button
                                onClick={() => setMode("network")}
                                className={`px-3 py-1 ${mode === "network"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                Network error
                            </button>
                            <button
                                onClick={() => setMode("parsing")}
                                className={`px-3 py-1 ${mode === "parsing"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                Parsing error
                            </button>
                        </div>
                    </div>

                    <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
                        {`async function safeFetch(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // HTTP 4xx / 5xx
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("Request failed:", error);
    return { ok: false, error };
  }
}`}
                    </pre>

                    <div className="grid gap-4 text-xs text-zinc-300">
                        <div>
                            <p className="font-semibold mb-1">Types of errors</p>
                            <ul className="list-disc list-inside text-zinc-400 space-y-1">
                                <li>
                                    <span className="font-semibold">Network:</span> offline,
                                    DNS, CORS, server unreachable.
                                </li>
                                <li>
                                    <span className="font-semibold">HTTP:</span> 404, 500, 401,
                                    etc. (<code>!response.ok</code>).
                                </li>
                                <li>
                                    <span className="font-semibold">Parsing:</span> invalid JSON,
                                    unexpected content.
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold mb-1">Best practices</p>
                            <ul className="list-disc list-inside text-zinc-400 space-y-1">
                                <li>Always check <code>response.ok</code>.</li>
                                <li>Wrap fetch and parsing in <code>try/catch</code>.</li>
                                <li>Show clear, friendly messages to users.</li>
                                <li>Log full errors for debugging.</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={() => runRequest(mode)}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
                    >
                        Run {mode} scenario
                    </button>
                </div>

                {/* Diagram column */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-5">
                    <h3 className="font-semibold mb-4 text-base">Visual error flow</h3>

                    <div className="flex flex-col gap-4 text-xs">
                        {/* Request + response */}
                        <div className="flex items-center gap-4">
                            <FlowBox label="Browser" active={step >= 1} />
                            <FlowArrow />
                            <FlowBox label="fetch(url)" active={step >= 1} />
                            <FlowArrow />
                            <FlowBox label="API / Network" active={step >= 2} />
                        </div>

                        {/* Outcome */}
                        <div className="flex items-center gap-4">
                            <FlowBox
                                label="HTTP ok?"
                                active={step >= 2}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="Parse JSON"
                                active={step >= 3 && status !== "error"}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="Error thrown"
                                active={step >= 3 && status === "error"}
                            />
                        </div>

                        {/* UI message */}
                        <div className="flex items-center gap-4">
                            <FlowBox
                                label="try { ... }"
                                active={step >= 1}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="catch (error)"
                                active={step >= 3 && status === "error"}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="User message"
                                active={step >= 4}
                            />
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        Step:&nbsp;
                        <span className="text-zinc-100 font-medium">
                            {step === 0 && "Idle"}
                            {step === 1 && "Sending request from browser"}
                            {step === 2 && "Waiting for API / network"}
                            {step === 3 &&
                                (status === "error"
                                    ? "Error thrown (network / HTTP / parsing)"
                                    : "Parsing JSON data")}
                            {step === 4 && "Showing user‑friendly message"}
                        </span>
                    </p>

                    {/* Result preview */}
                    <div className="mt-4 text-xs text-zinc-300">
                        <p className="font-semibold mb-2">Result message</p>
                        <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950 min-h-[80px]">
                            {status === "idle" && (
                                <p className="text-zinc-500">
                                    Choose a scenario and click "Run".
                                </p>
                            )}
                            {status === "loading" && (
                                <p className="text-yellow-400">Sending request…</p>
                            )}
                            {status === "success" && (
                                <p className="text-green-400 text-sm">{message}</p>
                            )}
                            {status === "error" && (
                                <p className="text-red-400 text-sm">{message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function getUserMessage(error, mode) {
    const msg = String(error?.message || "");

    if (mode === "network" || msg.includes("Failed to fetch")) {
        return "Cannot connect to the server. Check your internet connection.";
    }
    if (mode === "http" || msg.startsWith("HTTP ")) {
        return "The server returned an error response. Please try again later.";
    }
    if (mode === "parsing") {
        return "The server sent data in an unexpected format.";
    }
    return "Something went wrong. Please try again.";
}

function FlowBox({ label, active }) {
    return (
        <div
            className={`w-40 h-14 rounded-xl flex items-center justify-center border text-xs text-center px-2 transition-all duration-300 ${active
                    ? "border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/20 bg-zinc-900"
                    : "border-zinc-700 text-zinc-400 bg-zinc-950"
                }`}
        >
            {label}
        </div>
    );
}

function FlowArrow() {
    return <span className="text-zinc-600 text-xl">→</span>;
}

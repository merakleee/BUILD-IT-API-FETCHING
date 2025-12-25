import { useState } from "react";

export default function RequestConfig() {
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [responseStatus, setResponseStatus] = useState(null);

    async function runConfiguredFetch() {
        setStatus("loading");
        setResponseStatus(null);
        setStep(1); // Browser

        try {
            // Build config step by step
            setTimeout(() => setStep(2), 1000);  // Method after 1s
            setTimeout(() => setStep(3), 2000);  // Headers after 2s
            setTimeout(() => setStep(4), 3000); // Body

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-demo-client": "build-it-api-fetching",
                    },
                    // body: JSON.stringify({ demo: true }) // for POST / PUT / PATCH
                }
            );

            setResponseStatus(response.status);

            if (!response.ok) {
                throw new Error("Request failed");
            }

            // Request/response trip
            setTimeout(() => setStep(5), 3200); // HTTP Request
            setTimeout(() => setStep(6), 4000); // Cat API
            setTimeout(() => setStep(7), 4800); // HTTP Response

            await response.json();

            setTimeout(() => {
                setStatus("success");
            }, 2600);
        } catch (e) {
            setStatus("error");
        }
    }

    return (
        <>
            {/* Headline */}
            <div className="mb-10">
                <h2 className="text-4xl font-bold mb-2">
                    Configuring a <span className="text-indigo-300">fetch</span> request.
                </h2>
                <p className="text-zinc-400 max-w-xl">
                    The second argument to <code>fetch()</code> controls HTTP method,
                    headers, and body. Here we visualize how those options shape the
                    request sent to the Cat API.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Code + explanation */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-5">
                    <h3 className="font-semibold mb-1">Request configuration object</h3>

                    <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
                        {`async function fetchCatConfigured() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search",
    {
      method: "GET", // HTTP verb
      headers: {
        "Content-Type": "application/json",
        "x-demo-client": "build-it-api-fetching",
      },
      // body: JSON.stringify({ demo: true }) // for POST / PUT / PATCH
    }
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  return data[0].url;
}`}
                    </pre>

                    {/* Methods */}
                    <div className="text-sm text-zinc-300 space-y-2">
                        <p className="font-semibold">HTTP methods</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <MethodBadge label="GET" desc="Read data" />
                            <MethodBadge label="POST" desc="Create new data" />
                            <MethodBadge label="PUT" desc="Replace resource" />
                            <MethodBadge label="PATCH" desc="Update part of resource" />
                            <MethodBadge label="DELETE" desc="Remove resource" />
                        </div>
                    </div>

                    {/* Headers & Body bullets */}
                    <div className="grid gap-4 text-sm text-zinc-300">
                        <div>
                            <p className="font-semibold mb-1">Headers</p>
                            <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                <li>
                                    <code>Content-Type</code> tells the server how to interpret
                                    the body.
                                </li>
                                <li>
                                    Custom headers (like <code>x-demo-client</code>) carry
                                    metadata.
                                </li>
                                <li>
                                    Auth headers (e.g. <code>Authorization: Bearer token</code>)
                                    identify the client.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">Body (for POST/PUT/PATCH)</p>
                            <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                <li>
                                    Use <code>JSON.stringify</code> when sending JSON objects.
                                </li>
                                <li>
                                    <code>FormData</code> for file uploads and multipart forms.
                                </li>
                                <li>
                                    <code>URLSearchParams</code> for{" "}
                                    <code>x-www-form-urlencoded</code> data.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={runConfiguredFetch}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
                    >
                        Run configured fetch()
                    </button>
                </div>

                {/* Diagram */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-5">
                    <h3 className="font-semibold mb-4 text-base">Visual data flow</h3>

                    <p className="text-xs text-zinc-400 mb-1">
                        How the options object is built and sent
                    </p>

                    <div className="flex flex-col gap-4 text-xs">
                        {/* Build config step-by-step */}
                        <div className="flex items-center gap-4">
                            <FlowBox label="Browser" active={step >= 1} />
                            <FlowArrow />
                            <FlowBox label="Method" active={step >= 2} />
                            <FlowArrow />
                            <FlowBox label="Headers" active={step >= 3} />
                            <FlowArrow />
                            <FlowBox label="Body" active={step >= 4} />
                        </div>

                        {/* Send request / receive response */}
                        <div className="flex items-center gap-4">
                            <FlowBox label="HTTP Request" active={step >= 5} />
                            <FlowArrow />
                            <FlowBox label="Cat API" active={step >= 6} />
                            <FlowArrow />
                            <FlowBox label="HTTP Response" active={step >= 7} />
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-zinc-400">
                        <p>
                            Step:&nbsp;
                            <span className="text-zinc-100 font-medium">
                                {step === 0 && "Idle"}
                                {step === 1 && "Browser preparing fetch() call"}
                                {step === 2 && "Choosing HTTP method"}
                                {step === 3 && "Attaching headers"}
                                {step === 4 && "Preparing body data"}
                                {step === 5 && "Sending HTTP request"}
                                {step === 6 && "Cat API handling request"}
                                {step === 7 && "Receiving HTTP response"}
                            </span>
                        </p>
                        {responseStatus && (
                            <p className="mt-1 text-xs text-zinc-500">
                                Last response status:{" "}
                                <span className="text-indigo-300">{responseStatus}</span>
                            </p>
                        )}
                    </div>

                    {/* Quick reference table */}
                    <div className="mt-5 text-xs text-zinc-300">
                        <p className="font-semibold mb-2">Quick reference</p>
                        <div className="grid grid-cols-3 gap-2">
                            <RefCell title="method" desc="HTTP verb (GET, POST…)" />
                            <RefCell title="headers" desc="Metadata / auth / content-type" />
                            <RefCell title="body" desc="Data you send (JSON, form…)" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Status line */}
            <div className="mt-8 text-center text-sm">
                {status === "idle" && (
                    <p className="text-zinc-400">Click “Run configured fetch()”.</p>
                )}
                {status === "loading" && (
                    <p className="text-yellow-400">Sending configured request…</p>
                )}
                {status === "success" && (
                    <p className="text-green-400">
                        Configured request completed successfully ✓
                    </p>
                )}
                {status === "error" && (
                    <p className="text-red-400">Request failed ✕</p>
                )}
            </div>
        </>
    );
}

function MethodBadge({ label, desc }) {
    return (
        <div className="border border-zinc-700 rounded-lg px-3 py-2 flex flex-col gap-1 bg-zinc-950">
            <span className="text-xs font-semibold text-indigo-300">{label}</span>
            <span className="text-[11px] text-zinc-400">{desc}</span>
        </div>
    );
}

function RefCell({ title, desc }) {
    return (
        <div className="border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-950">
            <p className="font-mono text-[11px] text-indigo-300 mb-1">{title}</p>
            <p className="text-[11px] text-zinc-400">{desc}</p>
        </div>
    );
}

function FlowBox({ label, active }) {
    return (
        <div
            className={`w-32 h-14 rounded-xl flex items-center justify-center border text-xs text-center px-2 transition-all duration-300 ${active
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

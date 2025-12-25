import { useState } from "react";

export default function PromisesAsync() {
    const [step, setStep] = useState(0);
    const [mode, setMode] = useState("await"); // "then" | "await"
    const [status, setStatus] = useState("idle");
    const [imageUrl, setImageUrl] = useState(null);

    async function runFlow(selectedMode) {
        setMode(selectedMode);
        setStatus("loading");
        setImageUrl(null);
        setStep(1); // sending request

        try {
            // Browser → API
            setTimeout(() => setStep(2), 1200);

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search"
            );

            if (!response.ok) {
                throw new Error("Request failed");
            }

            // parsing step
            setTimeout(() => setStep(3), 2200);

            const data = await response.json();

            // UI update
            setTimeout(() => {
                setImageUrl(data[0].url);
                setStatus("success");
                setStep(4);
            }, 3200);
        } catch (e) {
            setStatus("error");
        }
    }

    return (
        <>
            {/* Headline */}
            <div className="mb-10">
                <h2 className="text-4xl font-bold mb-2">
                    Two ways to handle <span className="text-indigo-300">Promises</span>.
                </h2>
                <p className="text-zinc-400 max-w-xl">
                    Using the same cat API, compare classic <code>.then()</code> chains
                    with modern <code>async/await</code>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Code column */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Code examples</h3>
                        <div className="inline-flex rounded-md border border-zinc-700 text-xs overflow-hidden">
                            <button
                                onClick={() => runFlow("then")}
                                className={`px-3 py-1 ${mode === "then"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                .then chain
                            </button>
                            <button
                                onClick={() => runFlow("await")}
                                className={`px-3 py-1 ${mode === "await"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                async/await
                            </button>
                        </div>
                    </div>

                    {/* Promise chain */}
                    <div>
                        <p className="text-xs text-zinc-400 mb-2">Pattern 1 · .then()</p>
                        <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
                            {`function fetchCatWithThen() {
  return fetch("https://api.thecatapi.com/v1/images/search")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed");
      }
      return response.json();
    })
    .then((data) => {
      const url = data[0].url;
      console.log("Cat image URL:", url);
      return url;
    })
    .catch((error) => {
      console.error("Something went wrong:", error);
      throw error;
    });
}`}
                        </pre>
                    </div>

                    {/* async/await */}
                    <div>
                        <p className="text-xs text-zinc-400 mb-2">Pattern 2 · async/await</p>
                        <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
                            {`async function fetchCatWithAwait() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search"
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  const url = data[0].url;
  console.log("Cat image URL:", url);
  return url;
}`}
                        </pre>
                    </div>

                    <button
                        onClick={() => runFlow(mode)}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
                    >
                        Run {mode === "then" ? ".then()" : "async/await"} flow
                    </button>
                </div>

                {/* Diagram column */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="font-semibold mb-5 text-base">Visual data flow</h3>

                    {/* .then flow */}
                    <p className="text-xs text-zinc-400 mb-2">
                        Promise chain with <code>.then()</code>
                    </p>
                    <div className="flex items-center gap-5 mb-6">
                        <FlowBox label="Browser" active={mode === "then" && step === 1} />
                        <FlowArrow />
                        <FlowBox label="Cat API" active={mode === "then" && step === 2} />
                        <FlowArrow />
                        <FlowBox
                            label=".then → .then"
                            active={mode === "then" && step === 3}
                        />
                        <FlowArrow />
                        <FlowBox
                            label="Update UI"
                            active={mode === "then" && step === 4}
                        />
                    </div>

                    {/* async/await flow */}
                    <p className="text-xs text-zinc-400 mb-2">async/await flow</p>
                    <div className="flex items-center gap-5 mb-4">
                        <FlowBox label="Browser" active={mode === "await" && step === 1} />
                        <FlowArrow />
                        <FlowBox label="Cat API" active={mode === "await" && step === 2} />
                        <FlowArrow />
                        <FlowBox
                            label="await / await"
                            active={mode === "await" && step === 3}
                        />
                        <FlowArrow />
                        <FlowBox
                            label="Update UI"
                            active={mode === "await" && step === 4}
                        />
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        Step:&nbsp;
                        <span className="text-zinc-100 font-medium">
                            {step === 0 && "Idle"}
                            {step === 1 && "Sending request"}
                            {step === 2 && "Waiting for response"}
                            {step === 3 &&
                                (mode === "then"
                                    ? "Running .then() callbacks"
                                    : "Running await lines")}
                            {step === 4 && "Updating UI with image URL"}
                        </span>
                    </p>
                </div>
            </div>

            {/* Result */}
            <div className="mt-10 text-center">
                {status === "loading" && (
                    <p className="text-yellow-400">Fetching cat image…</p>
                )}

                {status === "success" && imageUrl && (
                    <>
                        <img
                            src={imageUrl}
                            alt="cat"
                            className="mx-auto rounded-lg max-h-64 mb-3"
                        />
                        <p className="text-green-400 font-medium">
                            Data fetched and rendered ✓
                        </p>
                    </>
                )}

                {status === "error" && (
                    <p className="text-red-400">Request failed ✕</p>
                )}
            </div>

            {/* Takeaway */}
            <div className="mt-8 text-sm text-zinc-300 max-w-2xl">
                <p className="font-semibold mb-2">When to use which pattern</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>.then() is fine for short chains or legacy code.</li>
                    <li>async/await is better for complex, readable logic.</li>
                    <li>Both rely on the same Promise flow; only syntax changes.</li>
                </ul>
            </div>
        </>
    );
}

function FlowBox({ label, active }) {
    return (
        <div
            className={`w-40 h-16 rounded-xl flex items-center justify-center border text-sm text-center px-2 transition-all duration-300 ${active
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

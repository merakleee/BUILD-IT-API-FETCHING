import { useState } from "react";

export default function XhrLegacy() {
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [imageUrl, setImageUrl] = useState(null);

    async function runXhrFlow() {
        setStatus("loading");
        setImageUrl(null);
        setStep(1); // Browser sending

        try {
            // Browser → API
            setTimeout(() => setStep(2), 1400);

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search"
            );

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data = await response.json();

            // API → UI (callback style)
            setTimeout(() => setStep(3), 2600);
            setTimeout(() => {
                setImageUrl(data[0].url);
                setStatus("success");
            }, 3400);
        } catch (e) {
            setStatus("error");
        }
    }

    return (
        <>
            {/* Headline */}
            <div className="mb-10">
                <h2 className="text-4xl font-bold mb-2">
                    Before <code>fetch()</code> there was{" "}
                    <span className="text-red-300">XMLHttpRequest</span>.
                </h2>
                <p className="text-zinc-400 max-w-xl">
                    Same cat API, two different ways to request it. Here we focus on the
                    legacy <code>XMLHttpRequest</code> flow and compare it to{" "}
                    <code>fetch()</code>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Code */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="font-semibold mb-4">Code example (XHR vs fetch)</h3>

                    <p className="text-xs text-zinc-400 mb-2">
                        XMLHttpRequest (legacy) calling the cat API:
                    </p>
                    <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto mb-4">
                        {`const xhr = new XMLHttpRequest();

xhr.open("GET", "https://api.thecatapi.com/v1/images/search");

xhr.onload = function () {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log("Cat image URL:", data[0].url);
  } else {
    console.error("Request failed:", xhr.status);
  }
};

xhr.onerror = function () {
  console.error("Network error");
};

xhr.send();`}
                    </pre>

                    <p className="text-xs text-zinc-400 mb-2">
                        Same request with <code>fetch()</code>:
                    </p>
                    <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
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

                    <button
                        onClick={runXhrFlow}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
                    >
                        Run XHR flow
                    </button>
                </div>

                {/* Diagram */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="font-semibold mb-5 text-base">Visual data flow</h3>

                    {/* XHR row */}
                    <p className="text-xs text-zinc-400 mb-2">XMLHttpRequest flow</p>
                    <div className="flex items-center gap-5 mb-6">
                        <FlowBox label="Browser (XHR)" active={step === 1} />
                        <FlowArrow />
                        <FlowBox label="Cat API" active={step === 2} />
                        <FlowArrow />
                        <FlowBox label="onload / onerror" active={step === 3} />
                    </div>

                    {/* fetch row */}
                    <p className="text-xs text-zinc-400 mb-2">Conceptual fetch() flow</p>
                    <div className="flex items-center gap-5 mb-4">
                        <FlowBox label="Browser (fetch)" active={false} />
                        <FlowArrow />
                        <FlowBox label="Cat API" active={false} />
                        <FlowArrow />
                        <FlowBox label="Promise / async‑await" active={false} />
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        Step:&nbsp;
                        <span className="text-zinc-100 font-medium">
                            {step === 0 && "Idle"}
                            {step === 1 && "Sending request with XHR"}
                            {step === 2 && "Cat API responding"}
                            {step === 3 && "Callback parsing JSON & updating UI"}
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

            {/* Short takeaway */}
            <div className="mt-8 text-sm text-zinc-300 max-w-2xl">
                <p className="font-semibold mb-2">Key takeaway</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>XHR uses callbacks and more boilerplate.</li>
                    <li>fetch uses Promises and works naturally with async/await.</li>
                    <li>
                        Using the same Cat API on both pages makes the difference in style
                        very clear.
                    </li>
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

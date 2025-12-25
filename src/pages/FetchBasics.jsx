import { useState } from "react";

export default function FetchBasics() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [imageUrl, setImageUrl] = useState(null);

  async function runFetch() {
    setStatus("loading");
    setImageUrl(null);
    setStep(1);

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

      // API → UI
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
          We don’t just code.
          <span className="text-indigo-400"> We visualize.</span>
        </h2>
        <p className="text-zinc-400 max-w-xl">
          Understanding how <code>fetch()</code> works step by step.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="font-semibold mb-4">Code example</h3>

          <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
{`async function fetchData() {
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
            onClick={runFetch}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
          >
            Run fetch()
          </button>
        </div>

        {/* Diagram */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="font-semibold mb-6">Visual data flow</h3>

          <div className="flex items-center justify-between gap-4">
            <FlowBox label="Browser" active={step === 1} />
            <FlowArrow />
            <FlowBox label="API" active={step === 2} />
            <FlowArrow />
            <FlowBox label="UI" active={step === 3} />
          </div>

          <p className="mt-6 text-sm text-zinc-400">
            Step:&nbsp;
            <span className="text-zinc-100 font-medium">
              {step === 0 && "Idle"}
              {step === 1 && "Sending request"}
              {step === 2 && "Receiving response"}
              {step === 3 && "Updating UI"}
            </span>
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="mt-10 text-center">
        {status === "loading" && (
          <p className="text-yellow-400">Fetching data…</p>
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
    </>
  );
}

function FlowBox({ label, active }) {
  return (
    <div
      className={`w-32 h-20 rounded-xl flex items-center justify-center border transition-all duration-300 ${
        active
          ? "border-indigo-400 text-indigo-400 shadow-md shadow-indigo-500/20"
          : "border-zinc-700 text-zinc-400"
      }`}
    >
      {label}
    </div>
  );
}

function FlowArrow() {
  return <span className="text-zinc-600 text-2xl">→</span>;
}

import { useState } from "react";

export default function ResponseParsing() {
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [mode, setMode] = useState("json"); // "json" | "text" | "blob"
    const [imageUrl, setImageUrl] = useState(null);
    const [rawPreview, setRawPreview] = useState("");

    async function runParse(selectedMode) {
        setMode(selectedMode);
        setStatus("loading");
        setImageUrl(null);
        setRawPreview("");
        setStep(1);

        try {
            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search"
            );

            setTimeout(() => setStep(2), 800);
            setTimeout(() => setStep(3), 1600);

            if (!response.ok) {
                throw new Error("Request failed: " + response.status);
            }

            if (selectedMode === "json") {
                const data = await response.json();
                const preview = JSON.stringify(data, null, 2);
                setTimeout(() => {
                    setStatus("success");
                    setStep(4);
                    setRawPreview(preview);
                }, 2300);
            } else if (selectedMode === "text") {
                const txt = await response.text();
                setTimeout(() => {
                    setStatus("success");
                    setStep(4);
                    setRawPreview(txt);
                }, 2300);
            } else {
                // "blob" demo – conceptually show the image URL as if we had created it from a blob
                const data = await response.json();
                const url = data[0]?.url;
                if (!url) {
                    throw new Error("No image URL in Cat API response");
                }
                setTimeout(() => {
                    setStatus("success");
                    setStep(4);
                    setImageUrl(url);
                }, 2300);
            }
        } catch (e) {
            console.error("Parsing demo error:", e);
            setStatus("error");
        }
    }

    return (
        <>
            {/* Headline */}
            <div className="mb-10">
                <h2 className="text-4xl font-bold mb-2">
                    Parsing the <span className="text-indigo-300">Response</span>.
                </h2>
                <p className="text-zinc-400 max-w-xl">
                    <code>fetch()</code> returns a <code>Response</code> object. You must
                    choose the right method—<code>.json()</code>, <code>.text()</code>, or{" "}
                    <code>.blob()</code>—and you can only use one of them once.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Code + controls */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Response parsing methods</h3>
                        <div className="inline-flex rounded-md border border-zinc-700 text-xs overflow-hidden">
                            <button
                                onClick={() => setMode("json")}
                                className={`px-3 py-1 ${mode === "json"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                .json()
                            </button>
                            <button
                                onClick={() => setMode("text")}
                                className={`px-3 py-1 ${mode === "text"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                .text()
                            </button>
                            <button
                                onClick={() => setMode("blob")}
                                className={`px-3 py-1 ${mode === "blob"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-zinc-900 text-zinc-300"
                                    }`}
                            >
                                .blob()
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-zinc-400 mb-2">
                        Base request to the Cat API:
                    </p>
                    <pre className="bg-black rounded-lg p-4 text-sm text-zinc-200 overflow-auto">
                        {`const response = await fetch(
  "https://api.thecatapi.com/v1/images/search"
);

if (!response.ok) throw new Error("Request failed");`}
                    </pre>

                    <div className="space-y-3 text-xs text-zinc-300">
                        <div>
                            <p className="font-semibold mb-1">.json() · API data</p>
                            <pre className="bg-black rounded-lg p-3 text-[11px] text-zinc-200 overflow-auto">
                                {`const data = await response.json();
const url = data[0].url;`}
                            </pre>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">.text() · raw text</p>
                            <pre className="bg-black rounded-lg p-3 text-[11px] text-zinc-200 overflow-auto">
                                {`const text = await response.text();`}
                            </pre>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">.blob() · binary file (concept)</p>
                            <pre className="bg-black rounded-lg p-3 text-[11px] text-zinc-200 overflow-auto">
                                {`const data = await response.json();
const url = data[0].url; // imagine we got this from a blob URL`}
                            </pre>
                        </div>
                    </div>

                    <p className="text-xs text-red-300">
                        Important: call only one of <code>.json()</code>,{" "}
                        <code>.text()</code>, or <code>.blob()</code> per response; the body
                        is consumed after the first call.
                    </p>

                    <button
                        onClick={() => runParse(mode)}
                        className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
                    >
                        Run {mode} parsing demo
                    </button>
                </div>

                {/* Diagram / decision tree */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-5">
                    <h3 className="font-semibold mb-4 text-base">Visual parsing flow</h3>

                    <div className="flex flex-col gap-4 text-xs">
                        <div className="flex items-center gap-4">
                            <FlowBox label="HTTP Response" active={step >= 1} />
                            <FlowArrow />
                            <FlowBox
                                label="Inspect data / Content-Type"
                                active={step >= 2}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <FlowBox
                                label="API JSON?"
                                active={mode === "json" && step >= 2}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="Text / HTML?"
                                active={mode === "text" && step >= 2}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="Image / file?"
                                active={mode === "blob" && step >= 2}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <FlowBox
                                label="response.json()"
                                active={mode === "json" && step >= 3}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="response.text()"
                                active={mode === "text" && step >= 3}
                            />
                            <FlowArrow />
                            <FlowBox
                                label="response.blob() (concept)"
                                active={mode === "blob" && step >= 3}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <FlowBox label="Parsed data" active={step >= 4} />
                            <FlowArrow />
                            <FlowBox label="UI update" active={step >= 4} />
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        Step:&nbsp;
                        <span className="text-zinc-100 font-medium">
                            {step === 0 && "Idle"}
                            {step === 1 && "Response object received"}
                            {step === 2 && "Choosing the right parsing method"}
                            {step === 3 &&
                                (mode === "json"
                                    ? "Calling .json()"
                                    : mode === "text"
                                        ? "Calling .text()"
                                        : "Calling .blob() conceptually")}
                            {step === 4 && "Parsed data ready for the UI"}
                        </span>
                    </p>

                    {/* Preview */}
                    <div className="mt-4 text-xs text-zinc-300">
                        <p className="font-semibold mb-2">Parsed preview</p>
                        <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950 min-h-[140px]">
                            {status === "idle" && (
                                <p className="text-zinc-500">
                                    Choose a method and click "Run parsing demo".
                                </p>
                            )}
                            {status === "loading" && (
                                <p className="text-yellow-400">Fetching and parsing…</p>
                            )}
                            {status === "error" && (
                                <p className="text-red-400">Request or parsing failed ✕</p>
                            )}
                            {status === "success" && mode !== "blob" && (
                                <pre className="whitespace-pre-wrap text-[11px] text-zinc-200 max-h-48 overflow-auto">
                                    {rawPreview}
                                </pre>
                            )}
                            {status === "success" && mode === "blob" && imageUrl && (
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={imageUrl}
                                        alt="Cat from blob demo"
                                        className="max-h-48 rounded"
                                    />
                                    <p className="text-[11px] text-zinc-400">
                                        Image URL obtained after parsing the JSON (simplified blob
                                        demo).
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
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

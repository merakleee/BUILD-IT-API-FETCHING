import { useState, useEffect, useRef } from "react";

export default function UseHookPage() {
    const [animationStep, setAnimationStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedPath, setSelectedPath] = useState("success"); // "success" or "error"
    const timeoutsRef = useRef([]);

    const startAnimation = (path) => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        setSelectedPath(path);
        setIsAnimating(true);
        setAnimationStep(0);

        const delays = [0, 700, 1400, 2100, 2800, 3500];

        delays.forEach((delay, idx) => {
            const id = setTimeout(() => setAnimationStep(idx + 1), delay);
            timeoutsRef.current.push(id);
        });

        const endId = setTimeout(() => {
            setIsAnimating(false);
            setAnimationStep(0);
        }, 4500);
        timeoutsRef.current.push(endId);
    };

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    const getStepDescription = () => {
        if (selectedPath === "success") {
            switch (animationStep) {
                case 1:
                    return "1. Component calls use(resource)";
                case 2:
                    return "2. use() reads the Promise value";
                case 3:
                    return "3. Promise is pending → triggers Suspense fallback";
                case 4:
                    return "4. Promise resolves successfully";
                case 5:
                    return "5. Data flows back to component";
                case 6:
                    return "6. Component renders UI with the data";
                default:
                    return "Ready to animate (Success Path)";
            }
        } else {
            switch (animationStep) {
                case 1:
                    return "1. Component calls use(resource)";
                case 2:
                    return "2. use() reads the Promise value";
                case 3:
                    return "3. Promise is pending → triggers Suspense fallback";
                case 4:
                    return "4. Promise rejects with an error";
                case 5:
                    return "5. Error flows to Error Boundary";
                case 6:
                    return "6. Error Boundary renders error UI";
                default:
                    return "Ready to animate (Error Path)";
            }
        }
    };

    // Helper function to determine stroke color based on selected path and element
    const getStrokeColor = (elementType) => {
        const isActive =
            (selectedPath === "success" && elementType === "success") ||
            (selectedPath === "error" && elementType === "error");

        if (!isActive) return "#4b5563"; // muted gray

        switch (elementType) {
            case "success":
                return "url(#emeraldGrad)";
            case "error":
                return "url(#redGrad)";
            case "use":
                return "url(#purpleGrad)";
            case "suspense":
                return "url(#indigoGrad)";
            case "promise":
                return "url(#indigoGrad)";
            default:
                return "#4b5563";
        }
    };

    // Helper function to determine text color based on selected path and element
    const getTextColor = (elementType) => {
        const isActive =
            (selectedPath === "success" && elementType === "success") ||
            (selectedPath === "error" && elementType === "error");

        return isActive ? "#ffffff" : "#6b7280";
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-zinc-900/30 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-sm font-semibold text-purple-200 mb-4">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        React 19 · Experimental API
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        The{" "}
                        <code className="px-3 py-1 rounded-lg bg-black/40 text-purple-300 font-mono">
                            use()
                        </code>{" "}
                        API
                    </h2>
                    <p className="text-lg text-zinc-200 max-w-3xl leading-relaxed">
                        <code className="px-2 py-0.5 rounded bg-black/40 text-purple-300 font-mono">
                            use()
                        </code>{" "}
                        lets a component read the value of a Promise or a context resource
                        and integrates with{" "}
                        <code className="px-2 py-0.5 rounded bg-black/40 text-indigo-300">
                            &lt;Suspense&gt;
                        </code>{" "}
                        and Error Boundaries for loading and error states.
                    </p>
                </div>
            </div>

            {/* What & Where Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <span className="text-2xl">?</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">What is use()?</h3>
                    </div>
                    <div className="space-y-3 text-sm text-zinc-300">
                        <p>
                            <code className="px-2 py-0.5 rounded bg-black/40 text-purple-300 font-mono">
                                use(resource)
                            </code>{" "}
                            reads the value of a resource such as a Promise or a context
                            object and returns its resolved value.
                        </p>
                        <p>
                            Unlike traditional Hooks,{" "}
                            <code className="text-purple-300 font-mono">use()</code> can be
                            called inside loops and conditionals, but it must still be called
                            from a React component or custom hook function.
                        </p>
                        <div className="bg-black/40 rounded-lg p-4 border border-zinc-800">
                            <p className="font-semibold text-white mb-2">Key behavior</p>
                            <p>
                                When you pass a pending Promise, React suspends that component:
                                the nearest{" "}
                                <code className="text-indigo-300 font-mono">
                                    &lt;Suspense&gt;
                                </code>{" "}
                                fallback is shown until the Promise resolves, and rejected
                                Promises flow to the nearest Error Boundary.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-2xl">📍</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">Where does it fit?</h3>
                    </div>
                    <div className="space-y-3 text-sm text-zinc-300">
                        <div className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <p>
                                Lets components consume async data without wiring{" "}
                                <code className="font-mono">useState</code> and{" "}
                                <code className="font-mono">useEffect</code> for loading and
                                error state.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <p>
                                Designed to work with{" "}
                                <span className="font-semibold">Suspense</span> and Error
                                Boundaries: pending Promises show fallbacks, rejections render
                                error UI.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <p>
                                Pairs especially well with{" "}
                                <span className="font-semibold">Server Components</span>, where
                                Promises are created on the server and passed to client
                                components as props.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <p>
                                Complements tools like React Query:{" "}
                                <code className="font-mono">use()</code> is a React primitive,
                                not an HTTP client or cache by itself.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Diagram */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Visual data flow</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Select a path to visualize how use() handles different Promise outcomes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => startAnimation("success")}
                            disabled={isAnimating}
                            className={`px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 disabled:scale-100 flex items-center gap-2 ${selectedPath === "success"
                                    ? "bg-emerald-600 hover:bg-emerald-500"
                                    : "bg-zinc-800 hover:bg-zinc-700"
                                } ${isAnimating && selectedPath !== "success" ? "opacity-50" : ""}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Success Path
                        </button>
                        <button
                            onClick={() => startAnimation("error")}
                            disabled={isAnimating}
                            className={`px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 disabled:scale-100 flex items-center gap-2 ${selectedPath === "error"
                                    ? "bg-red-600 hover:bg-red-500"
                                    : "bg-zinc-800 hover:bg-zinc-700"
                                } ${isAnimating && selectedPath !== "error" ? "opacity-50" : ""}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            Error Path
                        </button>
                    </div>
                </div>

                {/* Step Description */}
                <div className="bg-black/60 rounded-lg border border-zinc-800 px-4 py-3 mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-zinc-500">Current step</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${selectedPath === "success" ? "bg-emerald-500" : "bg-red-500"}`}></div>
                            <span className="text-xs text-zinc-400">
                                {selectedPath === "success" ? "Success Path" : "Error Path"}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-zinc-100 mb-2">
                        {getStepDescription()}
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${selectedPath === "success"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                    : "bg-gradient-to-r from-red-500 to-orange-500"
                                }`}
                            style={{ width: `${(animationStep / 6) * 100}%` }}
                        />
                    </div>
                </div>

                {/* SVG Diagram */}
                <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-xl p-6 min-h-96 flex items-center justify-center">
                    <svg
                        className="w-full h-full max-w-4xl"
                        viewBox="0 0 620 360"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <marker
                                id="arrowPurple"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#a855f7" />
                            </marker>
                            <marker
                                id="arrowGreen"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#34d399" />
                            </marker>
                            <marker
                                id="arrowRed"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                            </marker>
                            <marker
                                id="arrowIndigo"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#818cf8" />
                            </marker>
                            <marker
                                id="arrowMuted"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
                            </marker>
                        </defs>

                        {/* Error Boundary */}
                        <g
                            className={
                                (selectedPath === "error" && animationStep >= 5)
                                    ? "animate-pulse-slow"
                                    : ""
                            }
                        >
                            <rect
                                x="180"
                                y="20"
                                width="260"
                                height="65"
                                rx="12"
                                fill="#18181b"
                                stroke={getStrokeColor("error")}
                                strokeWidth="3"
                                strokeDasharray="10,5"
                            />
                            <text
                                x="310"
                                y="47"
                                textAnchor="middle"
                                fill={getTextColor("error")}
                                fontSize="15"
                                fontWeight="700"
                            >
                                Error Boundary
                            </text>
                            <text
                                x="310"
                                y="68"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                catches rejected Promises
                            </text>
                        </g>

                        {/* Suspense */}
                        <g className={animationStep >= 3 ? "animate-pulse-slow" : ""}>
                            <rect
                                x="180"
                                y="105"
                                width="260"
                                height="65"
                                rx="12"
                                fill="#18181b"
                                stroke={getStrokeColor("suspense")}
                                strokeWidth="3"
                                strokeDasharray="10,5"
                            />
                            <text
                                x="310"
                                y="132"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="15"
                                fontWeight="700"
                            >
                                &lt;Suspense&gt;
                            </text>
                            <text
                                x="310"
                                y="153"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                shows fallback while pending
                            </text>
                        </g>

                        {/* Component */}
                        <g
                            className={
                                animationStep === 1 ||
                                    (selectedPath === "success" && animationStep >= 5)
                                    ? "animate-pulse-slow"
                                    : ""
                            }
                        >
                            <rect
                                x="40"
                                y="190"
                                width="130"
                                height="70"
                                rx="12"
                                fill="#18181b"
                                stroke={getStrokeColor("success")}
                                strokeWidth="3.5"
                            />
                            <text
                                x="105"
                                y="220"
                                textAnchor="middle"
                                fill={getTextColor("success")}
                                fontSize="15"
                                fontWeight="700"
                            >
                                Component
                            </text>
                            <text
                                x="105"
                                y="243"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                calls use()
                            </text>
                        </g>

                        {/* use() */}
                        <g
                            className={
                                animationStep === 2 ||
                                    (selectedPath === "success" && animationStep >= 4)
                                    ? "animate-pulse-slow"
                                    : ""
                            }
                        >
                            <rect
                                x="240"
                                y="190"
                                width="100"
                                height="70"
                                rx="12"
                                fill="#18181b"
                                stroke={getStrokeColor("use")}
                                strokeWidth="3.5"
                            />
                            <text
                                x="290"
                                y="220"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="15"
                                fontWeight="700"
                            >
                                use()
                            </text>
                            <text
                                x="290"
                                y="243"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                reads value
                            </text>
                        </g>

                        {/* Promise/Context */}
                        <g
                            className={
                                animationStep === 2 ||
                                    animationStep === 3 ||
                                    animationStep === 4
                                    ? "animate-pulse-slow"
                                    : ""
                            }
                        >
                            <rect
                                x="410"
                                y="190"
                                width="170"
                                height="70"
                                rx="12"
                                fill="#18181b"
                                stroke={getStrokeColor("promise")}
                                strokeWidth="3.5"
                            />
                            <text
                                x="495"
                                y="220"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="15"
                                fontWeight="700"
                            >
                                Promise / Context
                            </text>
                            <text
                                x="495"
                                y="243"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                async data source
                            </text>
                        </g>

                        {/* Rendered UI / Error UI */}
                        <g
                            className={
                                (selectedPath === "success" && animationStep === 6) ||
                                    (selectedPath === "error" && animationStep === 6)
                                    ? "animate-pulse-slow"
                                    : ""
                            }
                        >
                            <rect
                                x="200"
                                y="280"
                                width="220"
                                height="70"
                                rx="12"
                                fill="#18181b"
                                stroke={getStrokeColor(selectedPath)}
                                strokeWidth="3.5"
                            />
                            <text
                                x="310"
                                y="310"
                                textAnchor="middle"
                                fill={getTextColor(selectedPath)}
                                fontSize="15"
                                fontWeight="700"
                            >
                                {selectedPath === "success" ? "Rendered UI" : "Error UI"}
                            </text>
                            <text
                                x="310"
                                y="333"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                {selectedPath === "success" ? "data displayed" : "error displayed"}
                            </text>
                        </g>

                        {/* ARROWS - COMMON PATH (Steps 1-3) */}

                        {/* 1: Component -> use() */}
                        {animationStep === 1 && (
                            <>
                                <path
                                    d="M 170 225 Q 205 225 240 225"
                                    stroke={selectedPath === "success" ? "#a855f7" : selectedPath === "error" ? "#a855f7" : "#6b7280"}
                                    strokeWidth="4"
                                    fill="none"
                                    className="animate-draw-smooth"
                                    markerEnd={selectedPath === "success" || selectedPath === "error" ? "url(#arrowPurple)" : "url(#arrowMuted)"}
                                />
                                <circle
                                    cx="205"
                                    cy="225"
                                    r="5"
                                    fill={selectedPath === "success" || selectedPath === "error" ? "#a855f7" : "#6b7280"}
                                    className="animate-pulse-circle"
                                />
                            </>
                        )}

                        {/* 2: use() -> Promise */}
                        {animationStep === 2 && (
                            <>
                                <path
                                    d="M 340 225 Q 375 225 410 225"
                                    stroke={selectedPath === "success" ? "#818cf8" : selectedPath === "error" ? "#818cf8" : "#6b7280"}
                                    strokeWidth="4"
                                    fill="none"
                                    className="animate-draw-smooth"
                                    markerEnd={selectedPath === "success" || selectedPath === "error" ? "url(#arrowIndigo)" : "url(#arrowMuted)"}
                                />
                                <circle
                                    cx="375"
                                    cy="225"
                                    r="5"
                                    fill={selectedPath === "success" || selectedPath === "error" ? "#818cf8" : "#6b7280"}
                                    className="animate-pulse-circle"
                                />
                            </>
                        )}

                        {/* 3: Promise -> Suspense */}
                        {animationStep === 3 && (
                            <>
                                <path
                                    d="M 495 190 Q 495 160 400 137"
                                    stroke={selectedPath === "success" ? "#818cf8" : selectedPath === "error" ? "#818cf8" : "#6b7280"}
                                    strokeWidth="4"
                                    fill="none"
                                    className="animate-draw-smooth"
                                    strokeDasharray="8,4"
                                    markerEnd={selectedPath === "success" || selectedPath === "error" ? "url(#arrowIndigo)" : "url(#arrowMuted)"}
                                />
                                <circle
                                    cx="310"
                                    cy="137"
                                    r="10"
                                    fill="none"
                                    stroke={selectedPath === "success" ? "#fbbf24" : selectedPath === "error" ? "#fbbf24" : "#6b7280"}
                                    strokeWidth="3"
                                    className="animate-ping-ring"
                                />
                                <text
                                    x="310"
                                    y="100"
                                    textAnchor="middle"
                                    fill={selectedPath === "success" ? "#fbbf24" : selectedPath === "error" ? "#fbbf24" : "#6b7280"}
                                    fontSize="12"
                                    fontWeight="700"
                                    className="animate-fade-in"
                                >
                                    Loading...
                                </text>
                            </>
                        )}

                        {/* SUCCESS PATH ARROWS (Steps 4-6) */}
                        {selectedPath === "success" && (
                            <>
                                {/* 4: Promise resolves -> use() */}
                                {animationStep === 4 && (
                                    <>
                                        <path
                                            d="M 410 210 Q 375 210 340 210"
                                            stroke="#34d399"
                                            strokeWidth="4"
                                            fill="none"
                                            className="animate-draw-smooth"
                                            markerEnd="url(#arrowGreen)"
                                        />
                                        <circle
                                            cx="375"
                                            cy="210"
                                            r="5"
                                            fill="#34d399"
                                            className="animate-pulse-circle"
                                        />
                                    </>
                                )}

                                {/* 5: use() -> Component */}
                                {animationStep === 5 && (
                                    <>
                                        <path
                                            d="M 240 210 Q 205 210 170 210"
                                            stroke="#34d399"
                                            strokeWidth="4"
                                            fill="none"
                                            className="animate-draw-smooth"
                                            markerEnd="url(#arrowGreen)"
                                        />
                                        <circle
                                            cx="205"
                                            cy="210"
                                            r="5"
                                            fill="#34d399"
                                            className="animate-pulse-circle"
                                        />
                                    </>
                                )}

                                {/* 6: Component -> Rendered UI */}
                                {animationStep === 6 && (
                                    <>
                                        <path
                                            d="M 105 260 Q 105 280 200 315"
                                            stroke="#34d399"
                                            strokeWidth="4"
                                            fill="none"
                                            className="animate-draw-smooth"
                                            markerEnd="url(#arrowGreen)"
                                        />
                                        <circle
                                            cx="153"
                                            cy="285"
                                            r="5"
                                            fill="#34d399"
                                            className="animate-pulse-circle"
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {/* ERROR PATH ARROWS (Steps 4-6) - MUTED when success is selected */}
                        {selectedPath === "error" && (
                            <>
                                {/* 4: Promise rejects -> Error Boundary */}
                                {animationStep === 4 && (
                                    <>
                                        <path
                                            d="M 495 190 Q 495 120 420 52"
                                            stroke="#ef4444"
                                            strokeWidth="4"
                                            fill="none"
                                            className="animate-draw-smooth"
                                            strokeDasharray="8,4"
                                            markerEnd="url(#arrowRed)"
                                        />
                                        <circle
                                            cx="458"
                                            cy="130"
                                            r="5"
                                            fill="#ef4444"
                                            className="animate-pulse-circle"
                                        />
                                    </>
                                )}

                                {/* 5: Error Boundary activation */}
                                {animationStep === 5 && (
                                    <>
                                        <circle
                                            cx="310"
                                            cy="52"
                                            r="10"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                            className="animate-ping-ring"
                                        />
                                        <text
                                            x="310"
                                            y="15"
                                            textAnchor="middle"
                                            fill="#ef4444"
                                            fontSize="12"
                                            fontWeight="700"
                                            className="animate-fade-in"
                                        >
                                            Error caught!
                                        </text>
                                    </>
                                )}

                                {/* 6: Error Boundary -> Error UI */}
                                {animationStep === 6 && (
                                    <>
                                        <path
                                            d="M 310 85 Q 310 180 310 280"
                                            stroke="#ef4444"
                                            strokeWidth="4"
                                            fill="none"
                                            className="animate-draw-smooth"
                                            strokeDasharray="8,4"
                                            markerEnd="url(#arrowRed)"
                                        />
                                        <circle
                                            cx="310"
                                            cy="183"
                                            r="5"
                                            fill="#ef4444"
                                            className="animate-pulse-circle"
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {/* MUTED ARROWS for inactive path */}

                        {/* Muted success path arrows when error is selected */}
                        {selectedPath === "error" && animationStep >= 4 && (
                            <g opacity="0.3">
                                <path
                                    d="M 410 210 Q 375 210 340 210"
                                    stroke="#6b7280"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray="5,5"
                                    markerEnd="url(#arrowMuted)"
                                />
                                <path
                                    d="M 240 210 Q 205 210 170 210"
                                    stroke="#6b7280"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray="5,5"
                                    markerEnd="url(#arrowMuted)"
                                />
                                <path
                                    d="M 105 260 Q 105 280 200 315"
                                    stroke="#6b7280"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray="5,5"
                                    markerEnd="url(#arrowMuted)"
                                />
                            </g>
                        )}

                        {/* Muted error path arrows when success is selected */}
                        {selectedPath === "success" && animationStep >= 4 && (
                            <g opacity="0.3">
                                <path
                                    d="M 495 190 Q 495 120 420 52"
                                    stroke="#6b7280"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray="5,5"
                                    markerEnd="url(#arrowMuted)"
                                />
                                <path
                                    d="M 310 85 Q 310 180 310 280"
                                    stroke="#6b7280"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray="5,5"
                                    markerEnd="url(#arrowMuted)"
                                />
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Code Examples */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Promise Example */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">
                            📦
                        </div>
                        <h3 className="text-lg font-bold text-white">Reading a Promise</h3>
                    </div>
                    <p className="text-sm text-zinc-300 mb-4">
                        A Server Component can create a Promise and pass it to a Client
                        Component, which then reads it with{" "}
                        <code className="px-2 py-0.5 rounded bg-black/40 text-purple-300 font-mono">
                            use()
                        </code>
                        . Suspense shows the fallback while the Promise is pending.
                    </p>
                    <pre className="bg-black rounded-lg p-4 text-xs text-zinc-100 font-mono overflow-auto leading-relaxed border border-zinc-800">
                        {`// data.js (Server)
export function fetchMessage() {
  return fetch('/api/message').then(res => res.text());
}

// App.jsx (Server)
import { Suspense } from 'react';
import { Message } from './Message';
import { fetchMessage } from './data';

export default function App() {
  const messagePromise = fetchMessage();

  return (
    <Suspense fallback={<p>⌛ Waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// Message.jsx (Client)
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}`}
                    </pre>
                </div>

                {/* Context Example */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">
                            🎨
                        </div>
                        <h3 className="text-lg font-bold text-white">Reading context</h3>
                    </div>
                    <p className="text-sm text-zinc-300 mb-4">
                        When you pass a context object,{" "}
                        <code className="px-2 py-0.5 rounded bg-black/40 text-purple-300 font-mono">
                            use()
                        </code>{" "}
                        behaves like <code className="font-mono">useContext</code> but can
                        be used inside conditionals and loops.
                    </p>
                    <pre className="bg-black rounded-lg p-4 text-xs text-zinc-100 font-mono overflow-auto leading-relaxed border border-zinc-800">
                        {`import { createContext, use } from 'react';

export const ThemeContext = createContext('dark');

export function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  return (
    <>
      <ThemedButton show={true}>Sign up</ThemedButton>
      <ThemedButton show={false}>Log in</ThemedButton>
    </>
  );
}

function ThemedButton({ show, children }) {
  if (!show) return null;

  // use() can be called inside conditionals
  const theme = use(ThemeContext);
  const className = 'button-' + theme;

  return <button className={className}>{children}</button>;
}`}
                    </pre>
                </div>
            </div>

            {/* Rules & Best Practices */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                    Rules & best practices
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Do's */}
                    <div>
                        <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                            <span>✓</span> Do this
                        </h4>
                        <div className="space-y-3 text-sm text-zinc-300">
                            <div className="bg-green-950/20 border border-green-800/30 rounded-lg p-3">
                                <p>
                                    Call{" "}
                                    <code className="text-purple-300 font-mono">use()</code> only
                                    from React components or custom hooks.
                                </p>
                            </div>
                            <div className="bg-green-950/20 border border-green-800/30 rounded-lg p-3">
                                <p>
                                    Wrap components that call{" "}
                                    <code className="text-purple-300 font-mono">use()</code> in{" "}
                                    <code className="text-indigo-300 font-mono">
                                        &lt;Suspense&gt;
                                    </code>{" "}
                                    so pending Promises show a loading fallback.
                                </p>
                            </div>
                            <div className="bg-green-950/20 border border-green-800/30 rounded-lg p-3">
                                <p>
                                    Use Error Boundaries or{" "}
                                    <code className="font-mono">promise.catch()</code> to handle
                                    rejected Promises and display user‑friendly errors.
                                </p>
                            </div>
                            <div className="bg-green-950/20 border border-green-800/30 rounded-lg p-3">
                                <p>
                                    Prefer creating Promises in Server Components and passing them
                                    down so they stay stable across re-renders.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Don'ts */}
                    <div>
                        <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                            <span>✕</span> Avoid this
                        </h4>
                        <div className="space-y-3 text-sm text-zinc-300">
                            <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3">
                                <p>
                                    Do not call{" "}
                                    <code className="text-purple-300 font-mono">use()</code>{" "}
                                    outside a Component/Hook function or inside try‑catch blocks;
                                    errors are surfaced through Error Boundaries or resolved via{" "}
                                    <code className="font-mono">catch</code>.
                                </p>
                            </div>
                            <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3">
                                <p>
                                    Do not treat{" "}
                                    <code className="text-purple-300 font-mono">use()</code> as a
                                    replacement for <code className="font-mono">fetch</code> or
                                    Axios—it reads resources, it does not perform HTTP requests.
                                </p>
                            </div>
                            <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3">
                                <p>
                                    When fetching in a Server Component, do not overuse{" "}
                                    <code className="text-purple-300 font-mono">use()</code> where{" "}
                                    <code className="font-mono">async/await</code> is simpler;
                                    awaiting directly often keeps code clearer.
                                </p>
                            </div>
                            <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3">
                                <p>
                                    Do not rely on it alone for caching or invalidation—pair it
                                    with higher‑level data libraries where needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Key takeaways</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-black/40 rounded-lg p-4 border border-zinc-800">
                        <div className="text-3xl mb-2">⚡</div>
                        <h4 className="font-semibold text-white mb-2">Simpler data use</h4>
                        <p className="text-zinc-300">
                            Lets components read async data directly from Promises and
                            contexts instead of wiring manual loading state.
                        </p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-zinc-800">
                        <div className="text-3xl mb-2">🎯</div>
                        <h4 className="font-semibold text-white mb-2">
                            Suspense + errors built‑in
                        </h4>
                        <p className="text-zinc-300">
                            Pending Promises show Suspense fallbacks; rejections flow to Error
                            Boundaries or custom <code className="font-mono">catch</code>{" "}
                            handlers.
                        </p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-zinc-800">
                        <div className="text-3xl mb-2">🚀</div>
                        <h4 className="font-semibold text-white mb-2">Future‑ready</h4>
                        <p className="text-zinc-300">
                            Designed for React 19, Server Components, and streaming apps, and
                            complements—rather than replaces—your existing fetching tools.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes draw-smooth {
          from {
            stroke-dashoffset: 120;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-smooth {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: draw-smooth 0.6s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1.4s ease-in-out infinite;
        }
        @keyframes pulse-circle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.6);
          }
        }
        .animate-pulse-circle {
          animation: pulse-circle 1.2s ease-in-out infinite;
        }
        @keyframes ping-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .animate-ping-ring {
          animation: ping-ring 1s ease-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
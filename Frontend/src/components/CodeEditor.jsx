import { useEffect, useState } from "react";

const lines = [
  "// Welcome to CodeForge 🚀",
  "",
  "const skills = [",
  '  "Interview Skills",',
  '  "DSA Skills",',
  '  "Problem Solving",',
  '  "Coding Confidence"',
  "];",
  "",
  "function forgeFuture() {",
  '  return "Keep Coding 🚀";',
  "}",
  "",
  "forgeFuture();",
];

export default function CodeEditor() {
  const [displayedCode, setDisplayedCode] = useState("");

 useEffect(() => {
  const fullCode = lines.join("\n");

  let index = 0;
  let direction = "typing";
  let timeoutId;

  const animate = () => {
    if (direction === "typing") {
      setDisplayedCode(fullCode.slice(0, index));
      index++;

      if (index > fullCode.length) {
        direction = "deleting";
        timeoutId = setTimeout(animate, 2000); // Pause when complete
        return;
      }

      timeoutId = setTimeout(animate, 35);
    } else {
      setDisplayedCode(fullCode.slice(0, index));
      index--;

      if (index < 0) {
        direction = "typing";
        index = 0;
        timeoutId = setTimeout(animate, 800); // Pause before typing again
        return;
      }

      timeoutId = setTimeout(animate, 15);
    }
  };

  animate();

  return () => clearTimeout(timeoutId);
}, []);

  return (
    <div className="relative w-full max-w-xl">

      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-violet-600/20 blur-3xl" />

      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#0D1117] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 bg-[#161B22] px-5 py-4">

          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          <span className="text-sm text-gray-400">
            welcome.js
          </span>

          <div className="w-12"></div>

        </div>

        {/* Code */}
        <pre className="overflow-x-auto p-8 font-mono text-[16px] leading-8 text-gray-200">
          <code>
            {displayedCode}
            <span className="animate-pulse text-violet-400">|</span>
          </code>
        </pre>

      </div>
    </div>
  );
}
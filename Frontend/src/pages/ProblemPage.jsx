import { Editor } from "@monaco-editor/react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Play,
  Send,
  TimerReset,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosClient } from "../config/axiosClient";

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const normalizeTags = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [String(value)];
};

const formatDifficulty = (value) => {
  if (!value) return "Easy";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("Console output will appear here...");
  const [resultSummary, setResultSummary] = useState({
    status: "",
    totalTestCases: 0,
    passedTestCases: 0,
    failedTestCases: 0,
    runtime: 0,
    memory: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/problems/${id}`);
        setProblem(data);

        const firstLanguage =
          data?.startCode?.find((item) => item?.language)?.language ||
          "javascript";
        const normalizedLanguage = String(firstLanguage).toLowerCase();
        setSelectedLanguage(normalizedLanguage);

        const starter =
          data?.startCode?.find(
            (item) =>
              String(item?.language).toLowerCase() === normalizedLanguage,
          )?.initialCode || "";
        setCode(starter);
      } catch (error) {
        setOutput(
          `Error: ${error.response?.data?.message || error.message || "Could not load problem"}`,
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProblem();
  }, [id]);

  useEffect(() => {
    if (!problem || !selectedLanguage || !editorRef.current) return;

    const starter =
      problem.startCode?.find(
        (item) => String(item?.language).toLowerCase() === selectedLanguage,
      )?.initialCode || "";

    editorRef.current.setValue(starter);
  }, [problem, selectedLanguage]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    if (code) {
      editor.setValue(code);
    }
    editor.focus();
  };

  const getResultSummary = (payload) => {
    const details = payload?.details || payload || {};
    const total = details.totalTestCases ?? details.total ?? 0;
    const passed = details.passedTestCases ?? details.passed ?? 0;
    const failed = details.failedTestCases ?? details.failed ?? 0;

    return {
      status: details.status || payload?.message || "Pending",
      totalTestCases: total,
      passedTestCases: passed,
      failedTestCases: failed,
      runtime: details.runtime ?? 0,
      memory: details.memory ?? 0,
    };
  };

  const formatResultOutput = (payload) => {
    if (!payload) return "No output";

    const details = payload?.details || payload;
    if (details && typeof details === "object") {
      const summary = getResultSummary(payload);
      const lines = [
        `Status: ${summary.status}`,
        `Passed: ${summary.passedTestCases}/${summary.totalTestCases}`,
        `Failed: ${summary.failedTestCases}`,
        `Runtime: ${summary.runtime} ms`,
        `Memory: ${summary.memory.toFixed(2)} MB`,
        "",
        JSON.stringify(details, null, 2),
      ];
      return lines.join("\n");
    }

    if (typeof payload === "string") {
      return payload;
    }

    return JSON.stringify(payload, null, 2);
  };

  const runCode = async () => {
    if (!id) return;

    const currentCode = editorRef.current?.getValue() || code;
    if (!currentCode.trim()) {
      setOutput("Error: Please write code before running.");
      return;
    }

    setIsRunning(true);
    try {
      const { data } = await axiosClient.post(`/submissions/run/${id}`, {
        language: selectedLanguage,
        code: currentCode,
      });
      setResultSummary(getResultSummary(data));
      setOutput(formatResultOutput(data));
    } catch (error) {
      const payload = error.response?.data;
      setResultSummary(getResultSummary(payload));
      setOutput(formatResultOutput(payload || error.message || "Run failed"));
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!id) return;

    const currentCode = editorRef.current?.getValue() || code;
    if (!currentCode.trim()) {
      setOutput("Error: Please write code before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axiosClient.post(`/submissions/submit/${id}`, {
        language: selectedLanguage,
        code: currentCode,
      });
      setResultSummary(getResultSummary(data));
      setOutput(formatResultOutput(data));
    } catch (error) {
      const payload = error.response?.data;
      setResultSummary(getResultSummary(payload));
      setOutput(
        formatResultOutput(payload || error.message || "Submission failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        code || editorRef.current?.getValue() || "",
      );
      setOutput("Code copied to clipboard.");
    } catch {
      setOutput("Unable to copy code right now.");
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!id) return;

      try {
        const { data } = await axiosClient.get(`/problems/${id}/submissions`);
        setSubmissions(data || []);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
    };

    fetchSubmissions();
  }, [id]);

  const tags = normalizeTags(problem?.tags);
  const exampleCases = Array.isArray(problem?.visibleTestCases)
    ? problem.visibleTestCases
    : [];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              CodeForge
            </p>
            <h1 className="text-lg font-semibold">Problem</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
            {problem ? formatDifficulty(problem.difficulty) : "Easy"}
          </span>
        </div>
      </header>

      <div className="grid h-[calc(100vh-69px)] grid-cols-1 xl:grid-cols-[1.1fr_1.5fr]">
        <aside className="overflow-y-auto border-r border-slate-800 bg-[#0f172a]">
          <div className="border-b border-slate-800 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {problem?.title || "Loading problem..."}
              </h2>
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                {problem ? formatDifficulty(problem.difficulty) : "Easy"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs capitalize text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6 px-5 py-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Description
              </h3>
              <p className="leading-7 text-slate-300">
                {problem?.description || "Loading problem description..."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="mb-2 text-sm font-semibold text-white">
                Examples
              </h4>
              <div className="space-y-4 text-sm leading-6 text-slate-300">
                {exampleCases.length ? (
                  exampleCases.map((example, index) => (
                    <div
                      key={`${example.input}-${index}`}
                      className="rounded-lg border border-slate-700 bg-slate-950/80 p-3"
                    >
                      <p className="mb-1 text-slate-400">Example {index + 1}</p>
                      <pre className="whitespace-pre-wrap">
                        {`Input: ${example.input}\nOutput: ${example.output}\nExplanation: ${example.explanation}`}
                      </pre>
                    </div>
                  ))
                ) : (
                  <p>No example available.</p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex flex-col bg-[#0f172a]">
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-4 py-3">
            <div className="flex items-center gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 outline-none ring-0"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button
                type="button"
                onClick={() => setOutput("Ask AI: feature coming soon.")}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                Ask AI
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">
                Loading editor...
              </div>
            ) : (
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineNumbersMinChars: 3,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                }}
              />
            )}
          </div>

          <div className="border-t border-slate-800 bg-[#0b1120] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <TimerReset className="h-4 w-4 text-sky-400" />
              <span>
                Runtime:{" "}
                {resultSummary.runtime ? `${resultSummary.runtime} ms` : "-"}
              </span>
              <span className="text-slate-600">•</span>
              <span>
                Memory:{" "}
                {resultSummary.memory
                  ? `${resultSummary.memory.toFixed(2)} MB`
                  : "-"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Console</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ready
                </span>
              </div>
              <pre className="min-h-20 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                {output}
              </pre>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                type="button"
                onClick={submitCode}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Recent Submissions
              </h4>

              {submissions.length ? (
                <div className="space-y-2">
                  {submissions.map((submission) => (
                    <div
                      key={submission._id}
                      className="rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-300"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-medium text-white">
                          {submission.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {submission.language || "javascript"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {submission.testCasePassed ?? 0}/
                        {submission.totalTestCases ?? 0} test cases passed
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No submissions yet for this problem.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

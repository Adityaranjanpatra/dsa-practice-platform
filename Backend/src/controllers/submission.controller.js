const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { submitProblem, getSolution } = require("../utils/problemUtil");

function normalizeOutput(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { language, code } = req.body;

    if (!userId || !problemId || !language || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const problem = await Problem.findById(problemId);
    const submittedCode = await Submission.create({
      userId,
      problemId,
      language,
      code,
      status: "Pending",
      testCasePassed: 0,
      totalTestCases: problem.hiddenTestCases.length,
    });

    let maxRuntime = 0;
    let maxMemory = 0;
    let passedTestCases = 0;
    let failedCases = [];
    let results = [];

    for (const { input, output } of problem.hiddenTestCases) {
      const id = await submitProblem(language, code, input);
      if (!id) {
        return res.status(400).json({ message: "Error submitting code" });
      }

      const sol = await getSolution(id);
      const actualOutput = normalizeOutput(sol?.output?.stdout);
      const expectedOutput = normalizeOutput(output);
      const verdict = sol?.result?.verdict;
      const runtimeMs = Number(sol?.metrics?.cpu_time_secs || 0) * 1000;
      const memoryMb =
        Number(sol?.metrics?.memory_peak_bytes || 0) / (1024 * 1024);
      maxRuntime = Math.max(maxRuntime, runtimeMs);
      maxMemory = Math.max(maxMemory, memoryMb);

      const testResult = {
        input,
        expectedOutput,
        actualOutput,
        verdict,
        runtime: runtimeMs,
        memory: memoryMb,
      };

      if (verdict !== "AC") {
        submittedCode.status =
          verdict === "RE"
            ? "Runtime Error"
            : verdict === "TLE"
              ? "Time Limit Exceeded"
              : "Compilation Error";
        submittedCode.errorMessage = submittedCode.status;
        await submittedCode.save();
        failedCases.push({ ...testResult, status: submittedCode.status });
        return res.status(400).json({
          message: submittedCode.status,
          details: {
            status: submittedCode.status,
            totalTestCases: problem.hiddenTestCases.length,
            passedTestCases,
            failedTestCases: failedCases.length,
            runtime: maxRuntime,
            memory: maxMemory,
            failedCases,
            results,
          },
        });
      }

      if (actualOutput !== expectedOutput) {
        submittedCode.status = "Wrong Answer";
        submittedCode.errorMessage = "Wrong Answer";
        await submittedCode.save();
        failedCases.push({ ...testResult, status: "Wrong Answer" });
        return res.status(400).json({
          message: "Wrong Answer",
          details: {
            status: "Wrong Answer",
            totalTestCases: problem.hiddenTestCases.length,
            passedTestCases,
            failedTestCases: failedCases.length,
            runtime: maxRuntime,
            memory: maxMemory,
            failedCases,
            results,
          },
        });
      }

      passedTestCases += 1;
      submittedCode.testCasePassed += 1;
      submittedCode.runtime += runtimeMs;
      submittedCode.memory = maxMemory;
      results.push({
        input,
        expectedOutput,
        actualOutput,
        verdict: "AC",
        runtime: runtimeMs,
        memory: memoryMb,
      });
    }

    submittedCode.status = "Accepted";
    submittedCode.memory = maxMemory;
    await submittedCode.save();

    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    return res.status(200).json({
      message: "Accepted",
      details: {
        status: "Accepted",
        totalTestCases: submittedCode.totalTestCases,
        passedTestCases,
        failedTestCases: 0,
        runtime: maxRuntime,
        memory: maxMemory,
        results,
        failedCases: [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const runCode = async (req, res) => {
  try {
    const problemId = req.params.id;
    const { language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const problem = await Problem.findById(problemId);
    let passedTestCases = 0;
    let failedCases = [];
    let results = [];
    let maxRuntime = 0;
    let maxMemory = 0;

    for (const { input, output } of problem.visibleTestCases) {
      const id = await submitProblem(language, code, input);
      if (!id) {
        return res.status(400).json({ message: "Error submitting code" });
      }

      const sol = await getSolution(id);
      const actualOutput = normalizeOutput(sol?.output?.stdout);
      const expectedOutput = normalizeOutput(output);
      const verdict = sol?.result?.verdict;
      const runtimeMs = Number(sol?.metrics?.cpu_time_secs || 0) * 1000;
      const memoryMb =
        Number(sol?.metrics?.memory_peak_bytes || 0) / (1024 * 1024);

      maxRuntime = Math.max(maxRuntime, runtimeMs);
      maxMemory = Math.max(maxMemory, memoryMb);

      const testResult = {
        input,
        expectedOutput,
        actualOutput,
        verdict,
        runtime: runtimeMs,
        memory: memoryMb,
      };

      if (verdict !== "AC") {
        failedCases.push({
          ...testResult,
          status:
            verdict === "RE"
              ? "Runtime Error"
              : verdict === "TLE"
                ? "Time Limit Exceeded"
                : "Compilation Error",
        });
        return res.status(400).json({
          message: failedCases[failedCases.length - 1].status,
          details: {
            status: failedCases[failedCases.length - 1].status,
            totalTestCases: problem.visibleTestCases.length,
            passedTestCases,
            failedTestCases: failedCases.length,
            runtime: maxRuntime,
            memory: maxMemory,
            failedCases,
            results,
          },
        });
      }

      if (actualOutput !== expectedOutput) {
        failedCases.push({
          ...testResult,
          status: "Wrong Answer",
        });
        return res.status(200).json({
          message: "Wrong Answer",
          details: {
            status: "Wrong Answer",
            totalTestCases: problem.visibleTestCases.length,
            passedTestCases,
            failedTestCases: failedCases.length,
            runtime: maxRuntime,
            memory: maxMemory,
            failedCases,
            results,
          },
        });
      }

      passedTestCases += 1;
      results.push({
        input,
        expectedOutput,
        actualOutput,
        verdict: "AC",
        runtime: runtimeMs,
        memory: memoryMb,
      });
    }

    return res.status(200).json({
      message: "Accepted",
      details: {
        status: "Accepted",
        totalTestCases: problem.visibleTestCases.length,
        passedTestCases,
        failedTestCases: 0,
        runtime: maxRuntime,
        memory: maxMemory,
        results,
        failedCases: [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { submitCode, runCode };

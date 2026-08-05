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
    let memory = 0;
    for (const { input, output } of problem.hiddenTestCases) {
      const id = await submitProblem(language, code, input);
      if (!id) {
        return res.status(400).json({ message: "Error submitting code" });
      }
      const sol = await getSolution(id);
      if (sol?.result?.verdict !== "AC") {
        if (sol?.result?.verdict === "RE") {
          submittedCode.status = "Runtime Error";
          submittedCode.errorMessage = "Runtime Error";
          await submittedCode.save();
          return res.status(400).json({ message: "Runtime Error" });
        } else if (sol?.result?.verdict === "TLE") {
          submittedCode.status = "Time Limit Exceeded";
          submittedCode.errorMessage = "Time Limit Exceeded";
          await submittedCode.save();
          return res.status(400).json({ message: "Time Limit Exceeded" });
        }

        submittedCode.status = "Compilation Error";
        submittedCode.errorMessage = "Compilation Error";
        await submittedCode.save();
        return res.status(400).json({ message: submittedCode.errorMessage });
      }
      const actualOutput = normalizeOutput(sol?.output?.stdout);
      const expectedOutput = normalizeOutput(output);
      if (actualOutput !== expectedOutput) {
        submittedCode.status = "Wrong Answer";
        submittedCode.errorMessage = "Wrong Answer";
        await submittedCode.save();
        return res.status(400).json({ message: "Wrong Answer" });
      }
      submittedCode.testCasePassed += 1;
      submittedCode.runtime += sol?.metrics?.cpu_time_secs;
      memory = Math.max(memory, sol?.metrics?.memory_peak_bytes);
    }
    submittedCode.status = "Accepted";
    submittedCode.memory = memory / (1024 * 1024); // Convert bytes to MB
    await submittedCode.save();
    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }
    return res.status(200).json({ message: "Code submitted successfully" });
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
    let accepted=[]
    for (const { input, output } of problem.visibleTestCases) {
      const id = await submitProblem(language, code, input);
      if (!id) {
        return res.status(400).json({ message: "Error submitting code" });
      }
      const sol = await getSolution(id);
      if (sol?.result?.verdict !== "AC") {
        if (sol?.result?.verdict === "RE") {
          return res.status(400).json({ message: "Runtime Error" });
        } else if (sol?.result?.verdict === "TLE") {
          return res.status(400).json({ message: "Time Limit Exceeded" });
        }
        return res.status(400).json({ message: "Compilation Error" });
      }
      const actualOutput = normalizeOutput(sol?.output?.stdout);
      const expectedOutput = normalizeOutput(output);
      if (actualOutput !== expectedOutput) {
        accepted.push({
        message: "Wrong Answer",
        input,
        expectedOutput,
        actualOutput,
      })
      }else{
        accepted.push({
        message: "accepted",
        input,
        expectedOutput,
        actualOutput,
      })
      }
      
      
    }
    return res.status(200).json({
      message: "accepted",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { submitCode, runCode };



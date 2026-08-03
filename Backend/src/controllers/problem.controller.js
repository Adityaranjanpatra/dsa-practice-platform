const { submitProblem, getSolution } = require("../utils/problemUtil");

const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");

function normalizeOutput(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}


const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      if (!language || !completeCode) {
        return res
          .status(400)
          .send("Reference solution must have both language and completeCode");
      }
      for (const { input, output } of visibleTestCases) {
        if (!input || !output) {
          return res
            .status(400)
            .send("Visible test cases must have both input and output");
        }

        const id = await submitProblem(language, completeCode, input);

        if (!id) {
          return res.status(400).send("Error submitting problem");
        }
        console.log(id);

        const sol = await getSolution(id);
        if (sol?.result?.verdict !== "AC") {
          return res
            .status(400)
            .send(
              `Reference solution failed for visible test case with input: ${input} and output: ${output}`,
            );
        }

        const actualOutput = normalizeOutput(sol?.output?.stdout);
        const expectedOutput = normalizeOutput(output);
        if (actualOutput !== expectedOutput) {
          return res
            .status(400)
            .send(
              `Reference solution output does not match expected output for visible test case with input: ${input} and output: ${output}`,
            );
        }
      }
    }

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res.status(201).send(userProblem);
  } catch (err) {
    console.error("Error creating problem:", err);
    res.status(400).send(err.message);
  }
};

const updateProblem =async (req,res)=>{
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  const problemId =req.params.id;

  if(!problemId){
    return res.status(400).send("Problem ID is required");
  }
  try{
     for (const { language, completeCode } of referenceSolution) {
      if (!language || !completeCode) {
        return res
          .status(400)
          .send("Reference solution must have both language and completeCode");
      }
      for (const { input, output } of visibleTestCases) {
        if (!input || !output) {
          return res
            .status(400)
            .send("Visible test cases must have both input and output");
        }

        const id = await submitProblem(language, completeCode, input);

        if (!id) {
          return res.status(400).send("Error submitting problem");
        }

        const sol = await getSolution(id);
        if (sol?.result?.verdict !== "AC") {
          return res
            .status(400)
            .send(
              `Reference solution failed for visible test case with input: ${input} and output: ${output}`,
            );
        }

        const actualOutput = normalizeOutput(sol?.output?.stdout);
        const expectedOutput = normalizeOutput(output);
        if (actualOutput !== expectedOutput) {
          return res
            .status(400)
            .send(
              `Reference solution output does not match expected output for visible test case with input: ${input} and output: ${output}`,
            );
        }
      }
    }

    const updatedProblem =await Problem.findByIdAndUpdate(problemId,req.body,{returnDocument: "after",runValidators:true});

    res.status(200).send("Problem updated successfully");
  }catch(err){
    return res.status(400).send(err.message);
  }
}

const deleteProblem=async (req,res)=>{
  const problemId =req.params.id;

  if(!problemId){
    return res.status(400).send("Problem ID is required");
  }

  try {
    const deletedProblem = await Problem.findByIdAndDelete(problemId);

    if (!deletedProblem) {
      return res.status(404).send("Problem not found");
    }

    res.status(200).send("Problem deleted successfully");
  } catch (err) {
    return res.status(400).send(err.message);
    
  }
}

const fetchProblem=async (req, res) => {
  const problemId = req.params.id;

  if (!problemId) {
    return res.status(400).send("Problem ID is required");
  }
  try{
    const problem = await Problem.findById(problemId).select("_id title description difficulty tags  startCode referenceSolution");
    if (!problem) {
      return res.status(404).send("Problem not found");
    }
    res.status(200).send(problem);
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

const fetchSubmissions = async (req, res) => {
  try {
    const problemId = req.params.id;
    if (!problemId) {
      return res.status(400).send("Problem ID is required");
    }
    const userId= req.result._id;
    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const submissions= await Submission.find({userId,problemId}).select("_id language code runtime memory status errorMessage");

    res.status(200).send(submissions);
  } catch (err) 
  {
    return res.status(400).send(err.message);  
  }
}

const fetchAllProblem=async (req, res) => {
  try{
    const problem= await Problem.find({}).select("_id title difficulty tags");
    res.status(200).send(problem);
  }catch(err){
    return res.status(400).send(err.message);
  }
}

module.exports = { createProblem, updateProblem, deleteProblem, fetchProblem, fetchAllProblem ,fetchSubmissions};

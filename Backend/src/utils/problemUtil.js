const axios = require("axios");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function submitProblem(language, code, input) {
  try {
    const response = await axios.post(
      "https://api.rustbox.sh/api/submit?wait=true",
      {
        language,
        code,
        stdin: input,
      },
      {
        headers: {
          "X-API-Key": process.env.RUSTBOX_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.id;
  } catch (err) {
    console.error("Error submitting problem:", err);
    throw new Error(`Error submitting problem: ${err.message}`);
  }
}

async function getSolution(id, maxPolls = 12, intervalMs = 500) {
  try {
    let lastResult = null;

    for (let attempt = 0; attempt < maxPolls; attempt++) {
      const response = await axios.get(
        `https://api.rustbox.sh/api/result/${id}`,
        {
          headers: {
            "X-API-Key": process.env.RUSTBOX_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      lastResult = response.data;
      if (lastResult?.output?.integrity === "complete") {
        return lastResult;
      }

      await delay(intervalMs);
    }

    return lastResult;
  } catch (err) {
    throw new Error(`Error getting solution: ${err.message}`);
  }
}

module.exports = { submitProblem, getSolution };

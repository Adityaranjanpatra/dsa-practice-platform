import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProblemCard from "../components/ProblemCard";
import { axiosClient } from "../config/axiosClient";

function Problem() {
  const user = useSelector((state) => state.auth.data);

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filter, setFilter] = useState({
    problemType: "all",
    difficulty: "all",
    tags: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("problems/");
        setProblems(response.data);
      } catch (err) {
        setError(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("user/solvedProblems");
        setSolvedProblems(response.data?.solved);
      } catch (err) {
        setError(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleFilterChange = (updates) => {
    setFilter((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filter.difficulty === "all" || problem.difficulty === filter.difficulty;
    const tagsMatch =
      filter.tags === "all" || problem.tags.includes(filter.tags);
    const problemTypeMatch =
      filter.problemType === "all" ||
      solvedProblems.some((solvedProblem) => solvedProblem._id === problem._id);
    return difficultyMatch && tagsMatch && problemTypeMatch;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProblems.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProblems = filteredProblems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <section className="bg-[#0B1120] text-white min-h-screen pt-35 pl-35">
      <div>
        <h1 className="font-bold text-xl tracking-wide">All Problems</h1>
        <span className="text-sm text-zinc-400 tracking-wide">
          Solve problems to improve your coding skills
        </span>
      </div>
      <div className="relative flex mt-5 justify-between w-[80vw] min-w-193 border border-zinc-500 py-3 px-5 rounded-lg bg-[#1A202E]">
        <div className="flex flex-col gap-2.5">
          <h2>Filter by Problems</h2>
          <div className="flex gap-3">
            <button
              type="button"
              className={`border w-10 rounded-lg flex justify-center items-center cursor-pointer ${filter.problemType === "all" ? "bg-blue-500" : "bg-transparent"}`}
              onClick={() => handleFilterChange({ problemType: "all" })}
            >
              All
            </button>
            <button
              type="button"
              className={`border w-20 rounded-lg flex justify-center items-center cursor-pointer ${filter.problemType === "solved" ? "bg-blue-500" : "bg-transparent"}`}
              onClick={() => handleFilterChange({ problemType: "solved" })}
            >
              Solved
            </button>
          </div>
        </div>

        <div className="min-w-15  mt-9 bg-gray-500 rotate-90 h-0.5"></div>

        <div className="flex flex-col gap-2.5">
          <h2>Filter by Difficulty</h2>
          <div className="flex gap-3">
            <div
              className={`border w-10 rounded-lg flex justify-center items-center cursor-pointer ${filter.difficulty === "all" ? "bg-blue-500" : "bg-transparent"}`}
              onClick={() => handleFilterChange({ difficulty: "all" })}
            >
              All
            </div>
            <div
              className={`border border-emerald-500/35 bg-emerald-500/14 text-emerald-300 w-15 rounded-lg flex justify-center items-center cursor-pointer ${filter.difficulty === "easy" ? "bg-emerald-500" : "bg-transparent"}`}
              onClick={() => handleFilterChange({ difficulty: "easy" })}
            >
              Easy
            </div>
            <div
              className={`border border-amber-500/35 bg-amber-500/14 text-amber-300 w-20 rounded-lg flex justify-center items-center cursor-pointer ${filter.difficulty === "medium" ? "bg-amber-500" : "bg-transparent"}`}
              onClick={() => handleFilterChange({ difficulty: "medium" })}
            >
              Medium
            </div>
            <div
              className={`border border-rose-500/35 bg-rose-500/14 text-rose-300 w-15 rounded-lg flex justify-center items-center cursor-pointer ${filter.difficulty === "hard" ? "bg-rose-500" : "bg-transparent"}`}
              onClick={() => handleFilterChange({ difficulty: "hard" })}
            >
              Hard
            </div>
          </div>
        </div>

        <div className="min-w-15  mt-9 bg-gray-500 rotate-90 h-0.5"></div>

        <div className="flex flex-col gap-2.5">
          <h2>Filter by Tags</h2>
          <select
            className="bg-[#1A202E] text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500  rounded-lg p-2"
            value={filter.tags}
            onChange={(e) => handleFilterChange({ tags: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="string">String</option>
            <option value="math">math</option>
            <option value="dynamic programming">Dynamic Programming</option>
            <option value="graph">Graph</option>
            |<option value="linked list">Linked List</option>
            <option value="tree">Tree</option>
            <option value="sorting">Sorting</option>
            <option value="binary search">Binary Search</option>
            <option value="backtracking">Backtracking</option>
            <option value="two pointers">Two Pointers</option>
            <option value="bit manipulation">Bit Manipulation</option>
            <option value="hash table">Hash Table</option>
            <option value="heap">Heap</option>
            <option value="matrix">Matrix</option>
          </select>
        </div>
      </div>

      <div className="mt-2 p-5 flex flex-col w-[80vw] min-w-193">
        <div className="grid grid-cols-5 gap-7 text-zinc-400 text-sm font-semibold border border-zinc-500 py-3 px-5 rounded-tl-lg rounded-tr-lg bg-[#1A202E]">
          <h1>#</h1>
          <h1>Problem</h1>
          <h1>Difficulty</h1>
          <h1>Tags</h1>
          <h1>Status</h1>
        </div>
        {filteredProblems.length === 0 ? (
          <div className="border border-zinc-800 p-4 text-center text-zinc-400 bg-[#0f1726]">
            No problems found.
          </div>):(<div>
          {paginatedProblems.map((problem, index) => {
            const isSolved = solvedProblems.some( 
              (solvedProblem) => solvedProblem._id === problem._id,
            );
            return (
              <ProblemCard
                key={problem._id}
                problem={problem}
                index={startIndex + index}
                isSolved={isSolved}
              />
            );
          })}
        </div>)}

        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-zinc-700 bg-[#111827] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-400">
            Showing {filteredProblems.length === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredProblems.length)} of{" "}
            {filteredProblems.length} problems
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            {getVisiblePages().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-zinc-500"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg border text-sm transition ${
                    currentPage === page
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Problem;

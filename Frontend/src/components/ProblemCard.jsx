import { NavLink } from "react-router";

function ProblemCard({ problem, index, isSolved = false }) {
  const difficulty = (problem.difficulty || "").toLowerCase();

  const difficultyBadgeClass =
    difficulty === "easy"
      ? "border border-emerald-500/35 bg-emerald-500/14 text-emerald-300"
      : difficulty === "medium"
        ? "border border-amber-500/35 bg-amber-500/14 text-amber-300"
        : difficulty === "hard"
          ? "border border-rose-500/35 bg-rose-500/14 text-rose-300"
          : "border border-zinc-500/40 bg-zinc-500/10 text-zinc-300";

  const statusBadgeClass = isSolved
    ? "border border-emerald-500/35 bg-emerald-500/14 text-emerald-300"
    : "border border-zinc-500/40 bg-zinc-500/10 text-zinc-300";

  return (
    <div className="border border-zinc-800 p-4 grid grid-cols-5 gap-7 text-zinc-300 text-sm font-semibold bg-[#0f1726]">
      <h2>{index + 1}</h2>
      <NavLink to={`/problems/${problem._id}`}>
        <p className="text-zinc-100">{problem.title}</p>
      </NavLink>

      <div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${difficultyBadgeClass}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="inline-flex items-center rounded-md border border-indigo-500/20 bg-indigo-500/14 px-2.5 py-1 text-xs font-medium w-fit text-indigo-200">
        {problem.tags}
      </div>

      <div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass}`}
        >
          {isSolved ? "Solved" : "Unsolved"}
        </span>
      </div>
    </div>
  );
}

export default ProblemCard;

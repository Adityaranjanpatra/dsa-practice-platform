import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { axiosClient } from "../config/axiosClient";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum([
    "array",
    "string",
    "dynamic programming",
    "graph",
    "tree",
    "math",
    "linked list",
    "sorting",
    "binary search",
    "backtracking",
    "two pointers",
    "bit manipulation",
    "hash table",
    "heap",
    "matrix",
  ]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      }),
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one hidden test case required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      }),
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      }),
    )
    .length(3, "All three languages required"),
});

const defaultValues = {
  title: "",
  description: "",
  difficulty: "easy",
  tags: "array",
  visibleTestCases: [{ input: "", output: "", explanation: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
  startCode: [
    { language: "cpp", initialCode: "" },
    { language: "java", initialCode: "" },
    { language: "javascript", initialCode: "" },
  ],
  referenceSolution: [
    { language: "cpp", completeCode: "" },
    { language: "java", completeCode: "" },
    { language: "javascript", completeCode: "" },
  ],
};

function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues,
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problems/${id}`);
        const problem = response.data;

        reset({
          title: problem.title ?? "",
          description: problem.description ?? "",
          difficulty: problem.difficulty ?? "easy",
          tags: problem.tags ?? "array",
          visibleTestCases:
            problem.visibleTestCases?.length > 0
              ? problem.visibleTestCases
              : [{ input: "", output: "", explanation: "" }],
          hiddenTestCases:
            problem.hiddenTestCases?.length > 0
              ? problem.hiddenTestCases
              : [{ input: "", output: "" }],
          startCode:
            problem.startCode?.length > 0
              ? problem.startCode
              : defaultValues.startCode,
          referenceSolution:
            problem.referenceSolution?.length > 0
              ? problem.referenceSolution
              : defaultValues.referenceSolution,
        });
      } catch (error) {
        alert(`Error: ${error.response?.data?.message || error.message}`);
        navigate("/admin/update");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setUpdating(true);
      await axiosClient.patch(`/problems/${id}`, data);
      alert("Problem updated successfully!");
      navigate("/admin/update");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 pt-40">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-40">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register("title")}
                className={`input input-bordered ${errors.title && "input-error"}`}
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register("description")}
                className={`textarea textarea-bordered h-32 ${errors.description && "textarea-error"}`}
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register("difficulty")}
                  className={`select select-bordered ${errors.difficulty && "select-error"}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Tag</span>
                </label>
                <select
                  {...register("tags")}
                  className={`select select-bordered ${errors.tags && "select-error"}`}
                >
                  <option value="array">Array</option>
                  <option value="string">String</option>
                  <option value="math">Math</option>
                  <option value="dynamic programming">
                    Dynamic Programming
                  </option>
                  <option value="graph">Graph</option>
                  <option value="linked list">Linked List</option>
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
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() =>
                  appendVisible({ input: "", output: "", explanation: "" })
                }
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>

            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>

                <input
                  {...register(`visibleTestCases[${index}].input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(`visibleTestCases[${index}].output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />

                <textarea
                  {...register(`visibleTestCases[${index}].explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: "", output: "" })}
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>

            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>

                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>

          <div className="space-y-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">
                  {index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"}
                </h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference Solution</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Problem"}
        </button>
      </form>
    </div>
  );
}

export default UpdatePage;

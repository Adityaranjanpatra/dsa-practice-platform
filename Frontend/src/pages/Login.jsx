import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import z from "zod";
import { loginUser } from "../slice/authslice";

function Login() {
  const loginSchema = z.object({
    emailId: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const dispatch = useDispatch();

  const { isLoading } = useSelector((State) => State.auth);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="flex min-h-screen justify-center items-center ">
      <form
        className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4 flex flex-col items-center gap-8 min-h-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <legend className="fieldset-legend flex justify-center w-full h-25 text-[24px] font-bold">
          Login
        </legend>

        <div className="text-lg font-semibold gap-2.5 flex flex-col w-full  items-center">
          <div className="flex flex-col gap-2.5 w-full items-center">
            <label className="label">Email</label>
            <input
              type="email"
              className={`input ${errors.emailId && "input-error"}`}
              placeholder="Enter Email"
              {...register("emailId")}
            />
            {errors.emailId && (
              <div role="alert" className="alert alert-error alert-soft">
                <span>{errors.emailId.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-full items-center">
            <label className="label">Password</label>
            <input
              type="password"
              className={`input ${errors.password && "input-error"}`}
              placeholder="Enter Password"
              {...register("password")}
            />
            {errors.password && (
              <div role="alert" className="alert alert-error alert-soft">
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary mt-6 w-50 "
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="text-lg">
          Don't have an account?{" "}
          <span>
            <Link to="/signup" className="underline">
              Signup
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;

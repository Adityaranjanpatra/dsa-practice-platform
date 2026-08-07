import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { registerUser } from "../slice/authslice";
import { useSelector } from "react-redux";

function Signup() {
  const signupSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Name should be at least 2 characters long" }),
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
  } = useForm({ resolver: zodResolver(signupSchema) });

  const dispatch = useDispatch();

  const { isLoading } = useSelector((State) => State.auth);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="flex min-h-screen justify-center items-center ">
      <form
        className="fieldset bg-base-200 border-base-300 rounded-box w-lg border p-4 flex flex-col items-center gap-8 min-h-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <legend className="fieldset-legend flex justify-center w-full h-25 text-3xl font-extrabold">
          Signup
        </legend>

        <div className="text-lg font-semibold gap-2.5 flex flex-col w-full  items-center">
          <div className="flex flex-col  gap-2.5 w-full items-center">
            <label className="label ">First Name</label>
            <input
              type="text"
              className={`input ${errors.firstName && "input-error"} text-xl font-normal` }
              placeholder="Enter First Name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <div role="alert" className="alert alert-error alert-soft">
                <span>{errors.firstName.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-full items-center">
            <label className="label">Email</label>
            <input
              type="email"
              className={`input ${errors.emailId && "input-error"} text-xl font-normal`}
              placeholder="Enter Email"
              {...register("emailId")}
            />
            {errors.email && (
              <div role="alert" className="alert alert-error alert-soft">
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-full items-center">
            <label className="label">Password</label>
            <input
              type="password"
              className={`input ${errors.password && "input-error"} text-xl font-normal`}
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
            className="btn btn-primary mt-6 w-100"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Creating account...
              </>
            ) : (
              "Signup"
            )}
          </button>
        </div>
         <div className="text-lg">Already have an account? <span><Link to="/login" className="underline">Login</Link></span></div>
      </form>
    </div>
  );
}

export default Signup;

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import z from "zod";
import { loginUser } from "../slice/authslice";
import { useState } from "react";


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

  const [showPass,setShowPass]=useState(false);

  const dispatch = useDispatch();


  const { isLoading, error,} = useSelector((State) => State.auth);




  const onSubmit = (credentials) => {
    dispatch(loginUser(credentials));

  };


  return (
    <div className="flex min-h-screen justify-center items-center ">
      
      <form
        className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4 flex flex-col items-center gap-8 min-h-100"
        onSubmit={handleSubmit(onSubmit)}
      >
       { error && (
                  <div role="alert" className="alert alert-error alert-soft">
                <span>{error}</span>
              </div>
        )}
        <legend className="fieldset-legend flex justify-center w-full h-25 text-3xl font-extrabold">
          Login
        </legend>

        <div className="text-lg font-semibold gap-2.5 flex flex-col w-full  items-center">
          <div className="flex flex-col gap-2.5 w-full items-center">
            <label className="label">Email</label>
            <input
              type="email"
              className={`input ${errors.emailId && "input-error"} text-lg font-normal` }
              placeholder="Enter Email"
              {...register("emailId")}
            />
            {errors.emailId && (
              <div role="alert" className="alert alert-error alert-soft">
                <span>{errors.emailId.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-full items-center relative">
            <label className="label">Password</label>
            <input
              type={showPass ? "text" : "password"}
              className={`input ${errors.password && "input-error"} text-lg font-normal`}
              placeholder="Enter Password"
              {...register("password")}
            />
            {showPass ? <svg onClick={()=>setShowPass(!showPass)} className="absolute top-6 right-2" width="64px" height="64px" viewBox="-6.72 -6.72 37.44 37.44" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="1.6799999999999997" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> : 
            <svg className="absolute top-6 right-2" onClick={()=>setShowPass(!showPass)} width="64px" height="64px" viewBox="-6.72 -6.72 37.44 37.44" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="1.6799999999999997" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="1.6799999999999997" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>}
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

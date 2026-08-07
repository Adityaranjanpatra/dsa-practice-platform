import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import CodeEditor from "../components/CodeEditor";






function Homepage() {



  return (
    <>
    <section className="min-h-screen bg-[#0B1120] text-white flex  ">
      <div className="mx-auto flex w-full max-w-7xl  items-center gap-16 px-6 py-20 mt-20">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          {/* Badge */}
          <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            🚀 Sharpen Your Coding Journey
          </span>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-7xl">
            Welcome to{" "}
            <span className="bg-linear-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              CodeForge
            </span>
          </h1>

          {/* Typing Animation */}
          <div className="mt-8 h-14 text-3xl font-semibold text-emerald-400 lg:text-4xl">
            <TypeAnimation
              sequence={[
                "Interview Skills",
                2000,
                "",
                500,
                "DSA Skills",
                2000,
                "",
                500,
                "Problem Solving Skills",
                2000,
                "",
                500,
                "Coding Confidence",
                2000,
              ]}
              speed={45}
              repeat={Infinity}
            />
          </div>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            Master Data Structures & Algorithms, solve coding challenges,
            and prepare for technical interviews through hands-on practice.
          </p>

          {/* Button */}
          <Link
            to="/problems"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Start Solving
            <ArrowRight size={18} />
          </Link>

          {/* Feature Chips */}
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300">
              ⚡ Practice Daily
            </span>

            <span className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300">
              📚 Learn DSA
            </span>

            <span className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300">
              🎯 Ace Interviews
            </span>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex flex-1 justify-center"
        >
          {/* Glow */}
          <div className="absolute h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />

          <CodeEditor/>
        </motion.div>
      </div>
    </section>
    </>
  )
}

export default Homepage

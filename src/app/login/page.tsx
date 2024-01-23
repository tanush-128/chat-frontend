"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    console.log(status);
  }, [status]);
  console.log(status);
  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <div className="flex flex-col w-full  justify-center items-center parent">
      <div className="py-4 font-bold text-xl">Welcome Back! Log in</div>
      <div className="flex flex-col gap-3">
        <input type="email" placeholder="Enter your Email Address" />
        <input type="password" placeholder="Password" />

        <button> Login</button>

        <button
          className="bg-white text-black flex  justify-center items-center p-1 gap-2 "
          onClick={() => signIn("google")}
        >
          {" "}
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="google-logo"
          />{" "}
          <span>Log in with Google</span>{" "}
        </button>
      </div>
      <div className="py-6">
        Not a member?{" "}
        <a href="/login" className="text-blue-600 font-bold">
          Sign Up
        </a>
      </div>
    </div>
  );
}

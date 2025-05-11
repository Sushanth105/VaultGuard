"use client";

import React from "react";
// import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [visible, setVisible] = React.useState(false);
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error");

  // useEffect(() => {
  //   if (error) {
  //     alert("User already exists. Please sign in with your credentials.");
  //     redirect("/signin");
  //   }
  // }, [error]);

  const session = useSession();
  if (session.status === "authenticated") {
    redirect("/");
  }

  const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
        email,
        password,
      });
    } catch (error) {
      console.error("Error signing in:", error);
      return;
    }
    redirect("/");
  };
  const div = (
    <div>
      <Link
        className="border border-gray-400 px-3 py-2 font-bold active:bg-gray-800 active:text-gray-100 rounded-3xl hover:bg-gray-400 hover:text-gray-900"
        href="/signup"
      >
        Sign Up
      </Link>
    </div>
  );
  return (
    <div>
      <Navbar slug={div} />
      <div className="h-[90vh] flex justify-center items-center">
        <div className="border-2 border-gray-400 px-10 py-10 rounded-3xl shadow-lg bg-gray-800">
          <h1 className="text-4xl font-bold text-center">Sign In</h1>
          <form className="flex flex-col gap-4 mt-4" action={login}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border-2 border-gray-400 px-3 py-2 rounded-3xl"
              autoComplete="email"
            />

            <div className="flex gap-3">
              <input
                type={visible ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="border-2 border-gray-400 px-3 py-2 rounded-3xl"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="text-gray-400 hover:text-gray-900"
              >
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="border border-gray-400 px-3 py-2 font-bold active:bg-gray-800 active:text-gray-100 rounded-3xl hover:bg-gray-400 hover:text-gray-900"
            >
              Sign In
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-4 justify-center items-center">
            <div className="mt-3">OR</div>
            <form action={() => signIn("google", { redirectTo: "/" })}>
              <button
                type="submit"
                className="font-bold border rounded-3xl px-3 py-2 cursor-pointer border-gray-400 active:bg-gray-800 active:text-gray-100 hover:bg-gray-400 hover:text-gray-900"
              >
                <Image
                  src="/google-icon.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="inline-block mr-2"
                />
                Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

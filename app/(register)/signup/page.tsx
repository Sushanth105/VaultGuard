"use client";
import React from "react";
import Navbar from "@/app/components/navbar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

const SignUp = () => {
  const [visible, setVisible] = React.useState(false);

  const session = useSession();
    if(session.status === "authenticated"){
      redirect("/")
    }

  const register = async (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      passwordRaw: formData.get("password") as string,
    }

    const response = await fetch("/api/storeUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const r = await response.json();
    if(!response.ok) {
      alert(r.message);
    }
    if(response.ok) {
      alert(r.message);
    }
    redirect("/signin");
  };

  const div = (
    <div>
      <Link
        className="border-1 border-gray-400 px-3 py-2 font-bold active:bg-gray-800 active:text-gray-100 rounded-3xl hover:bg-gray-400 hover:text-gray-900"
        href="/signin"
      >
        Sign In
      </Link>
    </div>
  );
  return (
    <div>
      <Navbar slug={div} />
      <div className="h-[90vh] flex justify-center items-center">
        <div className="border-2 border-gray-400 px-10 py-10 rounded-3xl shadow-lg bg-gray-800">
          <h1 className="text-4xl font-bold text-center">Sign Up</h1>
          <form className="flex flex-col gap-4 mt-4" action={register}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="border-2 border-gray-400 px-3 py-2 rounded-3xl"
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border-2 border-gray-400 px-3 py-2 rounded-3xl"
              autoComplete="email"
            />
            <div className="flex gap-3">
              <input
                type={visible ? 'text' : 'password'}
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
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

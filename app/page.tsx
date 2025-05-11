"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Eye, EyeOff, Edit2, Trash2, Copy } from "lucide-react";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [vis, setVis] = useState(false);
  const [evis, seteVis] = useState(false);
  const [copied, setCopied] = useState(false);
  const [data, setdata] = useState([]);
  const profileBg = useRef<HTMLDivElement>(null);
  const editBg = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const [editData, setEditData] = useState({
    _id: "",
    url: "",
    email: "",
    password: "",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/getData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.data?.user?.id,
        }),
      });
      if (!res.ok) {
        console.log("Error in fetching data");
      }
      const r = await res.json();
      setdata(r.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      redirect("/signin");
      return;
    }

    if (session.data?.user?.id) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const Spinner = () => {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-ping rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  };

  const copyToClipboard = async (text: string) => {
    // Try to copy using Clipboard API or fallback to document.execCommand
    try {
      await navigator.clipboard.writeText(text);
      // Show copied notification
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000); // Hide after 2 seconds
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDelete = (id: string) => async () => {
    try {
      const res = await fetch("/api/deleteData", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, userId: session.data?.user?.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData.message);
      } else {
        console.log("Data deleted successfully");
        getData();
      }
    } catch (error) {
      console.error("Network or server error while deleting data:", error);
    }
  };

  const handleEdit = async (e: FormData) => {
    const formData = {
      _id: editData._id,
      userId: session.data?.user?.id as string,
      url: editData.url,
      email: e.get("email") as string,
      password: e.get("password") as string,
    };
    if (!formData.email || !formData.password) {
      alert("The Field Should not be empty");
      return;
    }
    try{
      const res = await fetch("/api/updateData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if(res.ok){
        console.log("Edit Successfull");
        (editBg.current as HTMLDivElement).style.display = "none";
        document.body.style.overflow = "auto";
        getData();
        return
      }
      else{
        const err = await res.json();
        console.log(err.message);
      }
    }
    catch(err){
      if(err instanceof Error)
        console.log(err.message);
    }
  };

  const editDisplay = (data: {
    _id: string;
    url: string;
    email: string;
    password: string;
  }) => {
    return (
      <div
        key={data._id}
        className="flex justify-center items-center w-100 p-4"
      >
        <div className="bg-gradient-to-br from-gray-100 to-gray-900 rounded-2xl p-1 shadow-2xl w-full max-w-md">
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-5">
            {/* Header with URL */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-white truncate">
                {data.url}
              </h2>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

            <form className="flex flex-col gap-5" action={handleEdit}>
              {/* Email Section */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">EMAIL</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    defaultValue={data.email}
                    className="text-white outline-0 font-medium"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">PASSWORD</span>
                  <input
                    type={evis ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    defaultValue={data.password}
                    className="text-white outline-0 font-medium"
                  />
                </div>
                <div className="flex">
                  <button
                    className="p-1 text-gray-400 cursor-pointer hover:text-white rounded-full hover:bg-gray-800 transition-all"
                    onClick={() => seteVis(!evis)}
                  >
                    {evis ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="border-2 flex border-gray-400 w-fit rounded-3xl px-3 py-1 active:bg-gray-800 active:text-gray-100 hover:bg-gray-400 hover:text-gray-900"
                >
                  save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const display = (data: {
    _id: string;
    url: string;
    email: string;
    password: string;
  }) => {
    return (
      <div
        key={data._id}
        className="flex justify-center items-center w-full p-4"
      >
        <div className="bg-gradient-to-br from-gray-100 to-gray-900 rounded-2xl p-1 shadow-2xl w-full max-w-md">
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-4">
            {/* Header with URL */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-white truncate">
                {data.url}
              </h2>
              <div className="flex gap-2">
                <button
                  className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors"
                  onClick={() => {
                    const eBg = editBg.current as HTMLDivElement;
                    eBg.style.display = "flex";
                    window.scrollTo(0, 0);
                    document.body.style.overflow = "hidden";
                    setEditData(data);
                  }}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={handleDelete(data._id)}
                  className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

            {/* Email Section */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">EMAIL</span>
                <span className="text-white font-medium">{data.email}</span>
              </div>
              <div className="flex">
                <button
                  className="p-1 text-gray-400 cursor-pointer hover:text-blue-700 rounded-full hover:bg-gray-800 transition-all"
                  onClick={() => copyToClipboard(data.email)}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Password Section */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">PASSWORD</span>
                <span className="text-white font-medium">
                  {vis ? data.password : "• • • • • • • • • • • •"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1 text-gray-400 cursor-pointer hover:text-white rounded-full hover:bg-gray-800 transition-all"
                  onClick={() => setVis(!vis)}
                >
                  {vis ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  className="p-1 text-gray-400 cursor-pointer hover:text-blue-700 rounded-full hover:bg-gray-800 transition-all"
                  onClick={() => copyToClipboard(data.password)}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Copy notification */}
            {copied && (
              <div className=" fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm">
                Copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleData = async (e: FormData) => {
    const formData = {
      userId: session.data?.user?.id as string,
      url: e.get("url") as string,
      email: e.get("email") as string,
      rowPassword: e.get("password") as string,
    };
    if (!formData.url || !formData.email || !formData.rowPassword) {
      alert("Please fill all the fields");
      return;
    }
    const res = await fetch("/api/storeData", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      console.log("Error in storing data");
    }
    const r = await res.json();
    if (r.message === "Data already exists") {
      alert("Data already exists");
      return;
    }
    console.log(r.message);
    getData();
  };

  const div = (
    <div className="flex justify-center items-center gap-4">
      <div
        className=" bg-white rounded-full cursor-pointer"
        onClick={() => {
          const pBg = profileBg.current as HTMLDivElement;
          pBg.style.display = "flex";
          document.body.style.overflow = "hidden";
        }}
      >
        <Image
          src={(session.data?.user?.image as string) || "profile.svg"}
          alt="profile"
          width={50}
          height={50}
          className="rounded-full h-10 w-10"
        />
      </div>
    </div>
  );

  return (
    <div className="text-gray-100">
      <Navbar slug={div} />
      <div
        ref={profileBg}
        className="w-screen hidden gap-7 h-screen flex-col-reverse absolute top-0 backdrop-blur-xs justify-center items-center"
      >
        <div className="p-1 bg-gradient-to-br shadow-2xl from-gray-100 to-gray-900 rounded-2xl">
          <div className="flex flex-col justify-between items-center relative bg-gray-800 h-100 w-72 md:h-125 md:w-170 sm:w-155 sm:h-125 [550px]:w-125 [550px]:h-110 rounded-xl">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold m-3">
              WelCome !!!
            </div>
            <div className="flex gap-5 flex-col sm:flex-row items-center">
              <div className="bg-white rounded-full">
                <Image
                  src={(session.data?.user?.image as string) || "profile.svg"}
                  alt="profile"
                  width={200}
                  height={300}
                  className="rounded-full h-25 w-25 sm:h-30 sm:w-30 md:w-32 md:h-32 lg:w-35 lg:h-35 xl:w-40 xl:h-40"
                />
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {session.data?.user?.name}
                </div>
                <div className="text-sm md:text-md lg:text-lg font-bold">
                  {session.data?.user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut({ redirectTo: "/signin" });
              }}
              className="font-bold border m-5 rounded-3xl px-3 py-2 cursor-pointer border-gray-400 active:bg-gray-800 active:text-gray-100 hover:bg-gray-400 hover:text-gray-900"
            >
              signOut
            </button>
          </div>
        </div>
        <button
          className="bg-gray-800 border-2 border-gray-100 w-10 h-10 font-extrabold rounded-full active:bg-gray-800 active:text-gray-100 hover:bg-gray-400 hover:text-gray-900"
          onClick={() => {
            const pBg = profileBg.current as HTMLDivElement;
            pBg.style.display = "none";
            document.body.style.overflow = "auto";
          }}
        >
          X
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center flex-col gap-2">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold text-green-500 mt-5">
            Welcome to VaultGuard
          </div>
          <div className="text-center">
            Your one-stop solution for secure password management.
          </div>
        </div>
        <form
          action={handleData}
          className="flex flex-col items-center gap-2 mt-10"
        >
          <input
            type="text"
            required
            name="url"
            placeholder="Enter Website URL"
            className="border-2 border-gray-400 rounded-3xl p-2 m-2 w-90 sm:w-125 md:w-170 lg:w-200 xl:w-250"
          />
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              placeholder="Enter Email"
              className="border-2 border-gray-400 rounded-3xl p-2 m-2 w-88 sm:w-85 md:w-120 lg:w-140 xl:w-180"
            />
            <div className="flex items-center">
              <input
                type={visible ? "text" : "password"}
                name="password"
                required
                placeholder="Enter Password"
                autoComplete="current-password"
                className="border-2 border-gray-400 rounded-3xl p-2 m-2 sm:w-35 md:w-45 lg:w-55 xl:w-65"
              />
              <button
                type="submit"
                onClick={() => setVisible(!visible)}
                className="text-gray-400"
              >
                {visible ? <EyeOff size={25} /> : <Eye size={25} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="border-2 flex border-gray-400 rounded-3xl px-3 py-1 active:bg-gray-800 active:text-gray-100 hover:bg-gray-400 hover:text-gray-900"
          >
            save
          </button>
        </form>
      </div>
      <div className="flex flex-col items-center mt-10">
        <div className="text-2xl font-bold text-green-500 underline">
          Your Saved Passwords
        </div>
        {loading && Spinner()}
        {data.map(
          (item: {
            _id: string;
            url: string;
            email: string;
            password: string;
          }) => {
            return display(item);
          }
        )}
      </div>
      <div
        ref={editBg}
        className="w-screen hidden gap-7 h-screen flex-col-reverse absolute top-0 backdrop-blur-xs justify-center items-center"
      >
        <div>{editDisplay(editData)}</div>
        <button
          className="bg-gray-800 border-2 border-gray-100 w-10 h-10 font-extrabold rounded-full active:bg-gray-800 active:text-gray-100 hover:bg-gray-400 hover:text-gray-900"
          onClick={() => {
            const eBg = editBg.current as HTMLDivElement;
            eBg.style.display = "none";
            document.body.style.overflow = "auto";
          }}
        >
          X
        </button>
      </div>
    </div>
  );
}

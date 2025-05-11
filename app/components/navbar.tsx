"use client";
import React from "react";
import Image from "next/image";

const Navbar = (props: { slug: React.ReactNode }) => {
  return (
    <div>
      <div className="bg-gray-800 text-white sm:p-3 p-2 flex justify-around items-center rounded-b-3xl">
        <div className="text-2xl font-bold flex gap-3 items-center">
          <div>
            <Image
              src="/favicon.ico"
              alt="logo"
              width={35}
              height={35}
              className=" bg-white p-1 rounded-full"
            /> 
          </div>
          <span className="text-green-500" >VaultGuard</span>
        </div>
        <div>{props.slug}</div>
      </div>
    </div>
  );
};

export default Navbar;

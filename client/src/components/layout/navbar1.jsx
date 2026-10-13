import React from "react";
import Link from "next/link";
import { ROUTES } from "@/hooks/useNavigation";

export default function Navbar1() {
  return (
    <nav className="w-full bg-gray-100 md:px[100px] px-5 flex justify-between py-4 box-border">
      <Link href={ROUTES.HOME} className="flex justify-between">
        <div className="flex gap-1 items-center cursor-pointer">
          <h3 className="text-blue-800 font-bold text-3xl">Linked</h3>
          <img
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10"
            }
            alt="Linkedlogo"
            className="w-8 h-8"
          />
        </div>
      </Link>

      <div className="flex box-border md:gap-4 gap-2 justify-center item-center">
        <Link
          href={ROUTES.REGISTER}
          className="font-semibold text-gray-500 hover:text-black hover:bg-gray-200 py-3 px-6 rounded-3xl"
        >
          Register
        </Link>
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-blue-700 hover:text-blue-900 border-blue-700 hover:bg-blue-100 py-3 px-6 rounded-full border-2 cursor-pointer"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

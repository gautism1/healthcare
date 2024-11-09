import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="container p-4 flex justify-center items-center h-[50vh] flex-col">
        Brooklyn Healthcare System
        <div className="flex gap-2 mt-2">
          <Link href="/auth/login" className="border-2 rounded-xl px-3 py-1">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="border-2 rounded-xl px-3 py-1 bg-gray-100 "
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}

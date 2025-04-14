// import AcmeLogo from "@/app/ui/acme-logo";
// import { ArrowRightIcon } from "@heroicons/react/24/outline";
// import Image from "next/image";
// import Link from "next/link";
import dbConnect from "@/db";
import { Input } from "antd";
export default async function Page() {
  await dbConnect();
  return (
    <div>
      <Input />
    </div>
  );
}

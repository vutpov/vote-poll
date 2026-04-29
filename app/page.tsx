import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href={"/new-poll"}>
        <Button>Add a new poll</Button>
      </Link>
    </div>
  );
}

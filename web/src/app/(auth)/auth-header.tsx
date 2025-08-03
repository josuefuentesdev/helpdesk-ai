import { Icons } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <>
      <div className="flex flex-row justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Image
            src="/helpdesk-ai.webp"
            alt="helpdesk-ai logo"
            width={32}
            height={32}
          />
          Helpdesk AI
        </Link>
        <Link href="https://github.com/josuefuentesdev/helpdesk-ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium">
          <Icons.github className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}
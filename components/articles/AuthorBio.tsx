import Link from "next/link";
import { Users } from "lucide-react";

export function AuthorBio({ author, updatedAt }: { author: string; updatedAt: string }) {
  return (
    <div className="border-ink-100 flex items-center gap-3 rounded-2xl border bg-white p-4">
      <span className="bg-ink-100 text-ink-500 flex h-11 w-11 flex-none items-center justify-center rounded-full">
        <Users className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="text-sm">
        <p className="text-ink-900 font-semibold">{author}</p>
        <p className="text-ink-500">
          Reviewed against manufacturer documentation. Updated {updatedAt}.{" "}
          <Link href="/editorial-policy" className="text-blue-700 underline underline-offset-2 hover:text-blue-800">
            How we write guides
          </Link>
        </p>
      </div>
    </div>
  );
}

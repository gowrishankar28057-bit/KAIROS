import { redirect } from "next/navigation";
import { auth, isAuthConfigured, signIn } from "@/auth";
import { KairosLogo } from "@/components/Navbar";
import { GoogleMark } from "@/components/UserMenu";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  AccessDenied: "This Google account is not authorised for this KAIROS deployment.",
  Configuration: "Sign-in is not configured correctly on the server.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!isAuthConfigured()) redirect("/");
  if (await auth()) redirect("/");

  return (
    <main className="bg-lab flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-3xl border border-sci-100 bg-white p-8 text-center shadow-2xl shadow-sci-500/10">
        <KairosLogo className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-bold tracking-[0.2em] text-navy-900">KAIROS</h1>
        <p className="mt-1 text-sm text-slate-500">Adaptive Biological Intelligence Platform</p>
        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {ERRORS[error] ?? "Sign-in failed. Please try again."}
          </p>
        )}
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-sci-200 bg-white font-semibold text-navy-900 shadow-sm hover:border-sci-400 hover:bg-sci-50"
          >
            <GoogleMark className="h-5 w-5" /> Continue with Google
          </button>
        </form>
        <p className="mt-6 text-[11px] text-slate-400">Prototype simulation · secure access demonstration</p>
      </div>
    </main>
  );
}

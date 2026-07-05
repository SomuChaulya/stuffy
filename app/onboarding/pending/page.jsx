import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OnboardingPendingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    redirect("/onboarding");
  }

  if (dbUser.isVerified) {
    redirect(dbUser.role === "ADMIN" ? "/dashboard" : "/portal/employees");
  }

  return (
    <div className="min-h-screen bg-[#101010] text-[#bdbdbd] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#00d992] selection:text-[#101010]">
      {/* Glow Effects */}
      <div className="absolute top-[20%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#00d992]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <main className="w-full max-w-md border border-[#3d3a39] bg-[#1a1a1a] rounded-xl p-8 shadow-2xl relative text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <span className="h-4 w-4 bg-[#00d992] rounded-sm inline-block" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white font-bold">
            ADAMAS CONNECT
          </span>
        </div>

        <div className="h-16 w-16 mx-auto bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center rounded-full text-2xl mb-6 animate-pulse">
          ⏳
        </div>

        <h1 className="text-2xl font-extrabold text-white">Pending Approval</h1>
        <p className="text-sm text-slate-400 mt-4 leading-relaxed">
          Your onboarding profile has been submitted and is currently pending verification approval from the HR Administrator.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Your Employee ID: <strong className="text-white">{dbUser.employeeId}</strong>
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/onboarding/pending"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#00d992] text-sm font-semibold text-[#101010] shadow-lg transition hover:brightness-110 active:scale-[0.98] font-bold"
          >
            Check Verification Status
          </Link>
          
          <p className="text-xs text-slate-600 mt-4">
            If you need immediate assistance, please contact the administrator at admin@adamas.local.
          </p>
        </div>
      </main>
    </div>
  );
}

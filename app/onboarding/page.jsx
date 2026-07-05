import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { submitOnboarding } from "@/action/userActions";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Check if they already have an onboarding request
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (dbUser) {
    if (dbUser.isVerified) {
      redirect(dbUser.role === "ADMIN" ? "/dashboard" : "/portal/employees");
    } else {
      redirect("/onboarding/pending");
    }
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="min-h-screen bg-[#101010] text-[#bdbdbd] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#00d992] selection:text-[#101010]">
      {/* Glow Effects */}
      <div className="absolute top-[10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#00d992]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <main className="w-full max-w-2xl border border-[#3d3a39] bg-[#1a1a1a] rounded-xl p-8 shadow-2xl relative overflow-hidden my-12">
        <div className="text-center mb-8 border-b border-[#3d3a39] pb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="h-4 w-4 bg-[#00d992] rounded-sm inline-block" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white font-bold">
              ADAMAS CONNECT
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Complete Profile Onboarding</h1>
          <p className="text-sm text-slate-400 mt-2">
            Please fill in your employee details. Once submitted, your profile will be sent to the HR administrator for verification approval.
          </p>
        </div>

        <form action={submitOnboarding} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              First Name *
              <input
                name="firstName"
                required
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="John"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Last Name *
              <input
                name="lastName"
                required
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="Doe"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mobile Phone
              <input
                name="phone"
                type="tel"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="+91-XXXX-XXXXXX"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Date of Birth
              <input
                name="dob"
                type="date"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
              />
            </label>

          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Address
            <textarea
              name="address"
              rows="2"
              className="py-2 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992] resize-none"
              placeholder="Full mailing address..."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Gender
              <select
                name="gender"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Department *
              <input
                name="department"
                required
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="Engineering"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Designation *
              <input
                name="designation"
                required
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="Software Engineer"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Basic Monthly Salary (INR) *
              <input
                name="basicSalary"
                type="number"
                min="0"
                required
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="55000"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Bank Name
              <input
                name="bankName"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="HDFC Bank"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Bank Account Number
              <input
                name="accountNumber"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="50100XXXXXXXX"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 border-t border-[#3d3a39] pt-6">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Emergency Contact Name
              <input
                name="emergencyName"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="Spouse/Parent Name"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Emergency Contact Phone
              <input
                name="emergencyPhone"
                type="tel"
                className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#00d992]"
                placeholder="+91-XXXX-XXXXXX"
              />
            </label>
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#00d992] text-sm font-semibold text-[#101010] shadow-lg transition hover:brightness-110 active:scale-[0.98] font-bold"
          >
            Submit Profile for Verification
          </button>
        </form>
      </main>
    </div>
  );
}


import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employees", label: "Employees" },
  { href: "/attendance", label: "Attendance" },
  { href: "/time-off", label: "Time Off" },
  { href: "/payroll", label: "Payroll" },
  { href: "/documents", label: "Documents" },
];

export const metadata = {
  title: "Admin Dashboard | HRMS",
  description: "Human Resource Management System admin routes",
};

export default async function AdminLayout({ children }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Fetch or link database user
  let adminUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!adminUser) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });
      if (existingUser) {
        adminUser = await prisma.user.update({
          where: { email },
          data: { id: userId },
          include: { profile: true },
        });
      }
    }
  }

  if (!adminUser) {
    redirect("/onboarding");
  }

  if (!adminUser.isVerified) {
    redirect("/onboarding/pending");
  }

  if (adminUser.role !== "ADMIN") {
    redirect("/portal/employees");
  }
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
              Staffy HRMS
            </p>
            <h1 className="text-xl font-bold">Admin</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <SignOutButton redirectUrl="/">
              <button className="inline-flex h-9 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 cursor-pointer">
                Log Out
              </button>
            </SignOutButton>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</div>
    </main>
  );
}

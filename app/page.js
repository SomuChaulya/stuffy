"use client";

import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();

  return (
    <div className="min-h-screen bg-[#101010] text-[#bdbdbd] font-sans selection:bg-[#00d992] selection:text-[#101010]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#3d3a39] bg-[#101010]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 bg-[#00d992] rounded-sm inline-block" />
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-white font-bold">
              ADAMAS CONNECT
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            {!isLoaded ? (
              <span className="text-slate-500">Loading...</span>
            ) : userId ? (
              <div className="flex items-center gap-3">
                <Link href="/portal/employees" className="transition hover:text-white text-[#00d992]">
                  Go to App
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="transition hover:text-white cursor-pointer text-[#bdbdbd]">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="transition hover:text-white cursor-pointer text-[#00d992]">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative mx-auto max-w-7xl px-6 py-12 md:py-24 grid gap-12 lg:grid-cols-12 items-center">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#00d992]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* Brand Information */}
        <div className="lg:col-span-7 space-y-6">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#00d992]">
            Voltagent Designed / Developer HR Portal
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
            Lightweight HRMS <br className="hidden sm:inline" />
            built for high speed.
          </h1>
          <p className="text-sm sm:text-base text-[#bdbdbd] max-w-xl leading-relaxed">
            Manage attendance logs, leave balances, payslips, and profiles. Now integrated with Clerk authentication and Neon PostgreSQL for production-ready security.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="border border-[#3d3a39] bg-[#1a1a1a]/40 rounded-lg p-4">
              <strong className="text-white block text-sm mb-1">Clerk Auth</strong>
              <p className="text-xs">Secure login, signup, and user profiles managed securely by Clerk authentication.</p>
            </div>
            <div className="border border-[#3d3a39] bg-[#1a1a1a]/40 rounded-lg p-4">
              <strong className="text-white block text-sm mb-1">Onboarding Flow</strong>
              <p className="text-xs">New users complete their profiles upon first login, pending verification from HR admins.</p>
            </div>
          </div>
        </div>

        {/* Interactive Auth Card */}
        <div className="lg:col-span-5">
          <div className="border border-[#3d3a39] bg-[#1a1a1a] rounded-xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl font-bold text-white mb-2">Welcome to Adamas</h3>
            <p className="text-xs text-slate-400 mb-8 text-center">
              Please sign in or create a new account to access the employee portal and HR features.
            </p>

            {!isLoaded ? (
              <div className="h-11 w-full rounded-lg border border-[#3d3a39] bg-[#101010] flex items-center justify-center text-sm">
                Loading authentication...
              </div>
            ) : userId ? (
              <div className="w-full space-y-4">
                <Link
                  href="/portal/employees"
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-[#00d992] text-sm font-semibold text-[#101010] shadow-lg transition hover:brightness-110 active:scale-[0.98] font-bold"
                >
                  Enter Portal / Dashboard
                </Link>
                <div className="flex justify-center mt-4">
                  <UserButton afterSignOutUrl="/" showName />
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <SignInButton mode="modal">
                  <button className="flex h-11 w-full items-center justify-center rounded-lg bg-[#00d992] text-sm font-semibold text-[#101010] shadow-lg transition hover:brightness-110 active:scale-[0.98] font-bold cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex h-11 w-full items-center justify-center rounded-lg border border-[#3d3a39] bg-transparent text-sm font-semibold text-white transition hover:bg-[#1a1a1a] active:scale-[0.98] cursor-pointer">
                    Create New Account
                  </button>
                </SignUpButton>
              </div>
            )}

            <div className="mt-8 border-t border-[#3d3a39] pt-6 w-full text-center">
              <p className="text-[11px] text-slate-500">
                To link to seeded profiles, sign up with standard employee emails like <code className="text-slate-300">mina.khan@adamas.local</code> or the admin <code className="text-slate-300">admin@adamas.local</code>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3d3a39] bg-[#101010] py-12 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-[#00d992] rounded-sm inline-block" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
              ADAMAS CONNECT
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[#8b949e] font-medium">
            <span className="hover:text-white transition cursor-pointer">Security</span>
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer flex items-center gap-1">
              Status: <span className="inline-block h-2 w-2 rounded-full bg-[#00d992]"></span> Operational
            </span>
          </div>
          <p className="text-[#8b949e]">&copy; 2026 HRMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

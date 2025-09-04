"use client";

import { authenticateUser } from "@/actions/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [mrId, setMrId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authentication();
  };

  const authentication = async () => {
    const { status } = await authenticateUser(mrId, password, rememberMe);

    if (status === 200) {
      return router.replace("/");
    } else {
      return toast("Invalid credentials", {
        description: "kindly check your credentials and try again.",
        style: {
          backgroundColor: "#86EFAC",
          fontStyle: "serif",
          letterSpacing: 0.5,
        },
        duration: 2000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="animated-background min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200/50">
          {/* Logo + Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--primary-color)] text-white mb-4 shadow-lg">
              <span className="material-symbols-outlined text-3xl">
                health_and_safety
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              MediRep Portal
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Welcome back, please log in.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* MR ID */}
            <div className="input-field-wrapper">
              <input
                className="input-field"
                id="mr-id"
                name="mr-id"
                placeholder="Medical Representative ID"
                value={mrId}
                onChange={(e) => setMrId(e.target.value)}
                required
                type="text"
              />
              <label className="input-label" htmlFor="mr-id">
                Medical Representative ID
              </label>
              <span className="material-symbols-outlined input-icon">
                badge
              </span>
            </div>

            {/* Password */}
            <div className="input-field-wrapper">
              <input
                className="input-field"
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <span className="material-symbols-outlined input-icon">lock</span>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="font-medium text-[var(--primary-color)] hover:text-[var(--accent-color)] transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-[var(--accent-color)] focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)] focus:ring-opacity-30 transition-all duration-300 ease-in-out font-semibold text-base transform hover:scale-105"
              >
                Secure Login
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>
              Need assistance?{" "}
              <a
                href="#"
                className="font-medium text-[var(--primary-color)] hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2024 MediRep Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}

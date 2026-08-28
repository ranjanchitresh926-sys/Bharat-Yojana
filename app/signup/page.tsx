"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GovHeader from "../../components/GovHeader";
import GovFooter from "../../components/GovFooter";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("officer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Account created — redirect to login
      router.push("/login?registered=1");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans">
      <GovHeader />
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500 mt-2">Register as an officer or admin to manage applications.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 transition-colors text-black"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 transition-colors text-black"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 transition-colors bg-white text-black"
              >
                <option value="officer">Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B3D91] hover:bg-[#1a4fa0] text-white font-bold py-2.5 px-4 rounded transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0B3D91] font-semibold hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 rounded">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}

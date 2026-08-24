"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GovHeader from "../../components/GovHeader";
import GovFooter from "../../components/GovFooter";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans">
      <GovHeader />
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Officer / Admin Sign In</h1>
            <p className="text-sm text-gray-500 mt-2">Citizens do not need to sign in to search for schemes.</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 transition-colors"
                placeholder="officer1@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0B3D91] hover:bg-[#1a4fa0] text-white font-bold py-2.5 px-4 rounded transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}

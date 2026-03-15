"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAdmin) router.replace("/admin/dashboard");
  }, [isAdmin, authLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-bg-card border border-border rounded-card p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <p className="font-display font-bold text-2xl mb-1">
              <span className="text-accent-cyan">nishan</span>creates
            </p>
            <p className="font-mono text-xs text-text-muted">Admin access only</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nishanrokaya535@gmail.com"
                required
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-btn px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:bg-accent-cyan-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs text-text-muted mt-4">
          Not for public access.
        </p>
      </motion.div>
    </div>
  );
}

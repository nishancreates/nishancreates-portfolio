"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div style={{ minHeight: "100vh", background: "#101014", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ background: "#16181d", border: "1px solid #2a2d35", borderRadius: "16px", padding: "32px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: "bold", color: "white", margin: 0 }}>
              <span style={{ color: "#00E8FF" }}>nishan</span>creates
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", marginTop: "4px" }}>Admin access only</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "monospace", fontSize: "11px", color: "#999", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ width: "100%", background: "#101014", border: "1px solid #2a2d35", borderRadius: "8px", padding: "12px 16px", color: "white", fontFamily: "monospace", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "monospace", fontSize: "11px", color: "#999", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", background: "#101014", border: "1px solid #2a2d35", borderRadius: "8px", padding: "12px 16px", color: "white", fontFamily: "monospace", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
              />
            </div>

            {error && (
              <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "8px 12px", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#00E8FF", color: "#101014", fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: "8px" }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>
        <p style={{ textAlign: "center", fontFamily: "monospace", fontSize: "11px", color: "#444", marginTop: "16px" }}>
          Not for public access.
        </p>
      </div>
    </div>
  );
}

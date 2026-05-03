"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    const { supabase } = await import("../../lib/supabase");
    if (!supabase) { setMessage("Error: Not configured"); setLoading(false); return; }
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Error: " + error.message);
      else setMessage("Account created! Check your email.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Error: " + error.message);
      else window.location.href = "/feed";
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 16, fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 40 }}>🎬</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>{isSignUp ? "Create your account" : "Welcome back"}</div>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: 300, padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14 }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: 300, padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14 }} />
      {message && <div style={{ color: message.startsWith("Error") ? "#FF6B6B" : "#55EFC4", fontSize: 13, textAlign: "center", maxWidth: 300 }}>{message}</div>}
      <button onClick={handleAuth} disabled={loading} style={{ width: 300, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
        {loading ? "Please wait..." : isSignUp ? "Create Account" : "Log In"}
      </button>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer" }} onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
      </div>
    </div>
  );
}

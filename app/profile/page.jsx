"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { supabase } = await import("../../lib/supabase");
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const savedUsername = localStorage.getItem("username_" + user?.id) || "";
      setUsername(savedUsername);
    };
    init();
  }, []);

  const saveUsername = () => {
    if (!username.trim()) return;
    setSaving(true);
    localStorage.setItem("username_" + user?.id, username.trim());
    setTimeout(() => { setSaving(false); setSaved(true); }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <div style={{ padding: "16px 0 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }}>
        <a href="/feed" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14 }}>← Back</a>
        <span style={{ fontSize: 18, fontWeight: 800 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span> Profile</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800 }}>
          {username ? username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div style={{ width: "100%", maxWidth: 300 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>USERNAME</div>
          <input type="text" placeholder="Choose a username..." value={username} onChange={e => { setUsername(e.target.value); setSaved(false); }} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none" }} />
        </div>
        <div style={{ width: "100%", maxWidth: 300 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>EMAIL</div>
          <div style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{user?.email || ""}</div>
        </div>
        {saved ? (
          <div style={{ color: "#55EFC4", fontSize: 14, fontWeight: 700 }}>✅ Username saved!</div>
        ) : (
          <button onClick={saveUsername} disabled={!username.trim() || saving} style={{ width: 300, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            {saving ? "Saving..." : "Save Username"}
          </button>
        )}
        <button onClick={async () => { const { supabase } = await import("../../lib/supabase"); await supabase.auth.signOut(); window.location.href = "/login"; }} style={{ width: 300, background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)", color: "#FF6B6B", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
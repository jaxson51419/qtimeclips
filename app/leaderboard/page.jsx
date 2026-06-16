"use client";
import { useState, useEffect } from "react";

export default function LeaderboardPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { supabase } = await import("../../lib/supabase");
        const { data } = await supabase
          .from("video_stats")
          .select("*")
          .order("views", { ascending: false })
          .limit(10);
        if (data) setStats(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <style>{`* { box-sizing: border-box; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, background: "rgba(10,10,15,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/feed" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14 }}>← Back</a>
        <span style={{ fontSize: 18, fontWeight: 800, marginLeft: 8 }}>🏆 Leaderboard</span>
      </div>

      <div style={{ padding: "16px 16px 100px" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", marginBottom: 20 }}>Most viewed clips on QTimeClips</div>

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,107,107,0.3)", borderTopColor: "#FF6B6B", animation: "spin 0.8s linear infinite" }}/>
          </div>
        )}

        {!loading && stats.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ fontSize: 48 }}>🎬</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 12 }}>No views yet! Watch some videos to start the leaderboard.</div>
            <a href="/feed" style={{ display: "inline-block", marginTop: 20, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Watch Videos</a>
          </div>
        )}

        {stats.map((stat, i) => (
          <div key={stat.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", marginBottom: 12, borderRadius: 16, background: i === 0 ? "rgba(255,215,0,0.1)" : i === 1 ? "rgba(192,192,192,0.1)" : i === 2 ? "rgba(205,127,50,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(255,215,0,0.3)" : i === 1 ? "rgba(192,192,192,0.2)" : i === 2 ? "rgba(205,127,50,0.2)" : "rgba(255,255,255,0.06)"}` }}>
            <div style={{ fontSize: 28, minWidth: 40, textAlign: "center" }}>
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.video_name.replace(/\.[^.]+$/, "")}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>👁 {stat.views.toLocaleString()} views · ❤️ {stat.likes.toLocaleString()} likes</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,10,15,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 200 }}>
        {[{ name: "Feed", icon: "🏠", href: "/feed" }, { name: "Explore", icon: "🔍", href: "/explore" }, { name: "Upload", icon: "➕", href: "/upload" }, { name: "🏆", icon: "🏆", href: "/leaderboard" }, { name: "Profile", icon: "👤", href: "/profile" }].map(tab => (
          <a key={tab.name} href={tab.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.35)", padding: "4px 10px" }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

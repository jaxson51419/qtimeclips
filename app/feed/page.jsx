"use client";
import { useState, useRef, useEffect } from "react";

export default function FeedPage() {
  const [clips, setClips] = useState([]);
  const [activeClip, setActiveClip] = useState(0);
  const [activeTab, setActiveTab] = useState("Feed");
  const TABS = ["Feed", "Explore", "Upload", "Notifications", "Profile"];

  useEffect(() => {
    const loadClips = async () => {
      const { supabase } = await import("../../lib/supabase");
      if (!supabase) return;
      const { data } = await supabase.storage.from("videos").list();
      if (data) {
        const urls = data.map(file => ({
          id: file.name,
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${file.name}`,
          name: file.name,
        }));
        setClips(urls);
      }
    };
    loadClips();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "sans-serif", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 100, background: "#0A0A0F" }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></span>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #A29BFE, #6C5CE7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, cursor: "pointer" }}>U</div>
      </div>

      {activeTab === "Feed" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          {clips.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: 100, fontSize: 14 }}>
              No clips yet. Upload the first one!
            </div>
          )}
          {clips.map((clip, i) => (
            <div key={clip.id} style={{ marginBottom: 20, borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <video
                src={clip.url}
                controls
                style={{ width: "100%", borderRadius: 20, maxHeight: 480, objectFit: "cover", background: "#000" }}
              />
              <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                {clip.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Upload" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20, textAlign: "center" }}>
          <div style={{ fontSize: 60 }}>🎬</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Drop Your 90s</div>
          <a href="/upload" style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "14px 36px", fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Choose Video</a>
        </div>
      )}

      {(activeTab === "Explore" || activeTab === "Notifications" || activeTab === "Profile") && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)" }}>{activeTab} coming soon...</div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "8px 0 16px", zIndex: 200 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", cursor: "pointer", color: activeTab === tab ? "#FF6B6B" : "rgba(255,255,255,0.35)", padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>{tab}</button>
        ))}
      </div>
    </div>
  );
}

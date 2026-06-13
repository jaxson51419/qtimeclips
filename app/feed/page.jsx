"use client";
import { useState, useEffect } from "react";

export default function FeedPage() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Feed");
  const TABS = ["Feed", "Explore", "Upload", "Notifications", "Profile"];

  useEffect(() => {
    const loadClips = async () => {
      try {
        const { supabase } = await import("../../lib/supabase");
        if (!supabase) return;
        const { data, error } = await supabase.storage.from("videos").list("", { limit: 50, sortBy: { column: "created_at", order: "desc" } });
        if (data && !error) {
          const urls = data
            .filter(file => file.name !== ".emptyFolderPlaceholder")
            .map(file => ({
              id: file.name,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${file.name}`,
              name: file.name.split("_").slice(1).join("_") || file.name,
            }));
          setClips(urls);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadClips();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 100, background: "#0A0A0F" }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></span>
        <a href="/upload" style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#fff", textDecoration: "none" }}>+ Upload</a>
      </div>

      {activeTab === "Feed" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          {loading && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 100, fontSize: 14 }}>Loading clips...</div>
          )}
          {!loading && clips.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 100 }}>
              <div style={{ fontSize: 60 }}>🎬</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 16 }}>No clips yet!</div>
              <a href="/upload" style={{ display: "inline-block", marginTop: 16, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Upload First Clip</a>
            </div>
          )}
          {clips.map(clip => (
            <div key={clip.id} style={{ marginBottom: 24, borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <video
                src={clip.url}
                controls
                playsInline
                style={{ width: "100%", maxHeight: 500, objectFit: "cover", background: "#000", display: "block" }}
              />
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{clip.name}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>❤️</button>
                  <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>💬</button>
                  <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>↗️</button>
                </div>
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

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "8px 0 16px", zIndex: 200 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", cursor: "pointer", color: activeTab === tab ? "#FF6B6B" : "rgba(255,255,255,0.35)", padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>{tab}</button>
        ))}
      </div>
    </div>
  );
}

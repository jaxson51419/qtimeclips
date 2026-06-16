"use client";
import { useState, useEffect } from "react";

export default function ExplorePage() {
  const [clips, setClips] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClips = async () => {
      try {
        const { supabase } = await import("../../lib/supabase");
        if (!supabase) return;
        const { data, error } = await supabase.storage.from("videos").list("", { limit: 50 });
        if (data && !error) {
          const urls = data
            .filter(file => file.name !== ".emptyFolderPlaceholder")
            .map(file => ({
              id: file.name,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${file.name}`,
              title: file.name.split("_").slice(2).join("_").replace(/\.[^.]+$/, "") || file.name,
            }));
          setClips(urls);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadClips();
  }, []);

  const filtered = clips.filter(clip =>
    clip.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { display: none; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, background: "rgba(10,10,15,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/feed" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14 }}>← Back</a>
        <span style={{ fontSize: 18, fontWeight: 800, marginLeft: 8 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></span>
      </div>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clips..." style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 15, outline: "none" }}/>
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>✕</button>}
        </div>
      </div>

      <div style={{ padding: "16px 16px 100px" }}>
        {loading && <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}><div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,107,107,0.3)", borderTopColor: "#FF6B6B", animation: "spin 0.8s linear infinite" }}/></div>}
        {!loading && !search && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", marginTop: 40 }}>Type something to search clips...</div>}
        {!loading && search && filtered.length === 0 && <div style={{ textAlign: "center", marginTop: 60, color: "rgba(255,255,255,0.3)" }}><div style={{ fontSize: 48 }}>🔍</div><div style={{ fontSize: 16, marginTop: 12 }}>No clips found for "{search}"</div></div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map(clip => (
            <div key={clip.id} style={{ borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <video src={clip.url} style={{ width: "100%", height: 140, objectFit: "cover", background: "#000", display: "block" }}/>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,10,15,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 200 }}>
        {[{ name: "Feed", icon: "🏠", href: "/feed" }, { name: "Explore", icon: "🔍", href: "/explore" }, { name: "Upload", icon: "➕", href: "/upload" }, { name: "Profile", icon: "👤", href: "/profile" }].map(tab => (
          <a key={tab.name} href={tab.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tab.name === "Explore" ? "#FF6B6B" : "rgba(255,255,255,0.35)", padding: "4px 10px" }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
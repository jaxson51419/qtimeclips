"use client";
import { useState, useRef, useEffect } from "react";

const MOCK_CLIPS = [
  { id: 1, user: { name: "Maya Chen", handle: "@mayachen", avatar: "MC", color: "#FF6B6B" }, title: "sunset kayaking in Ha Long Bay", likes: 4821, comments: 312, shares: 89, views: "128K", tags: ["travel", "vietnam"], gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)", duration: 90 },
  { id: 2, user: { name: "Kai Rivers", handle: "@kaimusic", avatar: "KR", color: "#A29BFE" }, title: "wrote this beat in 90 seconds", likes: 9204, comments: 671, shares: 443, views: "512K", tags: ["music", "producer"], gradient: "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 50%, #2D3436 100%)", duration: 90 },
  { id: 3, user: { name: "Zoe Park", handle: "@zoecooks", avatar: "ZP", color: "#55EFC4" }, title: "90-sec ramen from scratch", likes: 31540, comments: 2109, shares: 1880, views: "2.1M", tags: ["food", "cooking"], gradient: "linear-gradient(135deg, #55EFC4 0%, #00B894 50%, #FDCB6E 100%)", duration: 90 },
  { id: 4, user: { name: "Leo Vance", handle: "@leoskates", avatar: "LV", color: "#FD79A8" }, title: "first time landing this trick", likes: 7633, comments: 890, shares: 210, views: "890K", tags: ["skate", "sports"], gradient: "linear-gradient(135deg, #FD79A8 0%, #E84393 50%, #6C5CE7 100%)", duration: 90 },
];

const TABS = ["Feed", "Explore", "Upload", "Notifications", "Profile"];

function ClipCard({ clip, active }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) { setProgress(0); setPlaying(false); clearInterval(intervalRef.current); }
  }, [active]);

  const togglePlay = () => {
    if (playing) { clearInterval(intervalRef.current); setPlaying(false); }
    else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(intervalRef.current); setPlaying(false); return 100; }
          return p + (100 / (clip.duration * 10));
        });
      }, 100);
    }
  };

  const timeLeft = Math.round(clip.duration * (1 - progress / 100));
  const r = 14, circ = 2 * Math.PI * r, offset = circ - (progress / 100) * circ;

  return (
    <div onClick={togglePlay} style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: clip.gradient, minHeight: 480, display: "flex", flexDirection: "column", justifyContent: "flex-end", cursor: "pointer" }}>
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <svg width="36" height="36" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
          <circle cx="18" cy="18" r={r} fill="none" stroke="#FFE66D" strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/>
        </svg>
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 9, fontWeight: 700, color: "#FFE66D" }}>{timeLeft}s</span>
      </div>
      {!playing && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 64, height: 64, borderRadius: "50%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      )}
      <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", padding: "60px 18px 18px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {clip.tags.map(t => <span key={t} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>#{t}</span>)}
        </div>
        <p style={{ margin: "0 0 10px", color: "#fff", fontSize: 15, fontWeight: 600 }}>{clip.title}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: clip.user.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>{clip.user.avatar}</div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{clip.user.name}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{clip.user.handle}</div>
            </div>
          </div>
          <button style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 20, padding: "6px 16px", fontSize: 12, cursor: "pointer" }}>Follow</button>
        </div>
      </div>
    </div>
  );
}

function ActionBar({ clip, liked, onLike }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 0 4px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {[{ icon: liked ? "hearts" : "heart", label: clip.likes.toLocaleString(), action: onLike }, { icon: "chat", label: clip.comments.toLocaleString(), action: () => {} }, { icon: "share", label: clip.shares.toLocaleString(), action: () => {} }, { icon: "view", label: clip.views, action: () => {} }].map(({ icon, label, action }) => (
        <button key={label} onClick={action} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "rgba(255,255,255,0.5)", padding: "4px 10px" }}>
          <span style={{ fontSize: 16 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("Feed");
  const [activeClip, setActiveClip] = useState(0);
  const [likedClips, setLikedClips] = useState(new Set());

  const toggleLike = (id) => {
    setLikedClips(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "sans-serif", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 100, background: "#0A0A0F" }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></span>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #A29BFE, #6C5CE7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, cursor: "pointer" }}>U</div>
      </div>

      {activeTab === "Feed" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          {MOCK_CLIPS.map((clip, i) => (
            <div key={clip.id} onClick={() => setActiveClip(i)} style={{ marginBottom: 20, borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ClipCard clip={clip} active={activeClip === i} />
              <ActionBar clip={clip} liked={likedClips.has(clip.id)} onLike={() => toggleLike(clip.id)} />
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

"use client";
import { useState, useEffect } from "react";

export default function FeedPage() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Feed");
  const [likedClips, setLikedClips] = useState(new Set());
  const [commentOpen, setCommentOpen] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const TABS = [
    { name: "Feed", icon: "🏠" },
    { name: "Explore", icon: "🔍" },
    { name: "Upload", icon: "➕" },
    { name: "Notifications", icon: "🔔" },
    { name: "Profile", icon: "👤" },
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const { supabase } = await import("../../lib/supabase");
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        const { data, error } = await supabase.storage.from("videos").list("", { limit: 50, sortBy: { column: "created_at", order: "desc" } });
        if (data && !error) {
          const urls = data
            .filter(file => file.name !== ".emptyFolderPlaceholder")
            .map(file => ({
              id: file.name,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${file.name}`,
              name: file.name.split("_").slice(1).join("_") || file.name,
              likes: Math.floor(Math.random() * 10000),
            }));
          setClips(urls);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    init();
  }, []);

  const toggleLike = (id) => {
    setLikedClips(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const addComment = (clipId) => {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [clipId]: [...(prev[clipId] || []), { text: newComment, user: user?.email?.split("@")[0] || "You", time: "Just now" }]
    }));
    setNewComment("");
  };

  const deleteClip = async (clipId) => {
    if (!confirm("Are you sure you want to delete this clip?")) return;
    setDeleting(clipId);
    try {
      const { supabase } = await import("../../lib/supabase");
      const { error } = await supabase.storage.from("videos").remove([clipId]);
      if (!error) {
        setClips(prev => prev.filter(c => c.id !== clipId));
      } else {
        alert("Delete failed: " + error.message);
      }
    } catch (e) { console.error(e); }
    setDeleting(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "'SF Pro Display', -apple-system, sans-serif", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { display: none; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
          <span style={{ fontSize: 20, fontWeight: 800 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></span>
        </div>
        <a href="/upload" style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 20, padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none" }}>+ Upload</a>
      </div>

      {/* Feed */}
      {activeTab === "Feed" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 120, gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,107,107,0.3)", borderTopColor: "#FF6B6B", animation: "spin 0.8s linear infinite" }}/>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading clips...</div>
            </div>
          )}
          {!loading && clips.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 100 }}>
              <div style={{ fontSize: 64 }}>🎬</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginTop: 16 }}>No clips yet!</div>
              <a href="/upload" style={{ display: "inline-block", marginTop: 20, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Upload First Clip</a>
            </div>
          )}
          {clips.map((clip, i) => (
            <div key={clip.id} style={{ marginBottom: 24, borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <div style={{ position: "relative" }}>
                <video src={clip.url} controls playsInline style={{ width: "100%", maxHeight: 520, objectFit: "cover", background: "#000", display: "block" }}/>
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                  <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#FFE66D" }}>90s</div>
                  <button
                    onClick={() => deleteClip(clip.id)}
                    disabled={deleting === clip.id}
                    style={{ background: "rgba(255,50,50,0.7)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    {deleting === clip.id ? "..." : "🗑 Delete"}
                  </button>
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 60%), hsl(${i * 60 + 60}, 70%, 40%))`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>
                      {clip.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{clip.name.replace(/\.[^.]+$/, "").substring(0, 20)}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Just now</div>
                    </div>
                  </div>
                  <button style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)", color: "#FF6B6B", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Follow</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", gap: 20 }}>
                    <button onClick={() => toggleLike(clip.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: likedClips.has(clip.id) ? "#FF6B6B" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, padding: 0 }}>
                      <span style={{ fontSize: 20 }}>{likedClips.has(clip.id) ? "❤️" : "🤍"}</span>
                      {(clip.likes + (likedClips.has(clip.id) ? 1 : 0)).toLocaleString()}
                    </button>
                    <button onClick={() => setCommentOpen(commentOpen === clip.id ? null : clip.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: commentOpen === clip.id ? "#A29BFE" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, padding: 0 }}>
                      <span style={{ fontSize: 20 }}>💬</span>
                      {(comments[clip.id] || []).length}
                    </button>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 20, padding: 0 }}>↗️</button>
                </div>

                {commentOpen === clip.id && (
                  <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                    {(comments[clip.id] || []).length === 0 && (
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", padding: "8px 0" }}>No comments yet. Be first!</div>
                    )}
                    {(comments[clip.id] || []).map((c, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #A29BFE, #6C5CE7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {c.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{c.user} </span>
                          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{c.text}</span>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>{c.time}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment(clip.id)} placeholder="Add a comment..." style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "8px 14px", color: "#fff", fontSize: 13, outline: "none" }}/>
                      <button onClick={() => addComment(clip.id)} style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", border: "none", borderRadius: 20, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Post</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Profile" && (
        <div style={{ flex: 1, padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 40 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800 }}>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{user?.email?.split("@")[0] || "User"}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{user?.email || ""}</div>
            <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{clips.length}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Clips</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>0</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Followers</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>0</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Following</div>
              </div>
            </div>
            <button onClick={async () => { const { supabase } = await import("../../lib/supabase"); await supabase.auth.signOut(); window.location.href = "/login"; }} style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)", color: "#FF6B6B", borderRadius: 20, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {activeTab === "Upload" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20, textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>🎬</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Drop Your 90s</div>
          <a href="/upload" style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "14px 36px", fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Choose Video</a>
        </div>
      )}

      {(activeTab === "Explore" || activeTab === "Notifications") && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", gap: 12 }}>
          <div style={{ fontSize: 48 }}>🚧</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{activeTab} coming soon</div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 200 }}>
        {TABS.map(tab => (
          <button key={tab.name} onClick={() => tab.name === "Upload" ? window.location.href = "/upload" : setActiveTab(tab.name)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: activeTab === tab.name ? "#FF6B6B" : "rgba(255,255,255,0.35)", padding: "4px 10px" }}>
            <span style={{ fontSize: tab.name === "Upload" ? 28 : 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

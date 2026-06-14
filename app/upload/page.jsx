"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setProgress(0);

    const filename = `${Date.now()}_${file.name}`;

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 10;
      });
    }, 500);

    const { error } = await supabase.storage
      .from("videos")
      .upload(filename, file);

    clearInterval(progressInterval);

    if (error) {
      setError("Upload failed: " + error.message);
      setProgress(0);
    } else {
      setProgress(100);
      setDone(true);
    }
    setUploading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20, textAlign: "center", fontFamily: "sans-serif" }}>
      
      {/* Header */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, background: "rgba(10,10,15,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/feed" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14 }}>← Back</a>
        <span style={{ fontSize: 16, fontWeight: 800, marginLeft: 8 }}>QTime<span style={{ color: "#FF6B6B" }}>Clips</span></span>
      </div>

      <div style={{ fontSize: 64, marginTop: 60 }}>🎬</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>Upload Your Clip</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Max 90 seconds. Make it count.</div>

      <input
        type="file"
        accept="video/*"
        onChange={e => { setFile(e.target.files[0]); setDone(false); setProgress(0); }}
        style={{ color: "#fff", fontSize: 14 }}
      />

      {file && !done && (
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
        </div>
      )}

      {error && <div style={{ color: "#FF6B6B", fontSize: 13, maxWidth: 300 }}>{error}</div>}

      {/* Progress Bar */}
      {uploading && (
        <div style={{ width: "100%", maxWidth: 300 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Uploading...</span>
            <span style={{ fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 10, transition: "width 0.3s ease" }}/>
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 8 }}>
            Please keep this page open while uploading
          </div>
        </div>
      )}

      {done ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 48 }}>✅</div>
          <div style={{ color: "#55EFC4", fontSize: 18, fontWeight: 700 }}>Upload successful!</div>
          <a href="/feed" style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", marginTop: 8 }}>View in Feed</a>
        </div>
      ) : (
        !uploading && (
          <button
            onClick={handleUpload}
            disabled={!file}
            style={{ background: file ? "linear-gradient(135deg, #FF6B6B, #A29BFE)" : "rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: file ? "pointer" : "not-allowed", color: "#fff", border: "none", opacity: file ? 1 : 0.5 }}
          >
            Upload Video
          </button>
        )
      )}
    </div>
  );
}

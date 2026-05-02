"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    const filename = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(filename, file);
    if (error) {
      setError("Error: " + error.message);
    } else {
      setDone(true);
    }
    setUploading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20, textAlign: "center", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 60 }}>🎬</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Upload Your Clip</div>
      <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ color: "#fff", fontSize: 14 }} />
      {file && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Selected: {file.name}</div>}
      {error && <div style={{ color: "#FF6B6B", fontSize: 14, maxWidth: 300 }}>{error}</div>}
      {done ? (
        <div style={{ color: "#55EFC4", fontSize: 16, fontWeight: 700 }}>✅ Upload successful!</div>
      ) : (
        <button onClick={handleUpload} disabled={!file || uploading} style={{ background: "linear-gradient(135deg, #FF6B6B, #A29BFE)", borderRadius: 16, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#fff", border: "none" }}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      )}
    </div>
  );
}

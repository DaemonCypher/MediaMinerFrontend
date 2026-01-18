import { useEffect, useState } from "react";
import "./DownloadPage.css";

async function getJson(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? "Request failed");
  return data;
}

export default function DownloadsPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function refreshFiles() {
    setErr("");
    setLoading(true);
    try {
      const data = await getJson("/api/files");
      setFiles(data.files ?? []);
    } catch (e) {
      setErr(e.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshFiles();
  }, []);

  return (
    <div className="download-container">
      <div className="download-header">
        <h1 className="download-title">Downloads</h1>

        <button
          onClick={refreshFiles}
          disabled={loading}
          className="refresh-button"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {err && (
        <div className="error-message">
          {err}
        </div>
      )}

      <div className="files-container">
        {files.length === 0 ? (
          <div className="empty-state">
            {loading ? "Loading..." : "No files yet."}
          </div>
        ) : (
          <div className="files-grid">
            {files.map((f) => (
              <a
                key={f.name}
                href={`/api/files/${encodeURIComponent(f.name)}`}
                target="_blank"
                rel="noreferrer"
                className="file-link"
              >
                <div className="file-item">
                  <div className="file-name">{f.name}</div>
                  <div className="file-size">
                    {Math.round((f.size ?? 0) / 1024)} KB
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
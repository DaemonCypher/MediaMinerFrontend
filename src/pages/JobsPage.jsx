import { useState } from "react";
import "./JobsPage.css";

/* ---------- helpers ---------- */

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? "Request failed");
  return data;
}

/* ---------- page ---------- */

export default function JobsPage() {
  const [busy, setBusy] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [error, setError] = useState("");

  /* Audio form */
  const [aUrl, setAUrl] = useState("");
  const [aFormat, setAFormat] = useState("mp3");
  const [aBitrate, setABitrate] = useState("192");
  const [aAllowPlaylist, setAAllowPlaylist] = useState(true);
  const [aPlaylistItems, setAPlaylistItems] = useState("");

  /* Video form */
  const [vUrl, setVUrl] = useState("");
  const [vContainer, setVContainer] = useState("mp4");
  const [vHeight, setVHeight] = useState("1080");
  const [vCodec, setVCodec] = useState("");
  const [vAllowPlaylist, setVAllowPlaylist] = useState(true);
  const [vPlaylistItems, setVPlaylistItems] = useState("");

  async function startAudio() {
    setBusy(true);
    setError("");
    setActiveJobId(null);

    try {
      const payload = {
        url: aUrl.trim(),
        audio_format: aFormat,
        bitrate: aBitrate,
        allow_playlist: aAllowPlaylist,
        playlist_items: aPlaylistItems.trim() || null,
      };

      const data = await postJson("/api/jobs/audio", payload);
      setActiveJobId(data.job_id);
    } catch (e) {
      setError(e.message || "Failed to start audio job");
    } finally {
      setBusy(false);
    }
  }

  async function startVideo() {
    setBusy(true);
    setError("");
    setActiveJobId(null);

    try {
      const payload = {
        url: vUrl.trim(),
        container: vContainer,
        max_height: vHeight === "none" ? null : parseInt(vHeight, 10),
        prefer_codec: vCodec.trim() || null,
        allow_playlist: vAllowPlaylist,
        playlist_items: vPlaylistItems.trim() || null,
      };

      const data = await postJson("/api/jobs/video", payload);
      setActiveJobId(data.job_id);
    } catch (e) {
      setError(e.message || "Failed to start video job");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="jobs-page">

      {error && <div className="jobs-page__error">{error}</div>}

      {activeJobId && (
        <div className="jobs-page__active">
          Active job:
          <span className="jobs-page__mono">{activeJobId}</span>
        </div>
      )}

      <div className="jobs-page__grid">
        {/* AUDIO */}
        <section className="jobs-card">
          <div className="jobs-card__header">
            <h2>Audio</h2>
          </div>

          <label>
            URL
            <input value={aUrl} onChange={(e) => setAUrl(e.target.value)} />
          </label>

          <label>
            Format
            <select value={aFormat} onChange={(e) => setAFormat(e.target.value)}>
              <option value="mp3">mp3</option>
              <option value="m4a">m4a</option>
              <option value="opus">opus</option>
              <option value="wav">wav</option>
            </select>
          </label>

          <label>
            Bitrate (kbps)
            <input value={aBitrate} onChange={(e) => setABitrate(e.target.value)} />
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={aAllowPlaylist}
              onChange={(e) => setAAllowPlaylist(e.target.checked)}
            />
            Allow playlist
          </label>

          <label>
            Playlist items (optional)
            <input
              placeholder="e.g. 1-3,5"
              value={aPlaylistItems}
              onChange={(e) => setAPlaylistItems(e.target.value)}
            />
          </label>

          <button disabled={busy || !aUrl.trim()} onClick={startAudio}>
            {busy ? "Working…" : "Start Audio Job"}
          </button>
        </section>

        {/* VIDEO */}
        <section className="jobs-card">
          <div className="jobs-card__header">
            <h2>Video</h2>
          </div>

          <label>
            URL
            <input value={vUrl} onChange={(e) => setVUrl(e.target.value)} />
          </label>

          <label>
            Container
            <select value={vContainer} onChange={(e) => setVContainer(e.target.value)}>
              <option value="mp4">mp4</option>
              <option value="mkv">mkv</option>
              <option value="webm">webm</option>
            </select>
          </label>

          <label>
            Max height
            <select value={vHeight} onChange={(e) => setVHeight(e.target.value)}>
              <option value="720">720</option>
              <option value="1080">1080</option>
              <option value="1440">1440</option>
              <option value="2160">2160</option>
              <option value="none">no limit</option>
            </select>
          </label>

          <label>
            Preferred codec (optional)
            <input value={vCodec} onChange={(e) => setVCodec(e.target.value)} />
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={vAllowPlaylist}
              onChange={(e) => setVAllowPlaylist(e.target.checked)}
            />
            Allow playlist
          </label>

          <label>
            Playlist items (optional)
            <input
              placeholder="e.g. 1-3,5"
              value={vPlaylistItems}
              onChange={(e) => setVPlaylistItems(e.target.value)}
            />
          </label>

          <button disabled={busy || !vUrl.trim()} onClick={startVideo}>
            {busy ? "Working…" : "Start Video Job"}
          </button>
        </section>
      </div>
    </div>
  );
}

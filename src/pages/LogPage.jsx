import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { wsUrlFor, getVerboseLine } from "../utils/jobWs";
import "./LogPage.css";

export default function JobLogPage() {
  const { jobId } = useParams();

  const [log, setLog] = useState("");
  const [listening, setListening] = useState(true);

  const wsRef = useRef(null);
  const keepAliveRef = useRef(null);

  function append(line) {
    if (!line) return;
    setLog((prev) => (prev + line + "\n").slice(-60000));
  }

  function cleanup() {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
  }

  useEffect(() => {
    cleanup();
    setLog("");
    setListening(true);

    if (!jobId) return;

    const ws = new WebSocket(wsUrlFor(jobId));
    wsRef.current = ws;

    ws.onopen = () => {
      append(`WS connected for job ${jobId}`);
      keepAliveRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
      }, 1500);
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        append(getVerboseLine(msg));
      } catch {
        append(String(e.data));
      }
    };

    ws.onclose = () => {
      append("WS closed");
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
      setListening(false);
    };

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return (
    <div className="joblog">
      <header className="joblog__header">
        <div className="joblog__title">
          <h1>Job Log</h1>
          <div className="joblog__meta">
            Job: <span className="joblog__mono">{jobId}</span>{" "}
            {listening ? "(listening)" : "(stopped)"}
          </div>
        </div>

        <div className="joblog__actions">
          <Link to="/jobs">
            <button className="joblog__btn joblog__btn--light">
              Back to Jobs
            </button>
          </Link>

          <button
            className="joblog__btn joblog__btn--light"
            onClick={() => setLog("")}
          >
            Clear log
          </button>

          <button
            className="joblog__btn joblog__btn--light"
            onClick={() => {
              cleanup();
              append("Stopped listening to WS.");
              setListening(false);
            }}
          >
            Stop listening
          </button>
        </div>
      </header>

      <section className="joblog__card">
        <pre className="joblog__log">{log || "No log yet."}</pre>
      </section>
    </div>
  );
}

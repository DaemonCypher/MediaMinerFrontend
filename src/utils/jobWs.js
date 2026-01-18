export function wsUrlFor(jobId) {
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}/ws/${jobId}`;
}

export function getVerboseLine(ev) {
  if (!ev) return "";

  if (ev.type === "progress") {
    const parts = [
      ev.status ?? "",
      ev.percent ?? "",
      ev.speed ?? "",
      ev.eta ? `ETA:${ev.eta}` : "",
    ];
    return parts.filter(Boolean).join(" ").trim();
  }

  if (ev.type === "status") return `STATUS: ${ev.status}`;
  if (ev.type === "error") return `ERROR: ${ev.message}`;
  if (ev.type === "snapshot") return `SNAPSHOT: ${JSON.stringify(ev.job)}`;
  if (ev.type === "heartbeat")
    return `HEARTBEAT: ${ev.status}${ev.error ? " | " + ev.error : ""}`;

  return JSON.stringify(ev);
}

const reportURL = "https://lookerstudio.google.com/embed/reporting/c2649a35-6b5f-4d1f-b1af-e3e31f837530/page/QZ2DG";

export default function AnalyticsDashboard() {
  return (
    <main style={{ margin: "0 auto", maxWidth: 1440, padding: "32px 24px", width: "100%" }}>
      <div style={{ alignItems: "flex-start", display: "flex", gap: 16, justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 8px" }}>EVRS Analytics</h1>
          <p style={{ margin: 0, opacity: 0.75 }}>
            Google Analytics reporting for EVRS. Sign in to a Google account with access to the shared report if prompted.
          </p>
        </div>
        <a
          href="/admin"
          style={{ border: "1px solid currentColor", borderRadius: 4, color: "inherit", padding: "8px 12px", textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Back to dashboard
        </a>
      </div>
      <iframe
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        src={reportURL}
        style={{ background: "white", border: 0, display: "block", height: "calc(100vh - 190px)", minHeight: 675, width: "100%" }}
        title="EVRS Google Analytics dashboard"
      />
    </main>
  );
}
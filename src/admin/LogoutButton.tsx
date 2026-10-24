"use client";

export function LogoutButton() {
  return (
    <button type="button" className="ad-btn ad-ghost" onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); window.location.reload(); }}>
      خروج
    </button>
  );
}

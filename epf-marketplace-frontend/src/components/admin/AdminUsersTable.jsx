function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(name = "Utilisateur") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");
}

function roleLabel(role) {
  const labels = {
    buyer: "Acheteur",
    seller: "Vendeur",
    admin: "Admin",
  };

  return labels[role] || role || "—";
}

function roleStyle(role) {
  if (role === "admin") {
    return { background: "#ede9fe", color: "#6d28d9" };
  }

  if (role === "seller") {
    return { background: "#dbeafe", color: "#1d4ed8" };
  }

  return { background: "#dcfce7", color: "#166534" };
}

function statusStyle(isSuspended) {
  return isSuspended
    ? { background: "#fef2f2", color: "#b91c1c" }
    : { background: "#ecfdf5", color: "#047857" };
}

function Avatar({ user }) {
  if (user?.profile_image) {
    return (
      <img
        src={user.profile_image}
        alt={user.name || user.email || "Utilisateur"}
        style={{ width: 44, height: 44, borderRadius: 999, objectFit: "cover", border: "1px solid #e2e8f0" }}
      />
    );
  }

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        background: "#f0fdf4",
        color: "#166534",
        fontWeight: 800,
        border: "1px solid #bbf7d0",
      }}
    >
      {getInitials(user?.name || user?.email || "U")}
    </div>
  );
}

export default function AdminUsersTable({
  users = [],
  currentUserId,
  actionUserId,
  onToggleSuspension,
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            {[
              "Utilisateur",
              "Rôle",
              "Statut",
              "Inscription",
              "Suspension",
              "Action",
            ].map((heading) => (
              <th
                key={heading}
                style={{
                  textAlign: "left",
                  padding: "14px 12px",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "#64748b",
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isCurrentUser = Number(user.id) === Number(currentUserId);
            const isSuspended = Boolean(user.suspended_at);
            const isBusy = Number(actionUserId) === Number(user.id);

            return (
              <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px 12px", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar user={user} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{user.name || "Sans nom"}</p>
                      <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{user.email || "—"}</p>
                    </div>
                  </div>
                </td>

                <td style={{ padding: "16px 12px", verticalAlign: "middle" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 13,
                      fontWeight: 700,
                      ...roleStyle(user.role),
                    }}
                  >
                    {roleLabel(user.role)}
                  </span>
                </td>

                <td style={{ padding: "16px 12px", verticalAlign: "middle" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 13,
                      fontWeight: 700,
                      ...statusStyle(isSuspended),
                    }}
                  >
                    {isSuspended ? "Suspendu" : "Actif"}
                  </span>
                </td>

                <td style={{ padding: "16px 12px", verticalAlign: "middle", color: "#334155" }}>
                  {formatDate(user.created_at)}
                </td>

                <td style={{ padding: "16px 12px", verticalAlign: "middle", color: "#334155" }}>
                  {isSuspended ? formatDate(user.suspended_at) : "—"}
                </td>

                <td style={{ padding: "16px 12px", verticalAlign: "middle" }}>
                  <button
                    type="button"
                    disabled={isCurrentUser || isBusy}
                    onClick={() => onToggleSuspension(user)}
                    style={{
                      border: "none",
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontWeight: 700,
                      cursor: isCurrentUser || isBusy ? "not-allowed" : "pointer",
                      opacity: isCurrentUser || isBusy ? 0.6 : 1,
                      background: isSuspended ? "#dcfce7" : "#fee2e2",
                      color: isSuspended ? "#166534" : "#991b1b",
                    }}
                  >
                    {isCurrentUser
                      ? "Compte courant"
                      : isBusy
                        ? "Traitement..."
                        : isSuspended
                          ? "Réactiver"
                          : "Suspendre"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

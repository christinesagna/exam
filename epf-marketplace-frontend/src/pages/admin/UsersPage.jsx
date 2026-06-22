import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/adminService";

const ROLE_OPTIONS = [
  { value: "", label: "Tous les rôles" },
  { value: "buyer", label: "Acheteurs" },
  { value: "seller", label: "Vendeurs" },
  { value: "admin", label: "Administrateurs" },
];

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [filters, setFilters] = useState({ role: "", perPage: 10, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionUserId, setActionUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await adminService.getUsers({
        page: filters.page,
        perPage: filters.perPage,
        role: filters.role,
      });

      setUsers(payload.users);
      setPagination(payload.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Impossible de charger la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.perPage, filters.role]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;
    setFilters((current) => ({ ...current, role: nextRole, page: 1 }));
  };

  const handlePerPageChange = (event) => {
    const nextPerPage = Number(event.target.value);
    setFilters((current) => ({ ...current, perPage: nextPerPage, page: 1 }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    setFilters((current) => ({ ...current, page }));
  };

  const handleToggleSuspension = async (targetUser) => {
    try {
      setActionUserId(targetUser.id);

      if (targetUser.suspended_at) {
        const response = await adminService.activateUser(targetUser.id);
        toast.success(response?.message || "Compte réactivé.");
      } else {
        const response = await adminService.suspendUser(targetUser.id);
        toast.success(response?.message || "Utilisateur suspendu.");
      }

      await loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "L'action a échoué.");
    } finally {
      setActionUserId(null);
    }
  };

  const pageLabel = useMemo(() => {
    if (!pagination.total) return "0 utilisateur";
    return `${pagination.total} utilisateur${pagination.total > 1 ? "s" : ""}`;
  }, [pagination.total]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1>Gestion des utilisateurs</h1>
        </div>

        <button type="button" className="outline-button" onClick={loadUsers}>
          Recharger
        </button>
      </div>

      <div className="app-card" style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            alignItems: "end",
          }}
        >
          <label className="form-field">
            <span>Filtre rôle</span>
            <select className="form-input" value={filters.role} onChange={handleRoleChange}>
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Éléments par page</span>
            <select className="form-input" value={filters.perPage} onChange={handlePerPageChange}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="form-field">
            <span>Résultat</span>
            <div
              style={{
                minHeight: 46,
                borderRadius: 10,
                padding: "12px 14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              {pageLabel}
            </div>
          </div>
        </div>
      </div>

      {loading ? <Loader text="Chargement des utilisateurs..." /> : null}
      {!loading ? <ErrorMessage message={error} /> : null}

      {!loading && !error && users.length === 0 ? (
        <EmptyState
          title="Aucun utilisateur trouvé"
          description="Aucun compte ne correspond au filtre sélectionné pour le moment."
          actionLabel="Réinitialiser"
          actionTo="/admin/users"
        />
      ) : null}

      {!loading && !error && users.length > 0 ? (
        <div className="app-card" style={{ display: "grid", gap: 18 }}>
          <AdminUsersTable
            users={users}
            currentUserId={user?.id}
            actionUserId={actionUserId}
            onToggleSuspension={handleToggleSuspension}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <p style={{ margin: 0, color: "#64748b" }}>
              Page {pagination.current_page} sur {pagination.last_page}
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                className="outline-button"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                style={{ opacity: filters.page <= 1 ? 0.5 : 1 }}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Précédent
              </button>
              <button
                type="button"
                className="outline-button"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pagination.last_page}
                style={{ opacity: filters.page >= pagination.last_page ? 0.5 : 1 }}
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

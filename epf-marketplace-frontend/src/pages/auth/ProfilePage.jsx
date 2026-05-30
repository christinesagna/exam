import { useAuth } from '../../hooks/useAuth';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Mon profil</h1>
      <p><strong>Nom :</strong> {user?.name}</p>
      <p><strong>Email :</strong> {user?.email}</p>
      <p><strong>Rôle :</strong> {user?.role}</p>
    </div>
  );
}

export default ProfilePage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setApiError('');
      await login(values);
      navigate('/profile');
    } catch (error) {
      const status = error?.response?.status;

      if (status === 403) {
        setApiError("Vous n’avez pas les droits ou votre compte est suspendu.");
      } else {
        setApiError("Identifiants invalides.");
      }
    }
  };

  return (
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Saliou@exemple.com"
          error={errors.email?.message}
          {...register("email")}
        />
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            {...register('password', {
              required: 'Mot de passe requis',
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {apiError && <p>{apiError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

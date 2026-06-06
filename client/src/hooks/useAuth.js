import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.login(data).then((r) => r.data.data),
    onSuccess: ({ user, access_token, refresh_token }) => {
      login(user, access_token, refresh_token);
      const roleRedirects = {
        VENDOR: '/rfq',
        MANAGER: '/approvals',
        ADMIN: '/dashboard',
        PROCUREMENT_OFFICER: '/dashboard',
      };
      navigate(roleRedirects[user.role] ?? '/dashboard', { replace: true });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Login failed');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => authApi.register(data).then((r) => r.data.data),
    onSuccess: () => {
      toast.success('Account created — please sign in');
      navigate('/login');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Registration failed');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => authApi.forgotPassword(email),
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Request failed');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully');
      navigate('/login');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Reset failed');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return () => {
    authApi.logout().catch(() => {});
    logout();
    navigate('/login', { replace: true });
  };
}

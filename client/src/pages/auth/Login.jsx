import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const { mutate: login, isPending } = useLogin();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[32px] text-primary-container">hub</span>
            <span className="text-headline-lg text-text-primary font-bold">VendorBridge</span>
          </div>
          <p className="text-body-md text-text-secondary">Sign in to your account</p>
        </div>
        <div className="bg-surface border border-border-subtle rounded-lg p-8">
          <form onSubmit={handleSubmit((d) => login(d))} className="flex flex-col gap-5">
            <Input label="Email" type="email" placeholder="you@company.com" icon="mail"
              error={errors.email?.message} {...register('email')} />
            <div className="flex flex-col gap-1">
              <label className="text-label-caps text-text-secondary uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  className={`w-full bg-surface-variant/50 border border-border-subtle rounded h-[40px] px-3 pr-10 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-secondary-container transition-colors ${errors.password ? 'border-accent-red' : ''}`}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                  <span className="material-symbols-outlined text-[18px]">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-accent-red">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-body-sm text-secondary-container hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" loading={isPending} className="w-full justify-center">Sign In</Button>
          </form>
        </div>
        <p className="text-center text-body-sm text-text-secondary mt-6">
          New to VendorBridge?{' '}
          <Link to="/register" className="text-secondary-container hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}

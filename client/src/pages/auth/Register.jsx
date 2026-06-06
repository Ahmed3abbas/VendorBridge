import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR']),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ROLE_OPTIONS = [
  { value: 'PROCUREMENT_OFFICER', label: 'Procurement Officer' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'VENDOR', label: 'Vendor' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function RegisterPage() {
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' });

  const { mutate: submitRegister, isPending } = useRegister();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[32px] text-primary-container">hub</span>
            <span className="text-headline-lg text-text-primary font-bold">VendorBridge</span>
          </div>
          <p className="text-body-md text-text-secondary">Create your account</p>
        </div>

        <div className="bg-surface border border-border-subtle rounded-lg p-8">
          <form onSubmit={handleSubmit(d => submitRegister(d))} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="John Doe" icon="person"
              error={errors.name?.message} {...field('name')} />
            <Input label="Email" type="email" placeholder="you@company.com" icon="mail"
              error={errors.email?.message} {...field('email')} />
            <Input label="Password" type="password" placeholder="Min 8 characters"
              error={errors.password?.message} {...field('password')} />
            <Input label="Confirm Password" type="password" placeholder="Repeat password"
              error={errors.confirmPassword?.message} {...field('confirmPassword')} />
            <Select label="Role" placeholder="Select role" options={ROLE_OPTIONS}
              error={errors.role?.message} {...field('role')} />
            <Button type="submit" loading={isPending} className="w-full justify-center mt-2">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-body-sm text-text-secondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary-container hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

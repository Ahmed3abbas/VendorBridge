import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useForgotPassword, useResetPassword } from '../../hooks/useAuth';
import StepperProgress from '../../components/StepperProgress';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const STEPS = ['Email', 'OTP', 'New Password'];

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const { register: r1, handleSubmit: h1, formState: { errors: e1 } } = useForm();
  const { register: r2, handleSubmit: h2, formState: { errors: e2 } } = useForm();
  const { register: r3, handleSubmit: h3, formState: { errors: e3 } } = useForm();
  const { mutate: forgot, isPending: p1 } = useForgotPassword();
  const { mutate: reset, isPending: p3 } = useResetPassword();

  function submitEmail({ email: em }) {
    setEmail(em);
    forgot(em, { onSuccess: () => setStep(1) });
  }

  function submitOTP({ otp }) {
    setStep(2);
    window._otp = otp;
  }

  function submitPassword({ password }) {
    reset({ email, otp: window._otp, password });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <span className="text-headline-lg text-text-primary font-bold">VendorBridge</span>
          <p className="text-body-md text-text-secondary mt-1">Reset your password</p>
        </div>
        <div className="bg-surface border border-border-subtle rounded-lg p-8">
          <StepperProgress steps={STEPS} current={step} />
          {step === 0 && (
            <form onSubmit={h1(submitEmail)} className="flex flex-col gap-4">
              <p className="text-body-sm text-text-secondary">Enter your email to receive an OTP.</p>
              <Input label="Email" type="email" placeholder="you@company.com" icon="mail"
                error={e1.email?.message} {...r1('email', { required: 'Required' })} />
              <Button type="submit" loading={p1} className="w-full justify-center">Send OTP</Button>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={h2(submitOTP)} className="flex flex-col gap-4">
              <p className="text-body-sm text-text-secondary">Enter the OTP sent to <strong className="text-text-primary">{email}</strong></p>
              <Input label="OTP Code" placeholder="6-digit code" icon="pin"
                error={e2.otp?.message} {...r2('otp', { required: 'Required' })} />
              <Button type="submit" className="w-full justify-center">Verify OTP</Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={h3(submitPassword)} className="flex flex-col gap-4">
              <Input label="New Password" type="password" placeholder="Min 8 characters"
                error={e3.password?.message} {...r3('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} />
              <Button type="submit" loading={p3} className="w-full justify-center">Set New Password</Button>
            </form>
          )}
        </div>
        <p className="text-center text-body-sm text-text-secondary mt-6">
          <Link to="/login" className="text-secondary-container hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

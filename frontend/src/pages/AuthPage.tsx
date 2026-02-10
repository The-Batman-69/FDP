import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().optional(),
  designation: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export const AuthPage = ({ mode }: { mode: 'login' | 'signup' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login' ? { email: values.email, password: values.password } : values;
      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Unable to continue. Please try again.');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-white/40 bg-white/85 p-6 shadow-xl backdrop-blur">
      <h2 className="mb-1 text-2xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Create Participant Account'}</h2>
      <p className="mb-4 text-sm text-slate-500">Secure sign-in for FDP management portal.</p>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'signup' && <input className="w-full rounded-xl border p-2.5" placeholder="Name" {...register('name')} />}
        <input className="w-full rounded-xl border p-2.5" placeholder="Email" {...register('email')} />
        <input type="password" className="w-full rounded-xl border p-2.5" placeholder="Password" {...register('password')} />
        {mode === 'signup' && (
          <>
            <input className="w-full rounded-xl border p-2.5" placeholder="Department" {...register('department')} />
            <input className="w-full rounded-xl border p-2.5" placeholder="Designation" {...register('designation')} />
          </>
        )}

        {(errors.email?.message || errors.password?.message || serverError) && (
          <p className="text-sm text-red-600">{errors.email?.message || errors.password?.message || serverError}</p>
        )}

        <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </Button>
      </form>
    </div>
  );
};

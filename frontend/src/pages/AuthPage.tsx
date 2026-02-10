import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().optional(),
  designation: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export const AuthPage = ({ mode }: { mode: 'login' | 'signup' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
    const payload = mode === 'login' ? { email: values.email, password: values.password } : values;
    const { data } = await api.post(endpoint, payload);
    login(data.token, data.user);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">{mode === 'login' ? 'Login' : 'Signup'}</h2>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'signup' && <input className="w-full rounded border p-2" placeholder="Name" {...register('name')} />}
        <input className="w-full rounded border p-2" placeholder="Email" {...register('email')} />
        <input type="password" className="w-full rounded border p-2" placeholder="Password" {...register('password')} />
        {mode === 'signup' && (
          <>
            <input className="w-full rounded border p-2" placeholder="Department" {...register('department')} />
            <input className="w-full rounded border p-2" placeholder="Designation" {...register('designation')} />
          </>
        )}
        <p className="text-sm text-red-600">{errors.email?.message || errors.password?.message}</p>
        <Button type="submit" className="w-full">
          {mode === 'login' ? 'Login' : 'Create account'}
        </Button>
      </form>
    </div>
  );
};

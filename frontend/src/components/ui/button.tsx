import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50',
      className
    )}
    {...props}
  />
);

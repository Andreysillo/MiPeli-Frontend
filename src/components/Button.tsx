import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'google';
  size?: 'md' | 'sm';
  block?: boolean;
  icon?: ReactNode;
};

export default function Button({ variant = 'primary', size = 'md', block, icon, className = '', children, ...rest }: Props) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', block && 'btn-block', className].filter(Boolean).join(' ');
  return <button type="button" className={cls} {...rest}>{icon}{children}</button>;
}

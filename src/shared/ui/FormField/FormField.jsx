import { cn } from '@/shared/lib/utils';
import s from './FormField.module.css';

export function inputClassName(hasError, extra) {
  return cn(s.input, hasError && s.inputError, extra);
}

export default function FormField({ label, icon, error, children }) {
  return (
    <div className={s.wrapper}>
      <label className={s.label}>{label}</label>
      <div className={s.inputWrap}>
        {icon}
        {children}
      </div>
      {error && <p className={s.error}>{error}</p>}
    </div>
  );
}

import { cn } from '@/utils/cn';

export function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-card/50 px-4 py-2 text-sm text-foreground',
        'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
        'transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

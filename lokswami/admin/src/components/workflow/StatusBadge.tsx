import { ArticleStatus, statusLabels, statusColors } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ArticleStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusColors[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'won' | 'lost' | 'returned';
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30',
  },
  won: {
    label: 'Ganhou',
    icon: CheckCircle,
    className: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
  },
  lost: {
    label: 'Perdeu',
    icon: XCircle,
    className: 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30',
  },
  returned: {
    label: 'Devolvido',
    icon: RotateCcw,
    className: 'bg-neutral/20 text-neutral border-neutral/30 hover:bg-neutral/30',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        'status-badge flex items-center gap-1.5 px-3 py-1.5 font-medium',
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
};
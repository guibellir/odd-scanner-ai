import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { BetData } from '@/types/betting';
import { Calendar, TrendingUp, DollarSign, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BetCardProps {
  bet: BetData;
  onStatusChange: (betId: string, status: BetData['status']) => void;
  onEdit: (bet: BetData) => void;
}

export const BetCard: React.FC<BetCardProps> = ({ bet, onStatusChange, onEdit }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatOdds = (odds: number) => {
    return odds.toFixed(2);
  };

  return (
    <Card className="p-6 hover:shadow-card transition-all duration-300 hover:bg-card-hover group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {bet.bettingHouse.name}
            </h3>
            <p className="text-muted-foreground text-sm">{bet.betType}</p>
          </div>
          <StatusBadge status={bet.status} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Target className="w-4 h-4" />
              <span>Odd</span>
            </div>
            <p className="font-bold text-lg text-primary">{formatOdds(bet.odds)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Valor</span>
            </div>
            <p className="font-bold text-lg">{formatCurrency(bet.amount)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Lucro Potencial</span>
            </div>
            <p className="font-bold text-lg text-success">{formatCurrency(bet.potentialProfit)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>Data do Jogo</span>
            </div>
            <p className="font-medium text-sm">
              {format(bet.gameDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => onEdit(bet)}>
            Editar
          </Button>
          
          {bet.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(bet.id, 'won')}
                className="text-success hover:bg-success/10 hover:border-success/30"
              >
                Marcar como Ganhou
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(bet.id, 'lost')}
                className="text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              >
                Marcar como Perdeu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(bet.id, 'returned')}
                className="text-neutral hover:bg-neutral/10 hover:border-neutral/30"
              >
                Devolvido
              </Button>
            </>
          )}
          
          {bet.status !== 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(bet.id, 'pending')}
              className="text-warning hover:bg-warning/10 hover:border-warning/30"
            >
              Reverter para Pendente
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
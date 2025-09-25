import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { BetPair, BetData } from '@/types/betting';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Trophy,
  Clock,
  Percent,
  Flag
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BetPairCardProps {
  betPair: BetPair;
  onResolve: (pairId: string, winningBetIndex: 0 | 1) => void;
  onEdit: (betPair: BetPair) => void;
}

export const BetPairCard: React.FC<BetPairCardProps> = ({ betPair, onResolve, onEdit }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'BR': '🇧🇷',
      'UK': '🇬🇧',
      'US': '🇺🇸',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
    };
    return flags[country] || '🏁';
  };

  return (
    <Card className="p-6 hover:shadow-card transition-all duration-300 hover:bg-card-hover group">
      <div className="space-y-6">
        {/* Header com informações do jogo */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {betPair.matchInfo.teams}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Trophy className="w-4 h-4" />
                <span>{betPair.matchInfo.sport}</span>
                <span>•</span>
                <span>{betPair.matchInfo.league}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>{format(betPair.matchInfo.eventDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-success" />
                <span className="text-2xl font-bold text-success">
                  {formatPercentage(betPair.profitPercentage)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">ROI: {formatPercentage(betPair.roi)}</p>
              <p className="text-xs text-muted-foreground">Via {betPair.matchInfo.platform}</p>
            </div>
          </div>
        </div>

        {/* Cards das duas apostas lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {betPair.bets.map((bet, index) => (
            <div 
              key={bet.id} 
              className={`p-4 rounded-lg border transition-all ${
                bet.status === 'won' 
                  ? 'border-success/50 bg-success/10' 
                  : bet.status === 'lost'
                  ? 'border-destructive/50 bg-destructive/10'
                  : 'border-border bg-card/50'
              }`}
            >
              <div className="space-y-3">
                {/* Casa de aposta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {bet.bettingHouse.name}
                    </span>
                    {bet.bettingHouse.country && (
                      <span className="text-xs">
                        {getCountryFlag(bet.bettingHouse.country)}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={bet.status} className="scale-75" />
                </div>

                {/* Tipo de aposta e odd */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">{bet.betType}</p>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-muted-foreground" />
                      <span className="text-lg font-bold">{bet.odds.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Aposta</span>
                    </div>
                    <p className="font-semibold">{formatCurrency(bet.amount)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Lucro</span>
                    </div>
                    <p className="font-semibold text-success">{formatCurrency(bet.actualProfit)}</p>
                  </div>
                </div>

                {/* Botões de resolução para apostas pendentes */}
                {betPair.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResolve(betPair.id, index as 0 | 1)}
                      className="flex-1 text-success hover:bg-success/10 hover:border-success/30"
                    >
                      Esta Ganhou
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo financeiro */}
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <p className="font-bold text-lg">{formatCurrency(betPair.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro Esperado</p>
              <p className="font-bold text-lg text-success">{formatCurrency(betPair.expectedProfit)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex justify-center">
                {betPair.status === 'pending' ? (
                  <div className="flex items-center gap-1 text-warning">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Pendente</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-success">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Resolvida</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => onEdit(betPair)}>
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
};
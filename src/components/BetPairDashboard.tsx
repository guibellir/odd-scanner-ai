import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetPairCard } from './BetPairCard';
import { BetPairEditModal } from './BetPairEditModal';
import { StatusBadge } from './StatusBadge';
import { BetPair } from '@/types/betting';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  Calendar,
  BarChart3,
  Trophy,
  Percent
} from 'lucide-react';

interface BetPairDashboardProps {
  betPairs: BetPair[];
  onUpdateBetPair: (pairId: string, updates: Partial<BetPair>) => void;
  onResolveBetPair: (pairId: string, winningBetIndex: 0 | 1) => void;
}

export const BetPairDashboard: React.FC<BetPairDashboardProps> = ({ 
  betPairs, 
  onUpdateBetPair, 
  onResolveBetPair 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingBetPair, setEditingBetPair] = useState<BetPair | null>(null);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalPairs = betPairs.length;
    const pendingPairs = betPairs.filter(pair => pair.status === 'pending').length;
    const resolvedPairs = betPairs.filter(pair => pair.status === 'resolved').length;
    
    const totalInvested = betPairs.reduce((sum, pair) => sum + pair.totalAmount, 0);
    const totalExpectedProfit = betPairs.reduce((sum, pair) => sum + pair.expectedProfit, 0);
    const totalActualProfit = betPairs
      .filter(pair => pair.status === 'resolved')
      .reduce((sum, pair) => sum + pair.actualProfit, 0);
    
    const averageROI = totalPairs > 0 
      ? betPairs.reduce((sum, pair) => sum + pair.roi, 0) / totalPairs 
      : 0;
    
    const averageProfitPercentage = totalPairs > 0 
      ? betPairs.reduce((sum, pair) => sum + pair.profitPercentage, 0) / totalPairs 
      : 0;
    
    return {
      totalPairs,
      pendingPairs,
      resolvedPairs,
      totalInvested,
      totalExpectedProfit,
      totalActualProfit,
      averageROI,
      averageProfitPercentage,
    };
  }, [betPairs]);

  // Filter bet pairs
  const filteredBetPairs = React.useMemo(() => {
    return betPairs.filter(pair => {
      const matchesSearch = pair.matchInfo.teams.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pair.matchInfo.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pair.matchInfo.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pair.bets.some(bet => bet.bettingHouse.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || pair.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [betPairs, searchTerm, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const handleEditBetPair = (betPair: BetPair) => {
    setEditingBetPair(betPair);
  };

  const handleSaveBetPair = (updates: Partial<BetPair>) => {
    if (editingBetPair) {
      onUpdateBetPair(editingBetPair.id, updates);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Surebets</p>
              <p className="text-2xl font-bold">{stats.totalPairs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <Percent className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro Médio</p>
              <p className="text-2xl font-bold text-success">{formatPercentage(stats.averageProfitPercentage)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROI Médio</p>
              <p className="text-2xl font-bold text-primary">{formatPercentage(stats.averageROI)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por times, esporte, liga ou casa de aposta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="resolved">Resolvidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bet Pairs Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all" className="flex items-center gap-2">
            Todas ({stats.totalPairs})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pendentes ({stats.pendingPairs})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            Resolvidas ({stats.resolvedPairs})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <BetPairGrid 
            betPairs={filteredBetPairs} 
            onResolve={onResolveBetPair} 
            onEdit={handleEditBetPair} 
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <BetPairGrid 
            betPairs={filteredBetPairs.filter(pair => pair.status === 'pending')} 
            onResolve={onResolveBetPair} 
            onEdit={handleEditBetPair} 
          />
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4">
          <BetPairGrid 
            betPairs={filteredBetPairs.filter(pair => pair.status === 'resolved')} 
            onResolve={onResolveBetPair} 
            onEdit={handleEditBetPair} 
          />
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <BetPairEditModal
        isOpen={!!editingBetPair}
        onClose={() => setEditingBetPair(null)}
        initialData={editingBetPair || undefined}
        onSave={handleSaveBetPair}
        title="Editar Surebet"
      />
    </div>
  );
};

// Grid component for better organization
const BetPairGrid: React.FC<{
  betPairs: BetPair[];
  onResolve: (pairId: string, winningBetIndex: 0 | 1) => void;
  onEdit: (betPair: BetPair) => void;
}> = ({ betPairs, onResolve, onEdit }) => {
  if (betPairs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">Nenhuma surebet encontrada</h3>
            <p className="text-sm text-muted-foreground">
              Carregue uma imagem de comprovante para começar
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {betPairs.map((betPair) => (
        <BetPairCard 
          key={betPair.id} 
          betPair={betPair} 
          onResolve={onResolve} 
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
};
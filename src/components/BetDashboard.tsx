import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetCard } from './BetCard';
import { BetEditModal } from './BetEditModal';
import { StatusBadge } from './StatusBadge';
import { BetData } from '@/types/betting';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';

interface BetDashboardProps {
  bets: BetData[];
  onUpdateBet: (betId: string, updates: Partial<BetData>) => void;
  onStatusChange: (betId: string, status: BetData['status']) => void;
}

export const BetDashboard: React.FC<BetDashboardProps> = ({ 
  bets, 
  onUpdateBet, 
  onStatusChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingBet, setEditingBet] = useState<BetData | null>(null);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalBets = bets.length;
    const pendingBets = bets.filter(bet => bet.status === 'pending').length;
    const wonBets = bets.filter(bet => bet.status === 'won').length;
    const lostBets = bets.filter(bet => bet.status === 'lost').length;
    const returnedBets = bets.filter(bet => bet.status === 'returned').length;
    
    const totalInvested = bets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalWon = bets
      .filter(bet => bet.status === 'won')
      .reduce((sum, bet) => sum + bet.potentialProfit, 0);
    const totalLost = bets
      .filter(bet => bet.status === 'lost')
      .reduce((sum, bet) => sum + bet.amount, 0);
    const totalReturned = bets
      .filter(bet => bet.status === 'returned')
      .reduce((sum, bet) => sum + bet.amount, 0);
    
    const netProfit = totalWon - totalLost;
    const winRate = totalBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 : 0;
    
    return {
      totalBets,
      pendingBets,
      wonBets,
      lostBets,
      returnedBets,
      totalInvested,
      totalWon,
      totalLost,
      totalReturned,
      netProfit,
      winRate,
    };
  }, [bets]);

  // Filter bets
  const filteredBets = React.useMemo(() => {
    return bets.filter(bet => {
      const matchesSearch = bet.bettingHouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bet.betType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bet.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bets, searchTerm, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleEditBet = (bet: BetData) => {
    setEditingBet(bet);
  };

  const handleSaveBet = (updates: Partial<BetData>) => {
    if (editingBet) {
      onUpdateBet(editingBet.id, updates);
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
              <p className="text-sm text-muted-foreground">Total de Apostas</p>
              <p className="text-2xl font-bold">{stats.totalBets}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Vitória</p>
              <p className="text-2xl font-bold text-success">{stats.winRate.toFixed(1)}%</p>
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
            <div className={`p-2 rounded-lg ${stats.netProfit >= 0 ? 'bg-success/20' : 'bg-destructive/20'}`}>
              <BarChart3 className={`w-5 h-5 ${stats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(stats.netProfit)}
              </p>
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
                placeholder="Buscar por casa de aposta ou tipo de aposta..."
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
              <SelectItem value="won">Ganhou</SelectItem>
              <SelectItem value="lost">Perdeu</SelectItem>
              <SelectItem value="returned">Devolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bets Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            Todas ({stats.totalBets})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <StatusBadge status="pending" className="scale-75" />
            ({stats.pendingBets})
          </TabsTrigger>
          <TabsTrigger value="won" className="flex items-center gap-2">
            <StatusBadge status="won" className="scale-75" />
            ({stats.wonBets})
          </TabsTrigger>
          <TabsTrigger value="lost" className="flex items-center gap-2">
            <StatusBadge status="lost" className="scale-75" />
            ({stats.lostBets})
          </TabsTrigger>
          <TabsTrigger value="returned" className="flex items-center gap-2">
            <StatusBadge status="returned" className="scale-75" />
            ({stats.returnedBets})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <BetGrid 
            bets={filteredBets} 
            onStatusChange={onStatusChange} 
            onEdit={handleEditBet} 
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <BetGrid 
            bets={filteredBets.filter(bet => bet.status === 'pending')} 
            onStatusChange={onStatusChange} 
            onEdit={handleEditBet} 
          />
        </TabsContent>
        
        <TabsContent value="won" className="space-y-4">
          <BetGrid 
            bets={filteredBets.filter(bet => bet.status === 'won')} 
            onStatusChange={onStatusChange} 
            onEdit={handleEditBet} 
          />
        </TabsContent>
        
        <TabsContent value="lost" className="space-y-4">
          <BetGrid 
            bets={filteredBets.filter(bet => bet.status === 'lost')} 
            onStatusChange={onStatusChange} 
            onEdit={handleEditBet} 
          />
        </TabsContent>
        
        <TabsContent value="returned" className="space-y-4">
          <BetGrid 
            bets={filteredBets.filter(bet => bet.status === 'returned')} 
            onStatusChange={onStatusChange} 
            onEdit={handleEditBet} 
          />
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <BetEditModal
        isOpen={!!editingBet}
        onClose={() => setEditingBet(null)}
        initialData={editingBet || undefined}
        onSave={handleSaveBet}
        title="Editar Aposta"
      />
    </div>
  );
};

// Grid component for better organization
const BetGrid: React.FC<{
  bets: BetData[];
  onStatusChange: (betId: string, status: BetData['status']) => void;
  onEdit: (bet: BetData) => void;
}> = ({ bets, onStatusChange, onEdit }) => {
  if (bets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">Nenhuma aposta encontrada</h3>
            <p className="text-sm text-muted-foreground">
              Carregue uma imagem de comprovante para começar
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bets.map((bet) => (
        <BetCard 
          key={bet.id} 
          bet={bet} 
          onStatusChange={onStatusChange} 
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
};
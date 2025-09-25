import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BetData, OCRExtractedData } from '@/types/betting';
import { cn } from '@/lib/utils';

interface BetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BetData> | OCRExtractedData;
  onSave: (betData: Partial<BetData>) => void;
  title?: string;
}

export const BetEditModal: React.FC<BetEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  title = 'Editar Aposta'
}) => {
  const [formData, setFormData] = useState({
    bettingHouse: typeof initialData?.bettingHouse === 'string' 
      ? initialData.bettingHouse 
      : (initialData as BetData)?.bettingHouse?.name || '',
    betType: initialData?.betType || '',
    odds: typeof initialData?.odds === 'string' ? initialData.odds : initialData?.odds?.toString() || '',
    amount: typeof initialData?.amount === 'string' ? initialData.amount : initialData?.amount?.toString() || '',
    potentialProfit: typeof initialData?.potentialProfit === 'string' ? initialData.potentialProfit : initialData?.potentialProfit?.toString() || '',
    gameDate: (initialData as BetData)?.gameDate || new Date(),
  });
  
  const [showCalendar, setShowCalendar] = useState(false);

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const betData: Partial<BetData> = {
      bettingHouse: {
        id: formData.bettingHouse.toLowerCase().replace(/\s+/g, '-'),
        name: formData.bettingHouse,
      },
      betType: formData.betType,
      odds: parseFloat(formData.odds) || 0,
      amount: parseFloat(formData.amount) || 0,
      potentialProfit: parseFloat(formData.potentialProfit) || 0,
      gameDate: formData.gameDate,
    };
    
    onSave(betData);
    onClose();
  };

  React.useEffect(() => {
    if (initialData) {
      const bettingHouseName = typeof initialData.bettingHouse === 'string' 
        ? initialData.bettingHouse 
        : (initialData as BetData).bettingHouse?.name || '';
        
      setFormData({
        bettingHouse: bettingHouseName,
        betType: initialData.betType || '',
        odds: typeof initialData.odds === 'string' ? initialData.odds : initialData.odds?.toString() || '',
        amount: typeof initialData.amount === 'string' ? initialData.amount : initialData.amount?.toString() || '',
        potentialProfit: typeof initialData.potentialProfit === 'string' ? initialData.potentialProfit : initialData.potentialProfit?.toString() || '',
        gameDate: (initialData as BetData)?.gameDate || new Date(),
      });
    }
  }, [initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Revise e corrija as informações extraídas da imagem se necessário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bettingHouse">Casa de Aposta</Label>
              <Input
                id="bettingHouse"
                value={formData.bettingHouse}
                onChange={(e) => handleInputChange('bettingHouse', e.target.value)}
                placeholder="Ex: Bet365, Betano..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="betType">Tipo de Aposta</Label>
              <Input
                id="betType"
                value={formData.betType}
                onChange={(e) => handleInputChange('betType', e.target.value)}
                placeholder="Ex: 1x2, Ambas Marcam..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odds">Odd</Label>
              <Input
                id="odds"
                type="number"
                step="0.01"
                value={formData.odds}
                onChange={(e) => handleInputChange('odds', e.target.value)}
                placeholder="2.50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="100.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="potentialProfit">Lucro Potencial (R$)</Label>
              <Input
                id="potentialProfit"
                type="number"
                step="0.01"
                value={formData.potentialProfit}
                onChange={(e) => handleInputChange('potentialProfit', e.target.value)}
                placeholder="250.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data e Horário do Jogo</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !formData.gameDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.gameDate ? (
                    format(formData.gameDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={formData.gameDate}
                  onSelect={(date) => {
                    if (date) {
                      handleInputChange('gameDate', date);
                      setShowCalendar(false);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Aposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
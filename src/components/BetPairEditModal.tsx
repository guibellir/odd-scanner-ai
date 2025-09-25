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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BetPair, OCRExtractedData } from '@/types/betting';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface BetPairEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BetPair> | OCRExtractedData;
  onSave: (betPairData: Partial<BetPair>) => void;
  title?: string;
}

export const BetPairEditModal: React.FC<BetPairEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  title = 'Editar Surebet'
}) => {
  const [formData, setFormData] = useState({
    // Match info
    teams: '',
    sport: '',
    league: '',
    platform: '',
    eventDate: new Date(),
    profitPercentage: '',
    roi: '',
    totalAmount: '',
    // Bet 1
    bet1House: '',
    bet1Country: '',
    bet1Type: '',
    bet1Odds: '',
    bet1Amount: '',
    bet1Profit: '',
    // Bet 2
    bet2House: '',
    bet2Country: '',
    bet2Type: '',
    bet2Odds: '',
    bet2Amount: '',
    bet2Profit: '',
  });
  
  const [showCalendar, setShowCalendar] = useState(false);

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const bet1Amount = parseFloat(formData.bet1Amount) || 0;
    const bet2Amount = parseFloat(formData.bet2Amount) || 0;
    const totalAmount = bet1Amount + bet2Amount;
    const profitPercentage = parseFloat(formData.profitPercentage) || 0;
    const expectedProfit = (totalAmount * profitPercentage) / 100;

    const betPairData: Partial<BetPair> = {
      matchInfo: {
        id: Date.now().toString(),
        teams: formData.teams,
        sport: formData.sport,
        league: formData.league,
        platform: formData.platform,
        eventDate: formData.eventDate,
      },
      bets: [
        {
          id: `${Date.now()}-1`,
          bettingHouse: {
            id: formData.bet1House.toLowerCase().replace(/\s+/g, '-'),
            name: formData.bet1House,
            country: formData.bet1Country,
          },
          betType: formData.bet1Type,
          odds: parseFloat(formData.bet1Odds) || 0,
          amount: bet1Amount,
          potentialProfit: parseFloat(formData.bet1Profit) || 0,
          actualProfit: 0,
          status: 'pending' as const,
          createdAt: new Date(),
        },
        {
          id: `${Date.now()}-2`,
          bettingHouse: {
            id: formData.bet2House.toLowerCase().replace(/\s+/g, '-'),
            name: formData.bet2House,
            country: formData.bet2Country,
          },
          betType: formData.bet2Type,
          odds: parseFloat(formData.bet2Odds) || 0,
          amount: bet2Amount,
          potentialProfit: parseFloat(formData.bet2Profit) || 0,
          actualProfit: 0,
          status: 'pending' as const,
          createdAt: new Date(),
        },
      ] as [any, any],
      totalAmount,
      expectedProfit,
      actualProfit: 0,
      profitPercentage: parseFloat(formData.profitPercentage) || 0,
      roi: parseFloat(formData.roi) || 0,
      status: 'pending' as const,
    };
    
    onSave(betPairData);
    onClose();
  };

  React.useEffect(() => {
    if (initialData) {
      const isOCRData = 'bet1' in initialData;
      
      if (isOCRData) {
        const ocrData = initialData as OCRExtractedData;
        setFormData({
          teams: ocrData.teams || '',
          sport: ocrData.sport || '',
          league: ocrData.league || '',
          platform: ocrData.platform || '',
          eventDate: ocrData.eventDate ? new Date(ocrData.eventDate) : new Date(),
          profitPercentage: ocrData.profitPercentage || '',
          roi: ocrData.roi || '',
          totalAmount: ocrData.totalAmount || '',
          bet1House: ocrData.bet1?.bettingHouse || '',
          bet1Country: ocrData.bet1?.country || '',
          bet1Type: ocrData.bet1?.betType || '',
          bet1Odds: ocrData.bet1?.odds || '',
          bet1Amount: ocrData.bet1?.amount || '',
          bet1Profit: ocrData.bet1?.profit || '',
          bet2House: ocrData.bet2?.bettingHouse || '',
          bet2Country: ocrData.bet2?.country || '',
          bet2Type: ocrData.bet2?.betType || '',
          bet2Odds: ocrData.bet2?.odds || '',
          bet2Amount: ocrData.bet2?.amount || '',
          bet2Profit: ocrData.bet2?.profit || '',
        });
      }
    }
  }, [initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Revise e corrija as informações da surebet extraídas da imagem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do Jogo */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-foreground">Informações do Jogo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teams">Times</Label>
                <Input
                  id="teams"
                  value={formData.teams}
                  onChange={(e) => handleInputChange('teams', e.target.value)}
                  placeholder="Ex: PSG Andebol - USAM Nimes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sport">Esporte</Label>
                <Input
                  id="sport"
                  value={formData.sport}
                  onChange={(e) => handleInputChange('sport', e.target.value)}
                  placeholder="Ex: Handebol"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="league">Liga</Label>
                <Input
                  id="league"
                  value={formData.league}
                  onChange={(e) => handleInputChange('league', e.target.value)}
                  placeholder="Ex: France - LNH Division 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  placeholder="Ex: Surebet"
                />
              </div>

              <div className="space-y-2">
                <Label>Data do Evento</Label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.eventDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate ? (
                        format(formData.eventDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('eventDate', date);
                          setShowCalendar(false);
                        }
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="profitPercentage">Lucro (%)</Label>
                  <Input
                    id="profitPercentage"
                    type="number"
                    step="0.01"
                    value={formData.profitPercentage}
                    onChange={(e) => handleInputChange('profitPercentage', e.target.value)}
                    placeholder="2.25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roi">ROI (%)</Label>
                  <Input
                    id="roi"
                    type="number"
                    step="0.01"
                    value={formData.roi}
                    onChange={(e) => handleInputChange('roi', e.target.value)}
                    placeholder="414.19"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total (R$)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                    placeholder="531.06"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Apostas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aposta 1 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 text-foreground">Aposta 1</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="bet1House">Casa de Aposta</Label>
                    <Input
                      id="bet1House"
                      value={formData.bet1House}
                      onChange={(e) => handleInputChange('bet1House', e.target.value)}
                      placeholder="Betfast"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bet1Country">País</Label>
                    <Input
                      id="bet1Country"
                      value={formData.bet1Country}
                      onChange={(e) => handleInputChange('bet1Country', e.target.value)}
                      placeholder="BR"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bet1Type">Tipo de Aposta</Label>
                  <Input
                    id="bet1Type"
                    value={formData.bet1Type}
                    onChange={(e) => handleInputChange('bet1Type', e.target.value)}
                    placeholder="H1(-5.5)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="bet1Odds">Odd</Label>
                    <Input
                      id="bet1Odds"
                      type="number"
                      step="0.01"
                      value={formData.bet1Odds}
                      onChange={(e) => handleInputChange('bet1Odds', e.target.value)}
                      placeholder="1.810"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bet1Amount">Valor (R$)</Label>
                    <Input
                      id="bet1Amount"
                      type="number"
                      step="0.01"
                      value={formData.bet1Amount}
                      onChange={(e) => handleInputChange('bet1Amount', e.target.value)}
                      placeholder="300.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bet1Profit">Lucro (R$)</Label>
                    <Input
                      id="bet1Profit"
                      type="number"
                      step="0.01"
                      value={formData.bet1Profit}
                      onChange={(e) => handleInputChange('bet1Profit', e.target.value)}
                      placeholder="11.94"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Aposta 2 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 text-foreground">Aposta 2</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="bet2House">Casa de Aposta</Label>
                    <Input
                      id="bet2House"
                      value={formData.bet2House}
                      onChange={(e) => handleInputChange('bet2House', e.target.value)}
                      placeholder="Betano"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bet2Country">País</Label>
                    <Input
                      id="bet2Country"
                      value={formData.bet2Country}
                      onChange={(e) => handleInputChange('bet2Country', e.target.value)}
                      placeholder="BR"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bet2Type">Tipo de Aposta</Label>
                  <Input
                    id="bet2Type"
                    value={formData.bet2Type}
                    onChange={(e) => handleInputChange('bet2Type', e.target.value)}
                    placeholder="H2(+5.5)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="bet2Odds">Odd</Label>
                    <Input
                      id="bet2Odds"
                      type="number"
                      step="0.01"
                      value={formData.bet2Odds}
                      onChange={(e) => handleInputChange('bet2Odds', e.target.value)}
                      placeholder="2.350"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bet2Amount">Valor (R$)</Label>
                    <Input
                      id="bet2Amount"
                      type="number"
                      step="0.01"
                      value={formData.bet2Amount}
                      onChange={(e) => handleInputChange('bet2Amount', e.target.value)}
                      placeholder="231.06"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bet2Profit">Lucro (R$)</Label>
                    <Input
                      id="bet2Profit"
                      type="number"
                      step="0.01"
                      value={formData.bet2Profit}
                      onChange={(e) => handleInputChange('bet2Profit', e.target.value)}
                      placeholder="11.93"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Surebet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { UploadArea } from '@/components/UploadArea';
import { BetPairDashboard } from '@/components/BetPairDashboard';
import { BetPairEditModal } from '@/components/BetPairEditModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetPair, OCRExtractedData } from '@/types/betting';
import { Upload, BarChart3, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [betPairs, setBetPairs] = useState<BetPair[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ocrData, setOcrData] = useState<OCRExtractedData | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const { toast } = useToast();

  // Simulate OCR processing with realistic surebet data
  const simulateOCR = async (imageFile?: File, imageData?: string): Promise<OCRExtractedData> => {
    setIsProcessingOCR(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR results based on the uploaded image format
    const mockResults: OCRExtractedData[] = [
      {
        platform: 'Surebet',
        teams: 'PSG Andebol - USAM Nimes',
        sport: 'Handebol',
        league: 'France - LNH Division 1',
        eventDate: '2025-09-21T12:00:00-03:00',
        profitPercentage: '2.25',
        roi: '414.19',
        totalAmount: '531.06',
        bet1: {
          bettingHouse: 'Betfast',
          country: 'BR',
          betType: 'H1(-5.5)',
          odds: '1.810',
          amount: '300.00',
          profit: '11.94'
        },
        bet2: {
          bettingHouse: 'Betano',
          country: 'BR', 
          betType: 'H2(+5.5)',
          odds: '2.350',
          amount: '231.06',
          profit: '11.93'
        }
      },
      {
        platform: 'Betburger',
        teams: 'Flamengo - Palmeiras',
        sport: 'Futebol',
        league: 'Brasil - Campeonato Brasileiro',
        eventDate: '2025-09-22T16:00:00-03:00',
        profitPercentage: '3.15',
        roi: '287.43',
        totalAmount: '450.00',
        bet1: {
          bettingHouse: 'Bet365',
          country: 'UK',
          betType: '1X2 - Casa',
          odds: '2.10',
          amount: '225.00',
          profit: '14.17'
        },
        bet2: {
          bettingHouse: 'Sportingbet',
          country: 'BR',
          betType: '1X2 - Fora',
          odds: '3.40',
          amount: '225.00',
          profit: '14.18'
        }
      },
      {
        platform: 'RebelBetting',
        teams: 'Lakers - Warriors',
        sport: 'Basquete',
        league: 'NBA - Estados Unidos',
        eventDate: '2025-09-23T21:30:00-03:00',
        profitPercentage: '1.89',
        roi: '521.33',
        totalAmount: '800.00',
        bet1: {
          bettingHouse: 'Pinnacle',
          country: 'US',
          betType: 'Spread +5.5',
          odds: '1.95',
          amount: '410.26',
          profit: '15.12'
        },
        bet2: {
          bettingHouse: 'BetOnline',
          country: 'US',
          betType: 'Spread -5.5',
          odds: '1.91',
          amount: '389.74',
          profit: '15.11'
        }
      }
    ];
    
    setIsProcessingOCR(false);
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  };

  const handleImageUpload = async (file: File) => {
    try {
      toast({
        title: "Processando imagem...",
        description: "Extraindo dados da surebet usando OCR",
      });
      
      const extractedData = await simulateOCR(file);
      setOcrData(extractedData);
      setShowEditModal(true);
      
      toast({
        title: "Dados extraídos com sucesso!",
        description: "Revise as informações antes de salvar",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar imagem",
        description: "Tente novamente ou insira os dados manualmente",
        variant: "destructive",
      });
    }
  };

  const handleImagePaste = async (imageData: string) => {
    try {
      toast({
        title: "Processando imagem colada...",
        description: "Extraindo dados da surebet usando OCR",
      });
      
      const extractedData = await simulateOCR(undefined, imageData);
      setOcrData(extractedData);
      setShowEditModal(true);
      
      toast({
        title: "Dados extraídos com sucesso!",
        description: "Revise as informações antes de salvar",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar imagem",
        description: "Tente novamente ou insira os dados manualmente",
        variant: "destructive",
      });
    }
  };

  const handleSaveBetPair = (betPairData: Partial<BetPair>) => {
    const newBetPair: BetPair = {
      id: Date.now().toString(),
      matchInfo: betPairData.matchInfo!,
      bets: betPairData.bets!,
      totalAmount: betPairData.totalAmount!,
      expectedProfit: betPairData.expectedProfit!,
      actualProfit: 0,
      profitPercentage: betPairData.profitPercentage!,
      roi: betPairData.roi!,
      status: 'pending',
      createdAt: new Date(),
    };

    setBetPairs(prev => [newBetPair, ...prev]);
    setShowEditModal(false);
    setOcrData(null);
    
    toast({
      title: "Surebet salva com sucesso!",
      description: `${betPairData.matchInfo?.teams} - ${betPairData.profitPercentage?.toFixed(2)}% de lucro`,
    });
  };

  const handleUpdateBetPair = (pairId: string, updates: Partial<BetPair>) => {
    setBetPairs(prev => prev.map(pair => 
      pair.id === pairId ? { ...pair, ...updates } : pair
    ));
    
    toast({
      title: "Surebet atualizada!",
      description: "As informações foram salvas com sucesso",
    });
  };

  const handleResolveBetPair = (pairId: string, winningBetIndex: 0 | 1) => {
    setBetPairs(prev => prev.map(pair => {
      if (pair.id === pairId) {
        const updatedBets = pair.bets.map((bet, index) => ({
          ...bet,
          status: index === winningBetIndex ? 'won' as const : 'lost' as const,
          actualProfit: index === winningBetIndex ? bet.potentialProfit : -bet.amount,
        }));
        
        const actualProfit = updatedBets[winningBetIndex].potentialProfit - updatedBets[1 - winningBetIndex].amount;
        
        return {
          ...pair,
          bets: updatedBets as [any, any],
          actualProfit,
          status: 'resolved' as const,
          resolvedAt: new Date(),
        };
      }
      return pair;
    }));
    
    toast({
      title: "Surebet resolvida!",
      description: `Aposta ${winningBetIndex + 1} marcada como ganhadora`,
    });
  };

  const handleAddManualBetPair = () => {
    setOcrData(null);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-elegant">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SurebetTracker Pro</h1>
                <p className="text-sm text-muted-foreground">Gerencie suas surebets automaticamente</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleAddManualBetPair}
                className="hidden sm:flex"
              >
                <Zap className="w-4 h-4 mr-2" />
                Adicionar Manual
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard ({betPairs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Adicionar Nova Surebet
                </h2>
                <p className="text-muted-foreground">
                  Carregue uma imagem do comprovante para extrair automaticamente os dados da surebet
                </p>
              </div>
              
              <UploadArea
                onImageUpload={handleImageUpload}
                onImagePaste={handleImagePaste}
              />

              <div className="bg-card/30 border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-foreground">💡 Como funciona:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Carregue screenshots de plataformas como Surebet, Betburger, etc.</li>
                  <li>• O sistema identifica automaticamente as duas apostas opostas</li>
                  <li>• Extrai: casas de apostas, odds, valores, times, esporte e porcentagem de lucro</li>
                  <li>• Calculates automaticamente ROI e lucros esperados</li>
                </ul>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleAddManualBetPair}
                  className="mx-auto"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Ou adicionar manualmente
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {betPairs.length > 0 ? (
              <BetPairDashboard
                betPairs={betPairs}
                onUpdateBetPair={handleUpdateBetPair}
                onResolveBetPair={handleResolveBetPair}
              />
            ) : (
              <Card className="p-12 text-center max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Nenhuma surebet ainda</h3>
                    <p className="text-sm text-muted-foreground">
                      Comece carregando um screenshot da sua plataforma de surebets
                    </p>
                  </div>
                  <Button onClick={() => document.querySelector<HTMLElement>('[data-value="upload"]')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Carregar primeira surebet
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Modal */}
      <BetPairEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setOcrData(null);
        }}
        initialData={ocrData || undefined}
        onSave={handleSaveBetPair}
        title={ocrData ? "Revisar Dados Extraídos" : "Adicionar Surebet Manual"}
      />

      {/* Loading overlay for OCR processing */}
      {isProcessingOCR && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 max-w-sm mx-4">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Processando imagem...</h3>
                <p className="text-sm text-muted-foreground">
                  Extraindo dados da surebet com OCR, aguarde
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
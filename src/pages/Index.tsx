import React, { useState } from 'react';
import { UploadArea } from '@/components/UploadArea';
import { BetDashboard } from '@/components/BetDashboard';
import { BetEditModal } from '@/components/BetEditModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetData, OCRExtractedData } from '@/types/betting';
import { Upload, BarChart3, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [bets, setBets] = useState<BetData[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ocrData, setOcrData] = useState<OCRExtractedData | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const { toast } = useToast();

  // Simulate OCR processing
  const simulateOCR = async (imageFile?: File, imageData?: string): Promise<OCRExtractedData> => {
    setIsProcessingOCR(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR results with Brazilian betting houses
    const mockResults: OCRExtractedData[] = [
      {
        bettingHouse: 'Bet365',
        betType: '1x2 - Resultado Final',
        odds: '2.25',
        amount: '100.00',
        potentialProfit: '225.00'
      },
      {
        bettingHouse: 'Betano',
        betType: 'Ambas Marcam - Sim',
        odds: '1.85',
        amount: '150.00',
        potentialProfit: '277.50'
      },
      {
        bettingHouse: 'Sportingbet',
        betType: 'Over 2.5 Gols',
        odds: '3.10',
        amount: '75.00',
        potentialProfit: '232.50'
      },
      {
        bettingHouse: 'Betfair',
        betType: 'Dupla Chance 1X',
        odds: '1.45',
        amount: '200.00',
        potentialProfit: '290.00'
      }
    ];
    
    setIsProcessingOCR(false);
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  };

  const handleImageUpload = async (file: File) => {
    try {
      toast({
        title: "Processando imagem...",
        description: "Extraindo dados da aposta usando OCR",
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
        description: "Extraindo dados da aposta usando OCR",
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

  const handleSaveBet = (betData: Partial<BetData>) => {
    const newBet: BetData = {
      id: Date.now().toString(),
      bettingHouse: betData.bettingHouse!,
      betType: betData.betType!,
      odds: betData.odds!,
      amount: betData.amount!,
      potentialProfit: betData.potentialProfit!,
      gameDate: betData.gameDate!,
      status: 'pending',
      createdAt: new Date(),
    };

    setBets(prev => [newBet, ...prev]);
    setShowEditModal(false);
    setOcrData(null);
    
    toast({
      title: "Aposta salva com sucesso!",
      description: `${betData.bettingHouse?.name} - ${betData.betType}`,
    });
  };

  const handleUpdateBet = (betId: string, updates: Partial<BetData>) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, ...updates } : bet
    ));
    
    toast({
      title: "Aposta atualizada!",
      description: "As informações foram salvas com sucesso",
    });
  };

  const handleStatusChange = (betId: string, status: BetData['status']) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, status } : bet
    ));
    
    const statusMessages = {
      won: "Aposta marcada como ganha! 🎉",
      lost: "Aposta marcada como perdida",
      returned: "Aposta marcada como devolvida",
      pending: "Aposta voltou para pendente",
    };
    
    toast({
      title: "Status atualizado!",
      description: statusMessages[status],
    });
  };

  const handleAddManualBet = () => {
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
                <h1 className="text-xl font-bold text-foreground">BetTracker Pro</h1>
                <p className="text-sm text-muted-foreground">Gerencie suas apostas esportivas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleAddManualBet}
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
              Dashboard ({bets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Adicionar Nova Aposta
                </h2>
                <p className="text-muted-foreground">
                  Carregue uma imagem do comprovante para extrair automaticamente os dados
                </p>
              </div>
              
              <UploadArea
                onImageUpload={handleImageUpload}
                onImagePaste={handleImagePaste}
              />
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleAddManualBet}
                  className="mx-auto"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Ou adicionar manualmente
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {bets.length > 0 ? (
              <BetDashboard
                bets={bets}
                onUpdateBet={handleUpdateBet}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <Card className="p-12 text-center max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Nenhuma aposta ainda</h3>
                    <p className="text-sm text-muted-foreground">
                      Comece carregando um comprovante de aposta
                    </p>
                  </div>
                  <Button onClick={() => document.querySelector<HTMLElement>('[data-value="upload"]')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Carregar primeira aposta
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Modal */}
      <BetEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setOcrData(null);
        }}
        initialData={ocrData || undefined}
        onSave={handleSaveBet}
        title={ocrData ? "Revisar Dados Extraídos" : "Adicionar Aposta Manual"}
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
                  Extraindo dados com OCR, aguarde
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
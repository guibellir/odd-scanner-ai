import React, { useCallback, useState } from 'react';
import { Upload, Image, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  onImagePaste: (imageData: string) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, onImagePaste }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImage(result);
          onImagePaste(result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImagePaste]);

  React.useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find(item => item.type.startsWith('image/'));
      
      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setUploadedImage(result);
            onImagePaste(result);
          };
          reader.readAsDataURL(file);
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [onImagePaste]);

  return (
    <Card 
      className={cn(
        "upload-area relative overflow-hidden",
        "border-2 border-dashed border-border hover:border-primary/50",
        "bg-card/50 backdrop-blur-sm",
        "p-8 text-center cursor-pointer group",
        "hover:shadow-card",
        isDragOver && "drag-over border-primary scale-105"
      )}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragOver(false);
      }}
      onPaste={handlePaste}
      tabIndex={0}
    >
      {uploadedImage ? (
        <div className="space-y-4">
          <img 
            src={uploadedImage} 
            alt="Uploaded betting slip" 
            className="max-h-64 mx-auto rounded-lg shadow-lg"
          />
          <div className="flex items-center justify-center gap-2 text-success">
            <Image className="w-5 h-5" />
            <span className="font-medium">Imagem carregada com sucesso!</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setUploadedImage(null)}
            className="mx-auto"
          >
            Carregar nova imagem
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Upload className="w-16 h-16 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <FileText className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Carregue seu comprovante de aposta
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Arraste e solte uma imagem aqui, clique para selecionar um arquivo, ou pressione <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+V</kbd> para colar
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="default" className="bg-gradient-primary hover:opacity-90">
              <Upload className="w-4 h-4 mr-2" />
              Selecionar arquivo
            </Button>
            <span className="text-muted-foreground">ou</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Cole com</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+V</kbd>
            </div>
          </div>
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </Card>
  );
};
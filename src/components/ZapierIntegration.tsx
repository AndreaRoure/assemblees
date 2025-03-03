
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ZapierIntegrationProps {
  transcription: string;
  assemblyId: string;
}

const ZapierIntegration: React.FC<ZapierIntegrationProps> = ({ 
  transcription,
  assemblyId
}) => {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSendToSheets = async () => {
    if (!webhookUrl) {
      toast.error("Cal introduir l'URL del webhook de Zapier");
      return;
    }

    setIsLoading(true);
    console.log("Enviant a Zapier:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Necessari per a webhooks externs
        body: JSON.stringify({
          assembly_id: assemblyId,
          transcription: transcription,
          timestamp: new Date().toISOString(),
          source: window.location.origin,
        }),
      });

      // Com que estem utilitzant no-cors, no podem verificar l'estat de la resposta
      toast.success("Transcripció enviada a Google Sheets via Zapier");
    } catch (error) {
      console.error("Error en enviar a Zapier:", error);
      toast.error("No s'ha pogut enviar la transcripció a Zapier. Comprova l'URL i torna-ho a provar.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="mt-2"
      >
        Configurar enviament a Google Sheets
      </Button>
    );
  }

  return (
    <Card className="p-4 mt-2">
      <h3 className="text-sm font-medium mb-2">Enviar a Google Sheets via Zapier</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Introdueix l'URL del teu webhook de Zapier per enviar aquesta transcripció a Google Sheets.
      </p>
      
      <div className="flex flex-col gap-2">
        <Input
          placeholder="URL del webhook de Zapier"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="w-full"
        />
        
        <div className="flex space-x-2">
          <Button
            onClick={handleSendToSheets}
            disabled={isLoading || !webhookUrl}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviant...
              </>
            ) : (
              "Enviar a Google Sheets"
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsVisible(false)}
            disabled={isLoading}
          >
            Cancel·lar
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Nota: Necessites crear un Zap a Zapier amb un "Webhook" com a trigger i "Google Sheets" com a acció.
        </p>
      </div>
    </Card>
  );
};

export default ZapierIntegration;

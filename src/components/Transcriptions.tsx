
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TranscriptionsProps {
  transcription: string;
}

const Transcriptions: React.FC<TranscriptionsProps> = ({ transcription }) => {
  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState(transcription);
  const [isEditing, setIsEditing] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      toast.success("Text copiat al portapapers");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("No s'ha pogut copiar el text");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      toast.success("Canvis guardats");
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Transcripció
          </h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
              className="h-8 px-2"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEditToggle}
              className="h-8 px-2"
            >
              {isEditing ? (
                <Save className="h-4 w-4" />
              ) : (
                <span className="text-xs">Editar</span>
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[200px] w-full rounded-md border p-2">
          {isEditing ? (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[180px] border-none focus-visible:ring-0 resize-none"
            />
          ) : (
            <div className="text-sm whitespace-pre-wrap">{transcription}</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Transcriptions;

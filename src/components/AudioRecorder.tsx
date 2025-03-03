
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AudioRecorderProps {
  assemblyId: string;
  onTranscriptionComplete: (text: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  assemblyId, 
  onTranscriptionComplete 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.info("Gravació iniciada");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("No s'ha pogut iniciar la gravació. Comprova els permisos del micròfon.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    processAudio();
  };

  const processAudio = async () => {
    try {
      setIsProcessing(true);
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        try {
          // Extract base64 data from the result
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (!base64Audio) {
            throw new Error("Failed to convert audio to base64");
          }
          
          // Call our Supabase Edge Function
          const { data, error } = await supabase.functions.invoke("transcribe-audio", {
            body: { audio: base64Audio }
          });
          
          if (error || !data) {
            throw new Error(error?.message || "Error during transcription");
          }
          
          if (data.text) {
            onTranscriptionComplete(data.text);
            toast.success("Transcripció completada");
          } else {
            throw new Error("No transcription returned");
          }
        } catch (err) {
          console.error('Error processing audio:', err);
          toast.error("Error en la transcripció: " + (err instanceof Error ? err.message : String(err)));
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error("Error en processar l'àudio");
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 w-full">
      <h3 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
        Gravació de l&apos;assemblea
      </h3>
      
      <div className="flex flex-col items-center space-y-4">
        {isRecording && (
          <div className="flex items-center space-x-2 text-red-500 animate-pulse">
            <Mic className="h-4 w-4" />
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Mic className="mr-2 h-4 w-4" />
              Iniciar Gravació
            </Button>
          ) : (
            <Button 
              onClick={stopRecording} 
              variant="destructive"
            >
              <Square className="mr-2 h-4 w-4" />
              Aturar Gravació
            </Button>
          )}
        </div>
        
        {isProcessing && (
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processant àudio...</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AudioRecorder;

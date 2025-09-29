import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { addSocia } from '@/lib/supabase-socias';
import { Plus } from 'lucide-react';

interface NewSociaFormData {
  nom: string;
  cognoms: string;
  genere: 'home' | 'dona' | 'trans' | 'no-binari';
}

interface NewSociaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSociaCreated: () => void;
}

export const NewSociaDialog: React.FC<NewSociaDialogProps> = ({
  open,
  onOpenChange,
  onSociaCreated
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<NewSociaFormData>({
    defaultValues: {
      nom: '',
      cognoms: '',
      genere: 'dona'
    }
  });
  const { toast } = useToast();

  const selectedGender = watch('genere');

  const onSubmit = async (data: NewSociaFormData) => {
    try {
      await addSocia(data);
      toast({
        title: "Sòcia creada",
        description: `${data.nom} ${data.cognoms} s'ha afegit correctament`,
      });
      reset();
      onOpenChange(false);
      onSociaCreated();
    } catch (error) {
      console.error('Error creating socia:', error);
      toast({
        title: "Error",
        description: "No s'ha pogut crear la sòcia",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Sòcia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              {...register('nom', { required: true })}
              placeholder="Nom de la sòcia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cognoms">Cognoms *</Label>
            <Input
              id="cognoms"
              {...register('cognoms', { required: true })}
              placeholder="Cognoms de la sòcia"
            />
          </div>

          <div className="space-y-3">
            <Label>Gènere *</Label>
            <RadioGroup
              value={selectedGender}
              onValueChange={(value) => setValue('genere', value as any)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dona" id="dona" />
                <Label htmlFor="dona">Dona</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trans" id="trans" />
                <Label htmlFor="trans">Trans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-binari" id="no-binari" />
                <Label htmlFor="no-binari">No binari</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel·lar
            </Button>
            <Button type="submit">
              Crear Sòcia
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Assembly } from '@/types';
import { supabase } from '@/lib/supabase';
import { Wand2 } from 'lucide-react';

interface EditFormData {
  name: string;
  gender: 'man' | 'woman' | 'trans' | 'non-binary';
  assemblyName: string;
  date: string;
  description?: string;
}

interface EditAssemblyDialogProps {
  assembly: Assembly;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssemblyEdited: () => void;
}

const EditAssemblyDialog = ({ assembly, open, onOpenChange, onAssemblyEdited }: EditAssemblyDialogProps) => {
  const [selectedGender, setSelectedGender] = React.useState<'man' | 'woman' | 'trans' | 'non-binary'>(assembly.register.gender);
  const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);

  const form = useForm<EditFormData>({
    defaultValues: {
      name: assembly.register.name,
      gender: assembly.register.gender,
      assemblyName: assembly.name,
      date: assembly.date,
      description: assembly.description || '',
    },
  });

  const onSubmit = async (data: EditFormData) => {
    try {
      console.log('Submitting data:', {
        ...data,
        gender: selectedGender,
      });

      const { error } = await supabase
        .from('assemblies')
        .update({
          name: data.assemblyName,
          date: data.date,
          description: data.description,
          register: {
            name: data.name,
            gender: selectedGender,
          },
        })
        .eq('id', assembly.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      onOpenChange(false);
      onAssemblyEdited();
      toast.success("Assemblea actualitzada correctament");
    } catch (error) {
      console.error('Error updating assembly:', error);
      toast.error("Error actualitzant l'assemblea");
    }
  };

  React.useEffect(() => {
    if (open) {
      setSelectedGender(assembly.register.gender);
    }
  }, [open, assembly.register.gender]);

  const handleGenderChange = (value: string) => {
    setSelectedGender(value as 'man' | 'woman' | 'trans' | 'non-binary');
  };

  const generateDescription = async () => {
    try {
      setIsGeneratingDescription(true);
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: {
          assemblyName: form.getValues('assemblyName'),
          currentDescription: form.getValues('description'),
        },
      });

      if (error) throw error;

      if (data.suggestion) {
        form.setValue('description', data.suggestion);
        toast.success("Descripció generada correctament");
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error("Error generant la descripció");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Assemblea</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Nom del registrador/a</Label>
            <Input
              {...form.register('name', { required: true })}
              placeholder="El teu nom"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Gènere</Label>
            <RadioGroup
              value={selectedGender}
              onValueChange={handleGenderChange}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="man" id="edit-man" />
                <Label htmlFor="edit-man">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="woman" id="edit-woman" />
                <Label htmlFor="edit-woman">Dona</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trans" id="edit-trans" />
                <Label htmlFor="edit-trans">Trans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="edit-non-binary" />
                <Label htmlFor="edit-non-binary">No binari</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              {...form.register('date', { required: true })}
              type="date"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Nom de l&apos;assemblea</Label>
            <Input
              {...form.register('assemblyName', { required: true })}
              placeholder="Nom de l'assemblea"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Descripció (opcional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={isGeneratingDescription}
                className="flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                {isGeneratingDescription ? "Generant..." : "Generar amb IA"}
              </Button>
            </div>
            <Textarea
              {...form.register('description')}
              placeholder="Descripció breu..."
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">Actualitzar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssemblyDialog;

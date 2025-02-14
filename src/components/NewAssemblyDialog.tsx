import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { addAssembly } from '@/lib/supabase';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

interface RegisterFormData {
  name: string;
  gender: 'man' | 'woman' | 'non-binary';
  assemblyName: string;
  date: string;
  description?: string;
}

interface NewAssemblyDialogProps {
  onAssemblyCreated: () => void;
}

const NewAssemblyDialog = ({ onAssemblyCreated }: NewAssemblyDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);
  const form = useForm<RegisterFormData>();
  const isMobile = useIsMobile();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await addAssembly({
        name: data.assemblyName,
        date: data.date,
        description: data.description,
        register: {
          name: data.name,
          gender: data.gender,
        },
      });
      
      setOpen(false);
      form.reset();
      onAssemblyCreated();
      toast.success("Assemblea creada correctament");
    } catch (error) {
      console.error('Error creating assembly:', error);
      toast.error("Error creant l'assemblea");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size={isMobile ? "default" : "lg"} className="w-full md:w-auto">
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Nova Assemblea</span>
          <span className="inline md:hidden">Nova</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Assemblea</DialogTitle>
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
              onValueChange={(value: 'man' | 'woman' | 'non-binary') => 
                form.setValue('gender', value)
              }
              defaultValue="man"
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="man" id="man" />
                <Label htmlFor="man">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="woman" id="woman" />
                <Label htmlFor="woman">Dona</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="non-binary" />
                <Label htmlFor="non-binary">No binari</Label>
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
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3"
              >
                <Wand2 className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">
                  {isGeneratingDescription ? "Generant..." : "Generar amb IA"}
                </span>
              </Button>
            </div>
            <Textarea
              {...form.register('description')}
              placeholder="Descripció breu..."
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssemblyDialog;

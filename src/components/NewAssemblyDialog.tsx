
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { addAssembly } from '@/lib/supabase';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RegisterFormData {
  name: string;
  gender: 'man' | 'woman' | 'non-binary';
  assemblyName: string;
  date: string;
  description?: string;
}

interface NewAssemblyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssemblyCreated: () => void;
}

const genderOptions = [
  { value: 'man', label: 'Home' },
  { value: 'woman', label: 'Dona' },
  { value: 'non-binary', label: 'No binari' }
];

const NewAssemblyDialog = ({ open, onOpenChange, onAssemblyCreated }: NewAssemblyDialogProps) => {
  const form = useForm<RegisterFormData>({
    defaultValues: {
      gender: 'man'
    }
  });

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
      
      onOpenChange(false);
      form.reset();
      onAssemblyCreated();
      toast.success("Assemblea creada correctament");
    } catch (error) {
      console.error('Error creating assembly:', error);
      toast.error("Error creant l'assemblea");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              className="grid grid-cols-3 gap-4"
            >
              {genderOptions.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
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
            <Label>Descripció (opcional)</Label>
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

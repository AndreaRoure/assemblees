
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
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
  onAssemblyCreated: () => void;
}

const NewAssemblyDialog = ({ onAssemblyCreated }: NewAssemblyDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<RegisterFormData>();

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Assemblea
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
              className="grid grid-cols-3 gap-4"
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

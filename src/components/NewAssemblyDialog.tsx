
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { addAssembly } from '@/data/assemblies';

interface NewAssemblyFormData {
  name: string;
  date: string;
  description?: string;
}

interface NewAssemblyDialogProps {
  onAssemblyCreated: () => void;
}

const NewAssemblyDialog = ({ onAssemblyCreated }: NewAssemblyDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<NewAssemblyFormData>();

  const onSubmit = (data: NewAssemblyFormData) => {
    addAssembly(data);
    setOpen(false);
    reset();
    onAssemblyCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Assemblea
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nova Assemblea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input {...register('name', { required: true })} placeholder="Nom de l'assemblea" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <Input {...register('date', { required: true })} type="date" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Descripció (opcional)</label>
            <Textarea {...register('description')} placeholder="Descripció breu..." />
          </div>
          <Button type="submit" className="w-full">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssemblyDialog;

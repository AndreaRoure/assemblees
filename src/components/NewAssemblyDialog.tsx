
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, MapPin, Hash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { addAssembly } from '@/data/assemblies';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RegisterFormData {
  name: string;
  gender: 'man' | 'woman';
}

interface AssemblyFormData {
  name: string;
  date: string;
  description?: string;
}

interface NewAssemblyDialogProps {
  onAssemblyCreated: () => void;
}

type AssemblyField = 'date' | 'location' | 'number';

const NewAssemblyDialog = ({ onAssemblyCreated }: NewAssemblyDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<'register' | 'assembly'>('register');
  const [registerData, setRegisterData] = React.useState<RegisterFormData | null>(null);
  const [selectedField, setSelectedField] = React.useState<AssemblyField | null>(null);
  
  const registerForm = useForm<RegisterFormData>();
  const assemblyForm = useForm<AssemblyFormData>();

  const onRegisterSubmit = (data: RegisterFormData) => {
    setRegisterData(data);
    setStep('assembly');
  };

  const onAssemblySubmit = (data: AssemblyFormData) => {
    if (!registerData) return;
    
    addAssembly({
      ...data,
      register: registerData,
    });
    
    setOpen(false);
    setStep('register');
    setRegisterData(null);
    setSelectedField(null);
    registerForm.reset();
    assemblyForm.reset();
    onAssemblyCreated();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep('register');
      setRegisterData(null);
      setSelectedField(null);
      registerForm.reset();
      assemblyForm.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Assemblea
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'register' ? 'Informació del Registrador/a' : 'Crear Nova Assemblea'}
          </DialogTitle>
        </DialogHeader>

        {step === 'register' ? (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Nom del registrador/a</Label>
              <Input
                {...registerForm.register('name', { required: true })}
                placeholder="El teu nom"
              />
            </div>

            <div className="space-y-2">
              <Label>Gènere</Label>
              <RadioGroup
                onValueChange={(value: 'man' | 'woman') => 
                  registerForm.setValue('gender', value)
                }
                defaultValue="man"
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="man" id="man" />
                  <Label htmlFor="man">Home</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="woman" id="woman" />
                  <Label htmlFor="woman">Dona</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">Següent</Button>
          </form>
        ) : (
          <div className="space-y-6 mt-4">
            {!selectedField ? (
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg"
                  onClick={() => setSelectedField('date')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg"
                  onClick={() => setSelectedField('location')}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Ubicació
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg"
                  onClick={() => setSelectedField('number')}
                >
                  <Hash className="mr-2 h-5 w-5" />
                  Nombre Assemblea
                </Button>
              </div>
            ) : (
              <form onSubmit={assemblyForm.handleSubmit(onAssemblySubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l&apos;assemblea</Label>
                  <Input
                    {...assemblyForm.register('name', { required: true })}
                    placeholder="Nom de l'assemblea"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    {...assemblyForm.register('date', { required: true })}
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripció (opcional)</Label>
                  <Textarea
                    {...assemblyForm.register('description')}
                    placeholder="Descripció breu..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedField(null)}
                  >
                    Enrere
                  </Button>
                  <Button type="submit" className="w-full">Crear</Button>
                </div>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewAssemblyDialog;

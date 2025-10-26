import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { updateSocia, deleteSocia } from '@/lib/supabase-socias';
import { SociaWithStats } from '@/types/socias';
import { Trash2 } from 'lucide-react';

interface EditSociaFormData {
  nom: string;
  cognoms: string;
  genere: 'home' | 'dona' | 'no-binari';
  tipo: 'habitatge' | 'colaborador';
  comissions: string[];
}

const COMMISSION_OPTIONS = [
  { value: 'economiques', label: 'Econòmiques' },
  { value: 'intercooperacio', label: 'Intercooperació' },
  { value: 'secretaria', label: 'Secretaria' },
  { value: 'convivencia', label: 'Convivència' },
  { value: 'subvencions', label: 'Subvencions' },
  { value: 'arquitectura', label: 'Arquitectura' },
  { value: 'comunicacio', label: 'Comunicació' },
];

interface EditSociaDialogProps {
  socia: SociaWithStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSociaUpdated: () => void;
}

export const EditSociaDialog: React.FC<EditSociaDialogProps> = ({
  socia,
  open,
  onOpenChange,
  onSociaUpdated
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<EditSociaFormData>({
    defaultValues: {
      nom: '',
      cognoms: '',
      genere: 'dona',
      tipo: 'habitatge',
      comissions: []
    }
  });
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selectedGender = watch('genere');
  const selectedTipo = watch('tipo');
  const selectedComissions = watch('comissions');

  // Update form when socia changes
  React.useEffect(() => {
    if (socia) {
      setValue('nom', socia.nom);
      setValue('cognoms', socia.cognoms);
      setValue('genere', socia.genere);
      setValue('tipo', socia.tipo);
      setValue('comissions', socia.comissions || []);
    }
  }, [socia, setValue]);

  const onSubmit = async (data: EditSociaFormData) => {
    if (!socia) return;
    
    try {
      await updateSocia(socia.id, data);
      toast({
        title: "Sòcia actualitzada",
        description: `${data.nom} ${data.cognoms} s'ha actualitzat correctament`,
      });
      reset();
      onOpenChange(false);
      onSociaUpdated();
    } catch (error) {
      console.error('Error updating socia:', error);
      toast({
        title: "Error",
        description: "No s'ha pogut actualitzar la sòcia",
        variant: "destructive",
      });
    }
  };

  const handleCommissionChange = (commissionValue: string, checked: boolean) => {
    const currentComissions = selectedComissions || [];
    if (checked) {
      setValue('comissions', [...currentComissions, commissionValue]);
    } else {
      setValue('comissions', currentComissions.filter(c => c !== commissionValue));
    }
  };

  const handleDelete = async () => {
    if (!socia) return;
    
    try {
      await deleteSocia(socia.id);
      toast({
        title: "Sòcia eliminada",
        description: `${socia.nom} ${socia.cognoms} s'ha eliminat correctament`,
      });
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onSociaUpdated();
    } catch (error) {
      console.error('Error deleting socia:', error);
      toast({
        title: "Error",
        description: "No s'ha pogut eliminar la sòcia",
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

  if (!socia) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sòcia</DialogTitle>
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
                <RadioGroupItem value="dona" id="edit-dona" />
                <Label htmlFor="edit-dona">Dona</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="edit-home" />
                <Label htmlFor="edit-home">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-binari" id="edit-no-binari" />
                <Label htmlFor="edit-no-binari">No binari</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Tipus de Sòcia *</Label>
            <RadioGroup
              value={selectedTipo}
              onValueChange={(value) => setValue('tipo', value as any)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="habitatge" id="edit-habitatge" />
                <Label htmlFor="edit-habitatge">Habitatge</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="colaborador" id="edit-colaborador" />
                <Label htmlFor="edit-colaborador">Colaborador/a</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Comissions</Label>
            <div className="grid grid-cols-2 gap-3">
              {COMMISSION_OPTIONS.map((commission) => (
                <div key={commission.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${commission.value}`}
                    checked={selectedComissions?.includes(commission.value) || false}
                    onCheckedChange={(checked) => 
                      handleCommissionChange(commission.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`edit-${commission.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {commission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center space-x-2 pt-4">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="mr-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel·lar
              </Button>
              <Button type="submit">
                Actualitzar Sòcia
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estàs segur/a?</AlertDialogTitle>
          <AlertDialogDescription>
            Aquesta acció no es pot desfer. S'eliminarà permanentment la sòcia{' '}
            <span className="font-semibold">{socia.nom} {socia.cognoms}</span>{' '}
            i totes les seves dades associades.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
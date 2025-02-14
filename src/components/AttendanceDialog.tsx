
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceFormData {
  name: string;
  date: string;
  type: 'online' | 'in-person';
}

const AttendanceDialog = () => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<AttendanceFormData>();

  const onSubmit = async (data: AttendanceFormData) => {
    // This is just a mock function for now
    console.log('Attendance data:', data);
    toast.success('Assistència registrada correctament');
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" size="lg">
          <UserPlus className="mr-2 h-4 w-4" />
          Registrar Assistència
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Assistència</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              {...form.register('name', { required: true })}
              placeholder="El teu nom"
            />
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              {...form.register('date', { required: true })}
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipus d&apos;assistència</Label>
            <RadioGroup
              onValueChange={(value: 'online' | 'in-person') => 
                form.setValue('type', value)
              }
              defaultValue="in-person"
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person">Presencial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">En línia</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">Registrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateVendor } from '../../hooks/useVendors';
import { VENDOR_CATEGORIES } from '../../utils/constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import Textarea from '../../components/ui/Textarea';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  gst_number: z.string().optional(),
  category: z.string().min(1, 'Category required'),
  contact_email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function VendorCreate() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const { mutate: create, isPending } = useCreateVendor();

  function onSubmit(data) {
    create(data, { onSuccess: () => navigate('/vendors') });
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/vendors')} />
        <h1 className="text-headline-lg text-text-primary">Add Vendor</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Vendor Name *" placeholder="Company name" error={errors.name?.message} {...register('name')} />
            <Input label="GST Number" placeholder="22AAAAA0000A1Z5" error={errors.gst_number?.message} {...register('gst_number')} />
          </div>
          <Select
            label="Category *"
            placeholder="Select category"
            options={VENDOR_CATEGORIES.map(c => ({ value: c, label: c }))}
            error={errors.category?.message}
            {...register('category')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Contact Email *" type="email" placeholder="vendor@company.com" error={errors.contact_email?.message} {...register('contact_email')} />
            <Input label="Phone" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
          </div>
          <Textarea label="Address" placeholder="Full business address" rows={3} error={errors.address?.message} {...register('address')} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => navigate('/vendors')}>Cancel</Button>
            <Button type="submit" loading={isPending}>Create Vendor</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

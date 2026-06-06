import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRFQ } from '../../hooks/useRFQ';
import { useVendors } from '../../hooks/useVendors';
import StepperProgress from '../../components/StepperProgress';
import FileUpload from '../../components/FileUpload';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';

const STEPS = ['Details', 'Items', 'Vendors', 'Review'];

const schema = z.object({
  title: z.string().min(3, 'Title required'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline required'),
  items: z.array(z.object({
    product_name: z.string().min(1, 'Required'),
    quantity: z.coerce.number().positive('Must be > 0'),
    unit: z.string().min(1, 'Required'),
    description: z.string().optional(),
  })).min(1, 'Add at least one item'),
  vendor_ids: z.array(z.string()).min(1, 'Select at least one vendor'),
});

export default function RFQCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [vendorSearch, setVendorSearch] = useState('');
  const { mutate: createRFQ, isPending } = useCreateRFQ();
  const { data: vendorData } = useVendors({ status: 'ACTIVE', limit: 100 });
  const vendors = vendorData?.data ?? [];

  const { register, handleSubmit, control, trigger, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ product_name: '', quantity: 1, unit: 'pcs', description: '' }], vendor_ids: [] },
  });

  const { fields, append, remove } = useFieldArray({ name: 'items', control });
  const watchItems = watch('items');
  const watchVendorIds = watch('vendor_ids');

  async function nextStep() {
    const fieldsByStep = [
      ['title', 'deadline'],
      ['items'],
      ['vendor_ids'],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep(s => s + 1);
  }

  function toggleVendor(id) {
    const current = watchVendorIds ?? [];
    setValue('vendor_ids', current.includes(id) ? current.filter(v => v !== id) : [...current, id]);
  }

  function onSubmit(data) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description ?? '');
    formData.append('deadline', data.deadline);
    formData.append('items', JSON.stringify(data.items));
    formData.append('vendor_ids', JSON.stringify(data.vendor_ids));
    files.forEach(f => formData.append('attachments', f));
    createRFQ(formData, { onSuccess: rfq => navigate(`/rfq/${rfq.id}`) });
  }

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/rfq')} />
        <h1 className="text-headline-lg text-text-primary">Create RFQ</h1>
      </div>

      <StepperProgress steps={STEPS} current={step} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          {/* Step 0: Details */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-sm text-text-primary mb-2">RFQ Details</h2>
              <Input label="Title *" placeholder="e.g. Office Supplies Q4 2024" error={errors.title?.message} {...register('title')} />
              <Textarea label="Description" placeholder="Describe what you need..." rows={3} {...register('description')} />
              <Input label="Deadline *" type="datetime-local" error={errors.deadline?.message} {...register('deadline')} />
            </div>
          )}

          {/* Step 1: Items */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-headline-sm text-text-primary">Line Items</h2>
                <Button type="button" variant="outline" size="sm" icon="add"
                  onClick={() => setValue('items', [...watchItems, { product_name: '', quantity: 1, unit: 'pcs', description: '' }])}>
                  Add Item
                </Button>
              </div>
              {errors.items?.root && <p className="text-[11px] text-accent-red">{errors.items.root.message}</p>}
              {watchItems.map((_, i) => (
                <div key={i} className="bg-surface-variant/30 border border-border-subtle rounded p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-label-caps text-text-secondary uppercase">Item {i + 1}</span>
                    {watchItems.length > 1 && (
                      <button type="button" onClick={() => setValue('items', watchItems.filter((_, idx) => idx !== i))}
                        className="text-text-secondary hover:text-accent-red">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <Input label="Product Name *" placeholder="e.g. A4 Paper" error={errors.items?.[i]?.product_name?.message}
                        {...register(`items.${i}.product_name`)} />
                    </div>
                    <Input label="Quantity *" type="number" min="1" error={errors.items?.[i]?.quantity?.message}
                      {...register(`items.${i}.quantity`)} />
                    <Input label="Unit *" placeholder="pcs / kg / ltr" error={errors.items?.[i]?.unit?.message}
                      {...register(`items.${i}.unit`)} />
                  </div>
                  <Input label="Description" placeholder="Optional notes" {...register(`items.${i}.description`)} />
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Vendors */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-sm text-text-primary mb-2">Select Vendors</h2>
              {errors.vendor_ids && <p className="text-[11px] text-accent-red">{errors.vendor_ids.message}</p>}
              <Input icon="search" placeholder="Search vendors..." value={vendorSearch}
                onChange={e => setVendorSearch(e.target.value)} />
              <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto">
                {filteredVendors.map(v => {
                  const selected = watchVendorIds?.includes(v.id);
                  return (
                    <div key={v.id} onClick={() => toggleVendor(v.id)}
                      className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${selected ? 'border-secondary-container bg-secondary-container/10' : 'border-border-subtle hover:bg-surface-hover'}`}>
                      <div>
                        <p className="text-body-sm font-semibold text-text-primary">{v.name}</p>
                        <p className="text-[11px] text-text-secondary">{v.category} · ★ {v.rating?.toFixed(1) ?? '—'}</p>
                      </div>
                      {selected && <span className="material-symbols-outlined text-[20px] text-secondary-container">check_circle</span>}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-text-secondary">{watchVendorIds?.length ?? 0} vendor(s) selected</p>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-sm text-text-primary mb-2">Review & Submit</h2>
              <dl className="flex flex-col gap-2 bg-surface-variant/30 rounded p-4">
                <div className="flex justify-between"><dt className="text-text-secondary text-body-sm">Title</dt><dd className="text-text-primary font-semibold text-body-sm">{watch('title')}</dd></div>
                <div className="flex justify-between"><dt className="text-text-secondary text-body-sm">Items</dt><dd className="text-text-primary font-semibold text-body-sm">{watchItems.length}</dd></div>
                <div className="flex justify-between"><dt className="text-text-secondary text-body-sm">Vendors</dt><dd className="text-text-primary font-semibold text-body-sm">{watchVendorIds?.length}</dd></div>
                <div className="flex justify-between"><dt className="text-text-secondary text-body-sm">Deadline</dt><dd className="text-text-primary font-semibold text-body-sm">{watch('deadline')}</dd></div>
              </dl>
              <FileUpload onChange={setFiles} label="Attach supporting documents (optional)" />
            </div>
          )}

          <div className="flex gap-3 justify-between mt-6 pt-4 border-t border-border-subtle">
            <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
            {step < 3
              ? <Button type="button" onClick={nextStep}>Next</Button>
              : <Button type="submit" loading={isPending} icon="send">Submit RFQ</Button>
            }
          </div>
        </Card>
      </form>
    </div>
  );
}

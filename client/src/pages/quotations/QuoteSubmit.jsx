import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { useRFQ, useSubmitQuotation, useQuotationsForRFQ } from '../../hooks/useRFQ';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import useAuthStore from '../../store/authStore';

export default function QuoteSubmit() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: rfq, isLoading } = useRFQ(rfqId);
  const { data: quotations } = useQuotationsForRFQ(rfqId);
  const { mutate: submit, isPending } = useSubmitQuotation();

  const existingQuote = quotations?.find(q => q.vendor_id === user?.vendor_id);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { items: [], delivery_date: '', notes: '' },
  });

  const watchItems = watch('items');

  useEffect(() => {
    if (rfq?.rfq_items) {
      const items = rfq.rfq_items.map(item => ({
        rfq_item_id: item.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: existingQuote?.items?.find(qi => qi.rfq_item_id === item.id)?.unit_price ?? '',
      }));
      reset({
        items,
        delivery_date: existingQuote?.delivery_date?.slice(0, 10) ?? '',
        notes: existingQuote?.notes ?? '',
      });
    }
  }, [rfq, existingQuote, reset]);

  const total = watchItems.reduce((sum, item) => sum + (Number(item.unit_price) || 0) * Number(item.quantity || 0), 0);

  function onSubmit(data) {
    // Transform data to match backend expectations
    const transformedData = {
      items: data.items.map(item => ({
        rfq_item_id: item.rfq_item_id,
        unit_price: parseFloat(item.unit_price),
        quantity: parseFloat(item.quantity),
        subtotal: parseFloat(item.unit_price) * parseFloat(item.quantity),
      })),
      total_amount: data.items.reduce((sum, item) => 
        sum + (parseFloat(item.unit_price) || 0) * parseFloat(item.quantity || 0), 0
      ),
      delivery_date: new Date(data.delivery_date).toISOString(),
      notes: data.notes || '',
    };
    
    submit({ rfqId, data: transformedData }, { onSuccess: () => navigate('/rfq') });
  }

  if (isLoading) return <CardSkeleton />;
  if (!rfq) return <EmptyState icon="request_quote" title="RFQ not found" />;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/rfq')} />
        <div>
          <h1 className="text-headline-lg text-text-primary">Submit Quotation</h1>
          <p className="text-body-sm text-text-secondary">{rfq.title} · Deadline: {formatDate(rfq.deadline)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <h3 className="text-headline-sm text-text-primary mb-4">Price Your Items</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-hover/50">
                  {['#', 'Product', 'Qty', 'Unit', 'Unit Price (₹)', 'Subtotal'].map(h => (
                    <th key={h} className="px-4 py-3 text-label-caps text-text-secondary uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {watchItems.map((item, i) => (
                  <tr key={i} className="border-b border-border-subtle">
                    <td className="px-4 py-3 text-body-sm text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-3 text-body-sm font-semibold text-text-primary">{item.product_name}</td>
                    <td className="px-4 py-3 text-body-sm font-mono-data">{item.quantity}</td>
                    <td className="px-4 py-3 text-body-sm text-text-secondary">{item.unit}</td>
                    <td className="px-4 py-3">
                      <input type="number" min="0" step="0.01" placeholder="0.00"
                        className="w-[120px] bg-surface-variant/50 border border-border-subtle rounded h-[36px] px-3 text-body-sm text-text-primary focus:outline-none focus:border-secondary-container transition-colors"
                        {...register(`items.${i}.unit_price`, { required: true, min: 0.01 })} />
                    </td>
                    <td className="px-4 py-3 text-body-sm font-mono-data text-text-primary">
                      {formatCurrency((Number(item.unit_price) || 0) * Number(item.quantity || 0))}
                    </td>
                  </tr>
                ))}
                <tr className="bg-surface-hover/50 font-semibold">
                  <td colSpan={5} className="px-4 py-3 text-body-sm text-text-primary text-right">Total Amount</td>
                  <td className="px-4 py-3 font-mono-data text-primary-container text-headline-sm">{formatCurrency(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Delivery Date *" type="date" {...register('delivery_date', { required: true })} />
            <div />
          </div>
          <div className="mt-4">
            <Textarea label="Notes (optional)" placeholder="Any terms, conditions, or additional info..." rows={3} {...register('notes')} />
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border-subtle">
            <Button variant="outline" type="button" onClick={() => navigate('/rfq')}>Cancel</Button>
            <Button type="submit" loading={isPending} icon="send">
              {existingQuote ? 'Update Quotation' : 'Submit Quotation'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

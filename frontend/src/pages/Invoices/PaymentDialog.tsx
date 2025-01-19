import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { Invoice } from '../../services/financeService';

interface PaymentDialogProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onSave: (paymentData: any) => void;
}

const PAYMENT_METHODS = {
  CASH: 'Nakit',
  CREDIT_CARD: 'Kredi Kartı',
  BANK_TRANSFER: 'Banka Havalesi',
};

const PaymentDialog = ({ open, invoice, onClose, onSave }: PaymentDialogProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: '',
    payment_reference: '',
  });

  if (!invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      invoice_id: invoice.id,
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Ödeme Kaydet - Fatura #{invoice.invoice_number}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ödeme Tutarı"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                inputProps={{ min: 0, max: invoice.total_amount }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Ödeme Yöntemi"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                required
              >
                {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Referans No"
                value={formData.payment_reference}
                onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                helperText="Opsiyonel (Havale/EFT no, kredi kartı slip no vb.)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">
            Ödemeyi Kaydet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentDialog; 
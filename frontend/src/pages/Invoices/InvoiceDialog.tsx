import { useEffect, useState } from 'react';
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
import { orderService } from '../../services/orderService';
import { formatDate } from '../../utils/dateUtils';

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (invoiceData: any) => void;
}

const InvoiceDialog = ({ open, onClose, onSave }: InvoiceDialogProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    order_id: '',
    invoice_number: '',
    due_date: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data.filter(order => order.status === 'COMPLETED'));
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
      }
    };

    if (open) {
      fetchOrders();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Yeni Fatura</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Sipariş"
                value={formData.order_id}
                onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                required
              >
                {orders.map((order) => (
                  <MenuItem key={order.id} value={order.id}>
                    #{order.id} - {order.customer.name} - {order.total_amount} ₺
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fatura Numarası"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Vade Tarihi"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">
            Fatura Oluştur
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InvoiceDialog; 
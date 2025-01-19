import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Order } from '../../services/orderService';

interface OrderStatusDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSave: (orderId: number, status: string) => void;
}

const ORDER_STATUSES = {
  PENDING: 'Bekliyor',
  PROCESSING: 'İşleniyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi'
} as const;

const OrderStatusDialog = ({ open, order, onClose, onSave }: OrderStatusDialogProps) => {
  if (!order) return null;

  const handleStatusChange = (event: any) => {
    onSave(order.id, event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Sipariş Durumunu Güncelle #{order.id}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={order.status}
            label="Durum"
            onChange={handleStatusChange}
          >
            {Object.entries(ORDER_STATUSES).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderStatusDialog; 
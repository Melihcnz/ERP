import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Order } from '../../services/orderService';
import { formatDate } from '../../utils/dateUtils';

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsDialog = ({ open, order, onClose }: OrderDetailsDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Sipariş Detayları #{order.id}
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Müşteri Bilgileri
          </Typography>
          <Typography>
            {order.customer.name}
          </Typography>
          <Typography color="textSecondary">
            {order.customer.email}
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Sipariş Bilgileri
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <Typography>
              Tarih: {formatDate(order.created_at)}
            </Typography>
            <Typography>
              Durum: <Chip label={order.status} size="small" />
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Ürünler
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell align="right">Birim Fiyat</TableCell>
              <TableCell align="right">Miktar</TableCell>
              <TableCell align="right">Toplam</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell align="right">{item.unit_price} ₺</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {(item.quantity * item.unit_price).toFixed(2)} ₺
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <strong>Genel Toplam:</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{order.total_amount} ₺</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog; 
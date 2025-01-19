import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Order, orderService } from '../../services/orderService';
import { formatDate } from '../../utils/dateUtils';
import OrderDialog from './OrderDialog';
import OrderDetailsDialog from './OrderDetailsDialog';
import OrderStatusDialog from './OrderStatusDialog';

const statusColors = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
} as const;

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (orderData: any) => {
    try {
      await orderService.createOrder(orderData);
      setOpenCreateDialog(false);
      fetchOrders();
    } catch (err: any) {
      console.error('Sipariş oluşturulurken hata:', err);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOpenStatusDialog(false);
      fetchOrders();
    } catch (err: any) {
      console.error('Sipariş durumu güncellenirken hata:', err);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setOpenStatusDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Siparişler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Yeni Sipariş
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sipariş No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell align="right">Toplam Tutar</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell align="right">{order.total_amount} ₺</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={statusColors[order.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewDetails(order)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleUpdateStatusClick(order)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSave={handleCreateOrder}
      />

      <OrderDetailsDialog
        open={openDetailsDialog}
        order={selectedOrder}
        onClose={() => setOpenDetailsDialog(false)}
      />

      <OrderStatusDialog
        open={openStatusDialog}
        order={selectedOrder}
        onClose={() => setOpenStatusDialog(false)}
        onSave={handleUpdateStatus}
      />
    </Box>
  );
};

export default Orders; 
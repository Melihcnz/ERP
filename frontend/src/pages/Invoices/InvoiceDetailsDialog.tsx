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
  Chip,
  Divider
} from '@mui/material';
import { Invoice } from '../../services/financeService';
import { formatDate } from '../../utils/dateUtils';

interface InvoiceDetailsDialogProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
}

const InvoiceDetailsDialog = ({ open, invoice, onClose }: InvoiceDetailsDialogProps) => {
  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Fatura Detayları #{invoice.invoice_number}
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Müşteri Bilgileri
          </Typography>
          <Typography>
            {invoice.order.customer.name}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Fatura Bilgileri
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <Typography>
              Oluşturma Tarihi: {formatDate(invoice.created_at)}
            </Typography>
            <Typography>
              Vade Tarihi: {formatDate(invoice.due_date)}
            </Typography>
            <Typography>
              Durum: <Chip label={invoice.status} color={
                invoice.status === 'PAID' ? 'success' :
                invoice.status === 'PARTIAL' ? 'warning' : 'error'
              } size="small" />
            </Typography>
          </Box>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Sipariş Detayları
          </Typography>
          <Typography>
            Sipariş No: #{invoice.order.id}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Ödeme Bilgileri
          </Typography>
          <Typography variant="h6" align="right" gutterBottom>
            Toplam Tutar: {invoice.total_amount} ₺
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailsDialog; 
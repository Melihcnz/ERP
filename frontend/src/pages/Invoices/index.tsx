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
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { Invoice, financeService } from '../../services/financeService';
import { formatDate } from '../../utils/dateUtils';
import InvoiceDialog from './InvoiceDialog';
import InvoiceDetailsDialog from './InvoiceDetailsDialog';
import PaymentDialog from './PaymentDialog';

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  PENDING: 'error',
  PARTIAL: 'primary',
  PAID: 'success',
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      const data = await financeService.getAllInvoices();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Faturalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      await financeService.createInvoice(invoiceData);
      setOpenCreateDialog(false);
      fetchInvoices();
    } catch (err: any) {
      console.error('Fatura oluşturulurken hata:', err);
    }
  };

  const handleRecordPayment = async (paymentData: any) => {
    try {
      await financeService.recordPayment(paymentData);
      setOpenPaymentDialog(false);
      fetchInvoices();
    } catch (err: any) {
      console.error('Ödeme kaydedilirken hata:', err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Faturalar</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Yeni Fatura
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fatura No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell align="right">Tutar</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Vade Tarihi</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.order.customer.name}</TableCell>
                <TableCell align="right">{invoice.total_amount} ₺</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={statusColors[invoice.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(invoice.due_date)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => {
                    setSelectedInvoice(invoice);
                    setOpenDetailsDialog(true);
                  }}>
                    <ViewIcon />
                  </IconButton>
                  {invoice.status !== 'PAID' && (
                    <IconButton onClick={() => {
                      setSelectedInvoice(invoice);
                      setOpenPaymentDialog(true);
                    }}>
                      <PaymentIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InvoiceDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSave={handleCreateInvoice}
      />

      <InvoiceDetailsDialog
        open={openDetailsDialog}
        invoice={selectedInvoice}
        onClose={() => setOpenDetailsDialog(false)}
      />

      <PaymentDialog
        open={openPaymentDialog}
        invoice={selectedInvoice}
        onClose={() => setOpenPaymentDialog(false)}
        onSave={handleRecordPayment}
      />
    </Box>
  );
};

export default Invoices; 
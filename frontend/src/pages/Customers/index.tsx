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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Customer, customerService } from '../../services/customerService';
import CustomerDialog from './CustomerDialog';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { formatDate } from '../../utils/dateUtils';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Müşteriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async (customerData: any) => {
    try {
      if (selectedCustomer) {
        await customerService.updateCustomer(selectedCustomer.id, customerData);
      } else {
        await customerService.createCustomer(customerData);
      }
      setOpenDialog(false);
      fetchCustomers();
    } catch (err: any) {
      console.error('Müşteri kaydedilirken hata:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await customerService.deleteCustomer(selectedCustomer.id);
      setOpenDeleteDialog(false);
      fetchCustomers();
    } catch (err: any) {
      console.error('Müşteri silinirken hata:', err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Müşteriler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedCustomer(null);
            setOpenDialog(true);
          }}
        >
          Yeni Müşteri
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Müşteri Adı</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Kayıt Tarihi</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{formatDate(customer.created_at)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomerDialog
        open={openDialog}
        customer={selectedCustomer}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        title="Müşteriyi Sil"
        content="Bu müşteriyi silmek istediğinizden emin misiniz?"
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default Customers; 
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
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Customer, customerService } from '../../services/customerService';
import { Product, productService } from '../../services/productService';
import { CreateOrderData } from '../../services/orderService';

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (orderData: CreateOrderData) => void;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

const OrderDialog = ({ open, onClose, onSave }: OrderDialogProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ 
    product_id: 0, 
    quantity: 1, 
    unit_price: 0 
  }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          customerService.getAllCustomers(),
          productService.getAllProducts()
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unit_price = product.unit_price;
      }
    }

    setOrderItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      customer_id: parseInt(selectedCustomer),
      items: orderItems
    });
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Yeni Sipariş</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Müşteri"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                required
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {orderItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box display="flex" gap={2} alignItems="center">
                  <TextField
                    select
                    label="Ürün"
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', Number(e.target.value))}
                    required
                    sx={{ flexGrow: 1 }}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - {product.unit_price} ₺
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    label="Miktar"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    required
                    sx={{ width: 100 }}
                  />
                  <Typography sx={{ minWidth: 100 }}>
                    {(item.quantity * item.unit_price).toFixed(2)} ₺
                  </Typography>
                  {orderItems.length > 1 && (
                    <IconButton onClick={() => handleRemoveItem(index)} color="error">
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button startIcon={<AddIcon />} onClick={handleAddItem}>
                Ürün Ekle
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" align="right">
                Toplam: {calculateTotal().toFixed(2)} ₺
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">
            Siparişi Oluştur
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderDialog; 
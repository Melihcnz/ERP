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
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Product, productService } from '../../services/productService';
import ProductDialog from './ProductDialog';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Ürünler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err: any) {
        alert(err.message || 'Ürün silinirken bir hata oluştu');
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleProductSave = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        const updatedProduct = await productService.updateProduct(selectedProduct.id, productData);
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        const newProduct = await productService.createProduct(productData as Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>);
        setProducts([...products, newProduct]);
      }
      handleDialogClose();
    } catch (err: any) {
      alert(err.message || 'Ürün kaydedilirken bir hata oluştu');
    }
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
        <Typography variant="h5">Ürünler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Yeni Ürün
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="right">Stok</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell align="right">{product.unit_price} ₺</TableCell>
                <TableCell align="right">{product.stock_quantity}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductDialog
        open={openDialog}
        product={selectedProduct}
        onClose={handleDialogClose}
        onSave={handleProductSave}
      />
    </Box>
  );
};

export default Products; 
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { CompanySettings, SystemSettings, settingsService } from '../../services/settingsService';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    company_name: '',
    tax_number: '',
    address: '',
    phone: '',
    email: '',
    logo_url: ''
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    currency: 'TRY',
    date_format: 'DD.MM.YYYY',
    low_stock_threshold: 10,
    invoice_prefix: 'INV',
    order_prefix: 'ORD'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [company, system] = await Promise.all([
          settingsService.getCompanySettings(),
          settingsService.getSystemSettings()
        ]);
        setCompanySettings(company);
        setSystemSettings(system);
      } catch (err: any) {
        setError(err.message || 'Ayarlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const result = await settingsService.uploadLogo(e.target.files[0]);
        setCompanySettings(prev => ({ ...prev, logo_url: result.logo_url }));
        setSuccessMessage('Logo başarıyla güncellendi');
      } catch (err: any) {
        setError(err.message || 'Logo yüklenirken bir hata oluştu');
      }
    }
  };

  const handleSaveCompanySettings = async () => {
    try {
      await settingsService.updateCompanySettings(companySettings);
      setSuccessMessage('Şirket ayarları başarıyla güncellendi');
    } catch (err: any) {
      setError(err.message || 'Şirket ayarları güncellenirken bir hata oluştu');
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      await settingsService.updateSystemSettings(systemSettings);
      setSuccessMessage('Sistem ayarları başarıyla güncellendi');
    } catch (err: any) {
      setError(err.message || 'Sistem ayarları güncellenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Ayarlar</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Şirket Bilgileri</Typography>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="company_name"
                    label="Şirket Adı"
                    value={companySettings.company_name}
                    onChange={handleCompanyChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="tax_number"
                    label="Vergi Numarası"
                    value={companySettings.tax_number}
                    onChange={handleCompanyChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Adres"
                    value={companySettings.address}
                    onChange={handleCompanyChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phone"
                    label="Telefon"
                    value={companySettings.phone}
                    onChange={handleCompanyChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="E-posta"
                    value={companySettings.email}
                    onChange={handleCompanyChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCamera />}
                  >
                    Logo Yükle
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveCompanySettings}
                    fullWidth
                  >
                    Şirket Bilgilerini Kaydet
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Sistem Ayarları</Typography>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="currency"
                    label="Para Birimi"
                    value={systemSettings.currency}
                    onChange={handleSystemChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="date_format"
                    label="Tarih Formatı"
                    value={systemSettings.date_format}
                    onChange={handleSystemChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="low_stock_threshold"
                    label="Düşük Stok Eşiği"
                    type="number"
                    value={systemSettings.low_stock_threshold}
                    onChange={handleSystemChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="invoice_prefix"
                    label="Fatura Öneki"
                    value={systemSettings.invoice_prefix}
                    onChange={handleSystemChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="order_prefix"
                    label="Sipariş Öneki"
                    value={systemSettings.order_prefix}
                    onChange={handleSystemChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveSystemSettings}
                    fullWidth
                  >
                    Sistem Ayarlarını Kaydet
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 
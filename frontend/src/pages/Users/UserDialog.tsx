import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { User } from '../../services/userService';

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: any) => void;
}

const USER_ROLES = {
  ADMIN: 'Yönetici',
  MANAGER: 'Müdür',
  SALES: 'Satış Temsilcisi',
  ACCOUNTANT: 'Muhasebeci'
};

const UserDialog = ({ open, user, onClose, onSave }: UserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        status: 'ACTIVE'
      });
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submitData = { ...formData };
    if (!submitData.password) {
      delete submitData.password;
    }
    onSave(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ad Soyad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Şifre"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
                helperText={user ? 'Değiştirmek istemiyorsanız boş bırakın' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role}
                  label="Rol"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {Object.entries(USER_ROLES).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {user && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === 'ACTIVE'}
                      onChange={(e) => setFormData({
                        ...formData,
                        status: e.target.checked ? 'ACTIVE' : 'INACTIVE'
                      })}
                    />
                  }
                  label="Aktif"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog; 
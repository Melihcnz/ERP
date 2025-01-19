import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Receipt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Ürünler', icon: <Inventory />, path: '/products' },
  { text: 'Siparişler', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Çalışanlar', icon: <People />, path: '/employees' },
  { text: 'Finans', icon: <Receipt />, path: '/finance' },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 
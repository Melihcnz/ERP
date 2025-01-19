import { Router, Request, Response } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const orderController = new OrderController();

// Middleware'i doğru şekilde tanımlayalım
router.use(authMiddleware as any);

// Route handler'ları async/await ile düzeltelim
router.post('/', async (req: Request, res: Response) => {
  await orderController.createOrder(req, res);
});

router.get('/', async (req: Request, res: Response) => {
  await orderController.getAllOrders(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await orderController.getOrderById(req, res);
});

router.put('/:id/status', async (req: Request, res: Response) => {
  await orderController.updateOrderStatus(req, res);
});

router.get('/customer/:customerId', async (req: Request, res: Response) => {
  await orderController.getOrdersByCustomer(req, res);
});

export default router; 
import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const productController = new ProductController();

// Middleware'i doğru şekilde tanımlayalım
router.use(authMiddleware as any);

// Route handler'ları async/await ile düzeltelim
router.post('/', async (req: Request, res: Response) => {
  await productController.createProduct(req, res);
});

router.get('/', async (req: Request, res: Response) => {
  await productController.getAllProducts(req, res);
});

router.get('/low-stock', async (req: Request, res: Response) => {
  await productController.getLowStockProducts(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await productController.getProductById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await productController.updateProduct(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await productController.deleteProduct(req, res);
});

export default router; 
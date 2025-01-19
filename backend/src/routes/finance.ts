import { Router } from 'express';
import { FinanceController } from '../controllers/FinanceController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const financeController = new FinanceController();

router.use(authMiddleware);

router.post('/invoices', (req, res) => financeController.createInvoice(req, res));
router.post('/payments', (req, res) => financeController.recordPayment(req, res));
router.get('/invoices/overdue', (req, res) => financeController.getOverdueInvoices(req, res));
router.get('/invoices/customer/:customerId', (req, res) => financeController.getInvoicesByCustomer(req, res));

export default router; 
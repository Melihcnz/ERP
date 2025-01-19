import { Request, Response } from 'express';
import { FinanceService } from '../services/FinanceService';

export class FinanceController {
    private financeService = new FinanceService();

    async createInvoice(req: Request, res: Response) {
        try {
            const invoice = await this.financeService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async recordPayment(req: Request, res: Response) {
        try {
            const payment = await this.financeService.recordPayment({
                ...req.body,
                created_by: req.user.userId
            });
            res.status(201).json(payment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getOverdueInvoices(req: Request, res: Response) {
        try {
            const invoices = await this.financeService.getOverdueInvoices();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getInvoicesByCustomer(req: Request, res: Response) {
        try {
            const invoices = await this.financeService.getInvoicesByCustomer(
                Number(req.params.customerId)
            );
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
} 
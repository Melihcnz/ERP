import { AppDataSource } from "../config/database";
import { Invoice } from "../entities/Invoice";
import { Payment } from "../entities/Payment";
import { Order } from "../entities/Order";

export class FinanceService {
    private invoiceRepository = AppDataSource.getRepository(Invoice);
    private paymentRepository = AppDataSource.getRepository(Payment);
    private orderRepository = AppDataSource.getRepository(Order);

    async createInvoice(invoiceData: {
        order_id: number;
        invoice_number: string;
        due_date: Date;
    }) {
        const order = await this.orderRepository.findOne({
            where: { id: invoiceData.order_id },
            relations: ['customer']
        });

        if (!order) {
            throw new Error('Sipariş bulunamadı');
        }

        const invoice = this.invoiceRepository.create({
            ...invoiceData,
            order,
            total_amount: order.total_amount,
            status: 'PENDING'
        });

        return await this.invoiceRepository.save(invoice);
    }

    async recordPayment(paymentData: {
        invoice_id: number;
        amount: number;
        payment_method: string;
        payment_reference?: string;
        created_by: number;
    }) {
        const invoice = await this.invoiceRepository.findOneBy({ id: paymentData.invoice_id });
        if (!invoice) {
            throw new Error('Fatura bulunamadı');
        }

        const payment = this.paymentRepository.create(paymentData);
        await this.paymentRepository.save(payment);

        // Fatura durumunu güncelle
        const totalPaid = await this.getTotalPaidForInvoice(invoice.id);
        invoice.status = totalPaid >= invoice.total_amount ? 'PAID' : 'PARTIAL';
        await this.invoiceRepository.save(invoice);

        return payment;
    }

    private async getTotalPaidForInvoice(invoiceId: number): Promise<number> {
        const payments = await this.paymentRepository.find({
            where: { invoice: { id: invoiceId } }
        });

        return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    }

    async getOverdueInvoices() {
        const today = new Date();
        return await this.invoiceRepository
            .createQueryBuilder("invoice")
            .where("invoice.due_date < :today", { today })
            .andWhere("invoice.status != 'PAID'")
            .getMany();
    }

    async getInvoicesByCustomer(customerId: number) {
        return await this.invoiceRepository.find({
            where: { order: { customer: { id: customerId } } },
            relations: ['order', 'order.customer']
        });
    }
} 
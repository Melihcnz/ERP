import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';

export class OrderController {
    private orderService = new OrderService();

    async createOrder(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Kullanıcı bilgisi bulunamadı' });
            }

            const order = await this.orderService.createOrder({
                ...req.body,
                created_by: req.user.userId
            });
            res.status(201).json(order);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const order = await this.orderService.getOrderById(Number(req.params.id));
            if (!order) {
                return res.status(404).json({ message: 'Sipariş bulunamadı' });
            }
            res.json(order);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            const order = await this.orderService.updateOrderStatus(
                Number(req.params.id),
                req.body.status
            );
            res.json(order);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getOrdersByCustomer(req: Request, res: Response) {
        try {
            const orders = await this.orderService.getOrdersByCustomer(
                Number(req.params.customerId)
            );
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }
} 
import { AppDataSource } from "../config/database";
import { Order } from "../entities/Order";
import { OrderDetail } from "../entities/OrderDetail";
import { Product } from "../entities/Product";
import { Customer } from "../entities/Customer";
import { User } from "../entities/User";

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    private productRepository = AppDataSource.getRepository(Product);
    private customerRepository = AppDataSource.getRepository(Customer);

    async createOrder(orderData: {
        customer_id: number;
        created_by: number;
        items: Array<{
            product_id: number;
            quantity: number;
            unit_price: number;
        }>;
    }) {
        const customer = await this.customerRepository.findOneBy({ id: orderData.customer_id });
        if (!customer) {
            throw new Error('Müşteri bulunamadı');
        }

        // Toplam tutarı hesapla
        const total_amount = orderData.items.reduce((sum, item) => 
            sum + (item.quantity * item.unit_price), 0);

        // Siparişi oluştur
        const order = this.orderRepository.create({
            customer,
            total_amount,
            status: 'PENDING',
            created_by: { id: orderData.created_by } as User
        });

        await this.orderRepository.save(order);

        // Sipariş detaylarını oluştur
        for (const item of orderData.items) {
            const product = await this.productRepository.findOneBy({ id: item.product_id });
            if (!product) {
                throw new Error(`Ürün bulunamadı: ${item.product_id}`);
            }

            const orderDetail = this.orderDetailRepository.create({
                order,
                product,
                quantity: item.quantity,
                unit_price: item.unit_price
            });

            await this.orderDetailRepository.save(orderDetail);

            // Stok güncelleme
            product.stock_quantity -= item.quantity;
            await this.productRepository.save(product);
        }

        return order;
    }

    async getOrderById(id: number) {
        return await this.orderRepository.findOne({
            where: { id },
            relations: ['customer', 'orderDetails', 'orderDetails.product']
        });
    }

    async updateOrderStatus(id: number, status: string) {
        const order = await this.orderRepository.findOneBy({ id });
        if (!order) {
            throw new Error('Sipariş bulunamadı');
        }

        order.status = status;
        return await this.orderRepository.save(order);
    }

    async getOrdersByCustomer(customerId: number) {
        return await this.orderRepository.find({
            where: { customer: { id: customerId } },
            relations: ['orderDetails', 'orderDetails.product']
        });
    }

    async getAllOrders() {
        return await this.orderRepository.find({
            relations: ['customer', 'orderDetails', 'orderDetails.product']
        });
    }
} 
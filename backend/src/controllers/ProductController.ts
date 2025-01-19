import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
    private productService = new ProductService();

    async createProduct(req: Request, res: Response) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }

    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const product = await this.productService.getProductById(Number(req.params.id));
            if (!product) {
                return res.status(404).json({ message: 'Ürün bulunamadı' });
            }
            res.json(product);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const product = await this.productService.updateProduct(Number(req.params.id), req.body);
            res.json(product);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            await this.productService.deleteProduct(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }

    async getLowStockProducts(req: Request, res: Response) {
        try {
            const products = await this.productService.getLowStockProducts();
            res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
            }
        }
    }
} 
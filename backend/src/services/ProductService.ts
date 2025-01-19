import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);
    private categoryRepository = AppDataSource.getRepository(Category);

    async createProduct(productData: {
        name: string;
        sku: string;
        description?: string;
        category_id: number;
        unit_price: number;
        stock_quantity: number;
        min_stock_level: number;
    }) {
        const category = await this.categoryRepository.findOneBy({ id: productData.category_id });
        if (!category) {
            throw new Error('Kategori bulunamadı');
        }

        const product = this.productRepository.create({
            ...productData,
            category
        });

        return await this.productRepository.save(product);
    }

    async getAllProducts() {
        return await this.productRepository.find({
            relations: ['category']
        });
    }

    async getProductById(id: number) {
        return await this.productRepository.findOne({
            where: { id },
            relations: ['category']
        });
    }

    async updateProduct(id: number, productData: Partial<Product>) {
        await this.productRepository.update(id, productData);
        return await this.getProductById(id);
    }

    async deleteProduct(id: number) {
        return await this.productRepository.delete(id);
    }

    async getLowStockProducts() {
        return await this.productRepository
            .createQueryBuilder("product")
            .where("product.stock_quantity <= product.min_stock_level")
            .getMany();
    }
} 
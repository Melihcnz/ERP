import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Category } from "./Category";
import { StockMovement } from "./StockMovement";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 200 })
    name!: string;

    @Column({ length: 50, unique: true, nullable: true })
    sku!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unit_price!: number;

    @Column({ default: 0 })
    stock_quantity!: number;

    @Column({ default: 0 })
    min_stock_level!: number;

    @OneToMany(() => StockMovement, movement => movement.product)
    stock_movements!: StockMovement[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor() {
        this.stock_quantity = 0;
        this.min_stock_level = 0;
    }
} 
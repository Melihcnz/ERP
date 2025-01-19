import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@Entity("stock_movements")
export class StockMovement {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Product, product => product.stock_movements)
    @JoinColumn({ name: "product_id" })
    product!: Product;

    @Column({ length: 20 })
    movement_type!: 'IN' | 'OUT';

    @Column()
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unit_price!: number;

    @Column({ type: "text", nullable: true })
    description!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    created_by!: User;

    @CreateDateColumn()
    created_at!: Date;
} 
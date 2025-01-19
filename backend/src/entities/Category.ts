import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @ManyToOne(() => Category, category => category.children, { nullable: true })
    @JoinColumn({ name: "parent_id" })
    parent!: Category;

    @OneToMany(() => Category, category => category.parent)
    children!: Category[];

    @CreateDateColumn()
    created_at!: Date;
} 
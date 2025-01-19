import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    first_name!: string;

    @Column({ length: 50 })
    last_name!: string;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column()
    password_hash!: string;

    @Column({ default: true })
    is_active!: boolean;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: "role_id" })
    role!: Role;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor() {
        this.is_active = true;
    }
} 
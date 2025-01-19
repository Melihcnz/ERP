import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50, unique: true })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => User, user => user.role)
    users!: User[];
} 
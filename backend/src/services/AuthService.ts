import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Role);

    async register(userData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        role_id: number;
    }) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = this.userRepository.create({
            ...userData,
            password_hash: hashedPassword
        });

        return await this.userRepository.save(user);
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ 
            where: { email },
            relations: ['role']
        });

        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            throw new Error('Geçersiz şifre');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role.name },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return { token, user };
    }
} 
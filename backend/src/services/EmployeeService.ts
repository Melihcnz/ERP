import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import bcrypt from "bcrypt";

export class EmployeeService {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Role);

    async createEmployee(employeeData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        role_id: number;
    }) {
        const role = await this.roleRepository.findOneBy({ id: employeeData.role_id });
        if (!role) {
            throw new Error('Rol bulunamadı');
        }

        const hashedPassword = await bcrypt.hash(employeeData.password, 10);
        
        const employee = this.userRepository.create({
            ...employeeData,
            password_hash: hashedPassword,
            role
        });

        return await this.userRepository.save(employee);
    }

    async getAllEmployees() {
        return await this.userRepository.find({
            relations: ['role'],
            select: ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at']
        });
    }

    async getEmployeeById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['role'],
            select: ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at']
        });
    }

    async updateEmployee(id: number, employeeData: Partial<User>) {
        if (employeeData.password) {
            employeeData.password_hash = await bcrypt.hash(employeeData.password, 10);
            delete employeeData.password;
        }

        await this.userRepository.update(id, employeeData);
        return await this.getEmployeeById(id);
    }

    async deactivateEmployee(id: number) {
        await this.userRepository.update(id, { is_active: false });
        return await this.getEmployeeById(id);
    }

    async getEmployeesByRole(roleId: number) {
        return await this.userRepository.find({
            where: { role: { id: roleId } },
            relations: ['role']
        });
    }
} 
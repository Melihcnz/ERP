import { Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';

export class EmployeeController {
    private employeeService = new EmployeeService();

    async createEmployee(req: Request, res: Response) {
        try {
            const employee = await this.employeeService.createEmployee(req.body);
            res.status(201).json(employee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllEmployees(req: Request, res: Response) {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeeById(req: Request, res: Response) {
        try {
            const employee = await this.employeeService.getEmployeeById(Number(req.params.id));
            if (!employee) {
                return res.status(404).json({ message: 'Çalışan bulunamadı' });
            }
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateEmployee(req: Request, res: Response) {
        try {
            const employee = await this.employeeService.updateEmployee(Number(req.params.id), req.body);
            res.json(employee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deactivateEmployee(req: Request, res: Response) {
        try {
            const employee = await this.employeeService.deactivateEmployee(Number(req.params.id));
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeesByRole(req: Request, res: Response) {
        try {
            const employees = await this.employeeService.getEmployeesByRole(Number(req.params.roleId));
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
} 
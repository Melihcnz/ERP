import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const employeeController = new EmployeeController();

router.use(authMiddleware);

router.post('/', (req, res) => employeeController.createEmployee(req, res));
router.get('/', (req, res) => employeeController.getAllEmployees(req, res));
router.get('/:id', (req, res) => employeeController.getEmployeeById(req, res));
router.put('/:id', (req, res) => employeeController.updateEmployee(req, res));
router.patch('/:id/deactivate', (req, res) => employeeController.deactivateEmployee(req, res));
router.get('/role/:roleId', (req, res) => employeeController.getEmployeesByRole(req, res));

export default router; 
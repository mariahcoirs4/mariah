"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required',
                });
            }
            const token = await auth_service_1.authService.login(email, password);
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
            });
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message || 'Invalid email or password',
            });
        }
    }
    async verify(req, res, next) {
        // AuthenticatedRequest means requireAdmin passed, so req.admin is set
        return res.status(200).json({
            success: true,
            admin: req.admin,
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map
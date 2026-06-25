"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_controller_1 = require("../controllers/enquiry.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public: Submit a new enquiry from any form on the site
router.post('/', enquiry_controller_1.enquiryController.submitEnquiry);
// Admin-only: List, search, filter, delete enquiries
router.get('/', auth_middleware_1.requireAdmin, enquiry_controller_1.enquiryController.getAllEnquiries);
router.delete('/:id', auth_middleware_1.requireAdmin, enquiry_controller_1.enquiryController.deleteEnquiry);
exports.default = router;
//# sourceMappingURL=enquiry.routes.js.map
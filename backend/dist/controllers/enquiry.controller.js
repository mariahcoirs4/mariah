"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryController = exports.EnquiryController = void 0;
const enquiry_service_1 = require("../services/enquiry.service");
const enquiry_validator_1 = require("../validators/enquiry.validator");
class EnquiryController {
    async submitEnquiry(req, res, next) {
        try {
            const validatedInput = enquiry_validator_1.createEnquirySchema.parse(req.body);
            const enquiry = await enquiry_service_1.enquiryService.createEnquiry(validatedInput);
            return res.status(201).json({
                success: true,
                message: 'Enquiry submitted successfully',
                data: enquiry,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllEnquiries(req, res, next) {
        try {
            const { search, startDate, endDate } = req.query;
            const enquiries = await enquiry_service_1.enquiryService.getEnquiries({
                search: typeof search === 'string' ? search : undefined,
                startDate: typeof startDate === 'string' ? startDate : undefined,
                endDate: typeof endDate === 'string' ? endDate : undefined,
            });
            return res.status(200).json({
                success: true,
                data: enquiries,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteEnquiry(req, res, next) {
        try {
            const { id } = req.params;
            const enquiryId = parseInt(id, 10);
            if (isNaN(enquiryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid enquiry ID format',
                });
            }
            await enquiry_service_1.enquiryService.deleteEnquiry(enquiryId);
            return res.status(200).json({
                success: true,
                message: 'Enquiry deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EnquiryController = EnquiryController;
exports.enquiryController = new EnquiryController();
//# sourceMappingURL=enquiry.controller.js.map
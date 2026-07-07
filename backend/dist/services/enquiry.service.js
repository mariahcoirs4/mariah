"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryService = exports.EnquiryService = void 0;
const enquiry_repository_1 = require("../repositories/enquiry.repository");
const email_service_1 = require("./email.service");
class EnquiryService {
    async createEnquiry(input) {
        const enquiry = await enquiry_repository_1.enquiryRepository.create(input);
        await email_service_1.emailService.sendEnquiryEmails(enquiry);
        return enquiry;
    }
    async getEnquiries(filters = {}) {
        const queryFilter = {};
        if (filters.search) {
            queryFilter.search = filters.search.trim().toLowerCase();
        }
        if (filters.startDate) {
            const date = new Date(filters.startDate);
            if (!isNaN(date.getTime())) {
                queryFilter.startDate = date;
            }
        }
        if (filters.endDate) {
            const date = new Date(filters.endDate);
            if (!isNaN(date.getTime())) {
                // Set end of day (23:59:59.999) to cover all submissions on that date
                date.setHours(23, 59, 59, 999);
                queryFilter.endDate = date;
            }
        }
        return enquiry_repository_1.enquiryRepository.findAll(queryFilter);
    }
    async deleteEnquiry(id) {
        return enquiry_repository_1.enquiryRepository.delete(id);
    }
}
exports.EnquiryService = EnquiryService;
exports.enquiryService = new EnquiryService();
//# sourceMappingURL=enquiry.service.js.map
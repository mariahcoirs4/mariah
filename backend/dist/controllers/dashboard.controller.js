"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const blog_repository_1 = require("../repositories/blog.repository");
const enquiry_repository_1 = require("../repositories/enquiry.repository");
class DashboardController {
    async getSummary(req, res, next) {
        try {
            const [totalBlogs, totalPublishedBlogs, totalEnquiries, recentEnquiries, recentBlogs,] = await Promise.all([
                blog_repository_1.blogRepository.count(false),
                blog_repository_1.blogRepository.count(true),
                enquiry_repository_1.enquiryRepository.count(),
                enquiry_repository_1.enquiryRepository.findRecent(5),
                blog_repository_1.blogRepository.findRecent(5),
            ]);
            return res.status(200).json({
                success: true,
                data: {
                    totalBlogs,
                    totalPublishedBlogs,
                    totalEnquiries,
                    recentEnquiries,
                    recentBlogs,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map
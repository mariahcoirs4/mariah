import { Request, Response, NextFunction } from 'express';
import { blogRepository } from '../repositories/blog.repository';
import { enquiryRepository } from '../repositories/enquiry.repository';

export class DashboardController {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        totalBlogs,
        totalPublishedBlogs,
        totalEnquiries,
        recentEnquiries,
        recentBlogs,
      ] = await Promise.all([
        blogRepository.count(false),
        blogRepository.count(true),
        enquiryRepository.count(),
        enquiryRepository.findRecent(5),
        blogRepository.findRecent(5),
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
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();

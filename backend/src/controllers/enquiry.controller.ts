import { Request, Response, NextFunction } from 'express';
import { enquiryService } from '../services/enquiry.service';
import { createEnquirySchema } from '../validators/enquiry.validator';

export class EnquiryController {
  async submitEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = createEnquirySchema.parse(req.body);
      const enquiry = await enquiryService.createEnquiry(validatedInput);
      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully',
        data: enquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEnquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, startDate, endDate } = req.query;
      const enquiries = await enquiryService.getEnquiries({
        search: typeof search === 'string' ? search : undefined,
        startDate: typeof startDate === 'string' ? startDate : undefined,
        endDate: typeof endDate === 'string' ? endDate : undefined,
      });

      return res.status(200).json({
        success: true,
        data: enquiries,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const enquiryId = parseInt(id, 10);
      if (isNaN(enquiryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid enquiry ID format',
        });
      }

      await enquiryService.deleteEnquiry(enquiryId);
      return res.status(200).json({
        success: true,
        message: 'Enquiry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const enquiryController = new EnquiryController();

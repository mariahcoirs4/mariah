import { Router } from 'express';
import { enquiryController } from '../controllers/enquiry.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public: Submit a new enquiry from any form on the site
router.post('/', enquiryController.submitEnquiry);

// Admin-only: List, search, filter, delete enquiries
router.get('/', requireAdmin, enquiryController.getAllEnquiries);
router.delete('/:id', requireAdmin, enquiryController.deleteEnquiry);

export default router;

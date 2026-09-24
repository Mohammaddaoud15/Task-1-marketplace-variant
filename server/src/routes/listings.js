import { Router } from 'express';
import {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  markListingSold,
  deleteListing
} from '../controllers/listingController.js';

const router = Router();

// TODO: wire up the routes described in README.md section 3.

router.get('/', getAllListings);
router.get('/:id', getListing);
router.post('/', createListing);
router.patch('/:id/sold', markListingSold);
router.patch('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;

import Joi from 'joi';
import { Listing } from '../models/Listing.js';

// TODO: write a validation schema for create/update per README.md section 2.
const createSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string(),
  category: Joi.string(),
  condition: Joi.string(),
  status: Joi.string(),
  seller: Joi.string()
});

const updateSchema = Joi.object({
  title: Joi.string(),
  price: Joi.number().min(0),
  description: Joi.string(),
  category: Joi.string(),
  condition: Joi.string(),
  status: Joi.string(),
  seller: Joi.string()
});

// GET /api/listings
// TODO: implement per README.md section 3.
export async function getAllListings(req, res, next) {
  try {
    const listings = await Listing.find({ status: { $ne: 'removed' } })
      .sort({ createdAt: -1 })
      .populate('seller', 'name email')
      ;
    res.json(listings);
  } catch (err) { next(err); }
}

// GET /api/listings/:id
// TODO: implement per README.md sections 3 and 5.
export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      status: { $ne: 'removed' }
    }).populate('seller', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) { next(err); }
}

// POST /api/listings
// TODO: implement per README.md section 3.
export async function createListing(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    
    const existingListing = await Listing.findOne({ title: value.title });
    if (existingListing) return res.status(409).json({ message: 'Listing already exists' });

    const listing = await Listing.create(value);
    res.status(201).json(listing);
  } catch (err) { next(err); }
}

// PATCH /api/listings/:id
// TODO: implement per README.md sections 3 and 5.
export async function updateListing(req, res, next) {
  try {
    const { value, error } = updateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const listing = await Listing.findByIdAndUpdate(req.params.id, {$set: value}, { new: true, runValidators: true  });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) { next(err); }
}

export async function markListingSold(req, res, next) {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, status: { $ne: 'removed' } },
      { $set: { status: 'sold' } },
      { new: true, runValidators: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) { next(err); }
}

// DELETE /api/listings/:id
// TODO: implement per README.md sections 4 and 5.
export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'removed' } },
      { new: true, runValidators: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ ok: true, listing });
  } catch (err) { next(err); }
}

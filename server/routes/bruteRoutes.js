import express from 'express';
import { BruteController } from '../controllers/bruteController.js';

const router = express.Router();

// GET /api - API information
router.get('/', BruteController.getInfo);

// GET /api/languages - Get supported languages
router.get('/languages', BruteController.getLanguages);

// POST /api/brute - Analyze ciphertext
router.post('/brute', BruteController.analyze);

export default router;

import express, { Request, Response } from 'express';

// Import models

// Create router for export
const router = express.Router();

// Define routes
router.post('/auth/login', (req: Request, res: Response) => {

});

router.post('/auth/logout', (req: Request, res: Response) => {
 
});

// Export route with unique name
export { router as authRouter }
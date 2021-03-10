import express, { Request, Response } from 'express';

// Create router for export
const router = express.Router();

// Define routes
router.get('/', (req: Request, res: Response) => {
  res.status(200).send({status: "alive"});
});

// Export route with unique name
export { router as statusRouter }
import express, { Request, Response } from 'express';

// Import middleware
import { needsRole } from '../middleware/authentication';

// Import models
import { Banner } from '../models/banner';

// Import enumerations
import EPermissions from '../enumerations/permissions';

// Create router for export
const router = express.Router();

// Define routes
router.get('/api/banner/all', (req: Request, res: Response) => {
  Banner.find({})
    .then((docs) => {
      res.status(200).send(docs);
    });
});

router.get('/api/banner/active', (req: Request, res: Response) => {
  Banner.find({
    "enabled": true,
    "lat": { $ne: 0 },
    "long": { $ne: 0 }
  })
    .then((docs) => {
      res.status(200).send(docs);
    });
});

router.post('/api/banner', needsRole([EPermissions.MANAGE_BANNERS]), (req: Request, res: Response) => {
  const banner = Banner.build(req.body);

  banner.save()
  .then(() => {
    res.status(201).send(banner);
  })
  .catch(error => {
    const errorType = error.name;

    switch (errorType) {
      case "ValidationError":
        res.status(400).send(error.message);
        break;
      default:
        res.status(500).send("An error has occured");
        break;
    }

  });
});

// Export route with unique name
export { router as bannerRouter }
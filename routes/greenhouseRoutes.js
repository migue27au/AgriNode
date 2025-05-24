import express from 'express';
import * as greenhouseController from '../controllers/greenhouseController.js';

const router = express.Router();


router.post('/create', greenhouseController.createGreenhouse);
router.get('/getAll', greenhouseController.getGreenhousesByOwner);
router.get('/get/:alias', greenhouseController.getGreenhouseByOwnerAndAlias);
router.post('/update/:id', greenhouseController.updateGreenhouse);
router.delete('/delete/:id', greenhouseController.deleteGreenhouse);
router.post('/authenticate', greenhouseController.authenticateGreenhouse);
router.delete('/add/data', greenhouseController.createGreenhouseData);
router.post('/add/irrigation', greenhouseController.createGreenhouseIrrigation);

export default router;



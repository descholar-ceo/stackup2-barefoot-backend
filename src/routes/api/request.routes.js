import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import { validateTripRequest } from '../../utils/validations';

const { createTripRequest } = RequestController;
const {
    isUserLoggedInAndVerified
} = Authentication;

const router = express.Router();

router.post('/', [isUserLoggedInAndVerified, validateTripRequest], createTripRequest);

export default router;
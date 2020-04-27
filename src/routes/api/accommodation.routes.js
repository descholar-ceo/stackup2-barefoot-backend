import express from 'express';
import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';
import accommodationMiddleware from '../../middlewares/ratingChecker';
import {
    checkAccommodationBookingInfo,
    validateRatingInfo,
    validateParamsId,
} from '../../utils/validations';

const {
    AccommodationController,
} = controllers;

const {
    bookAccommodation,
    rateAccommodation,
    getRatesAccommodation,
} = AccommodationController;

const {
    isUserLoggedInAndVerified
} = Authentication;

const { isYourAccommodationBooked, 
    isYourAccommodationValid,
    isTripRequestValidIsYours,
    rateTheAccommodation, 
} = accommodationMiddleware;
const router = express.Router();

router.post('/book', [isUserLoggedInAndVerified, checkAccommodationBookingInfo], bookAccommodation);
router.post(
    '/rates', 
isUserLoggedInAndVerified, 
validateRatingInfo, 
isTripRequestValidIsYours, 
isYourAccommodationBooked, 
rateTheAccommodation,
rateAccommodation
);
router.get(
    '/rates/:accommodationId', 
isUserLoggedInAndVerified, 
validateParamsId, 
isYourAccommodationValid, 
getRatesAccommodation
);

export default router;

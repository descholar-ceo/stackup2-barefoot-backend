import express from 'express';
import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';

import {
    checkAccommodationBookingInfo,
} from '../../utils/validations';

const {
    AccommodationController,
} = controllers;

const {
    bookAccommodation,
    getBookedAccommodation
} = AccommodationController;

const {
    isUserLoggedInAndVerified
} = Authentication;

const router = require('express').Router();

router.post('/book', [isUserLoggedInAndVerified, checkAccommodationBookingInfo], bookAccommodation);
router.get('/:accommodationId', getBookedAccommodation);

export default router;

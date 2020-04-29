import express from 'express';
import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';

import {
    checkAccommodationBookingInfo,
} from '../../utils/validations';
import UserAccommodationReaction from '../../middlewares/userAccommodationReaction';

const {
    AccommodationController,
} = controllers;

const {
    bookAccommodation,
    likeAccommodation,
    dislikeAccommodation,
    unlikeAccommodation,
    unDislikeAccommodation,
    getUserReactionsOnAccommodation,
} = AccommodationController;

const {
    isUserLoggedInAndVerified
} = Authentication;

const {
    checkAccommodationInfo,
    checkUserAccommodationReactionExistence,
    hasUserLikedAccommodationBefore,
    hasUserDislikedAccommodationBefore,
} = UserAccommodationReaction;

const router = require('express').Router();

router.post('/book', [isUserLoggedInAndVerified, checkAccommodationBookingInfo], bookAccommodation);
router.post('/:id/like', [
    isUserLoggedInAndVerified,
    checkAccommodationInfo,
], likeAccommodation);
router.post('/:id/dislike', [
    isUserLoggedInAndVerified,
    checkAccommodationInfo,
], dislikeAccommodation);
router.patch('/:id/unlike', [
    isUserLoggedInAndVerified, 
    checkAccommodationInfo,
    checkUserAccommodationReactionExistence,
    hasUserLikedAccommodationBefore,
], unlikeAccommodation);
router.patch('/:id/un-dislike', [
    isUserLoggedInAndVerified,
    checkAccommodationInfo,
    checkUserAccommodationReactionExistence,
    hasUserDislikedAccommodationBefore,
], unDislikeAccommodation);
router.get('/:id/user-reactions', [
    isUserLoggedInAndVerified,
    checkAccommodationInfo,
], getUserReactionsOnAccommodation);

export default router;

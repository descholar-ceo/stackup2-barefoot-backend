import AccommodationService from '../services/accommodation.service';
import responseHandlers from '../utils/responseHandlers';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import UserAccommodationReactionUtils from '../utils/userAccommodationReaction.utils';

const {
    successResponse,
    errorResponse,
} = responseHandlers;

const {
    bookedAccommodation,
    duplicateAccommodationBookings,
    likedAccommodation,
    dislikedAccommodation,
    unlikedAccommodation,
    unDislikedAccommodation,
} = customMessages;

const {
    badRequest,
    created,
    ok,
} = statusCodes;

const {
    handleBookAccommodation,
    handleLikeAccommodation,
    handleDislikeAccommodation,
    handleUnlikeAccommodation,
    handleUnDislikeAccommodation,
} = AccommodationService;

const {
    getAccommodationLikes,
    getAccommodationDislikes,
    getAccommodationNeutralReactions,
} = AccommodationService;

const {
    extractAccommodationIdAndUserId,
} = UserAccommodationReactionUtils;  

/**
* @description Accommodations controller class
*/
export default class AccommodationController {
    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async bookAccommodation(req, res) {
        try {
            const bookingInfo = req.body;
            const bookingDetail = await handleBookAccommodation(bookingInfo);
            return successResponse(res, created, bookedAccommodation, undefined, bookingDetail);    
        } catch (error) {
            return errorResponse(res, badRequest, duplicateAccommodationBookings);
        }
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async likeAccommodation(req, res) {
        const { userId, accommodationId } = extractAccommodationIdAndUserId(req);
        await handleLikeAccommodation(accommodationId, userId);
        return successResponse(res, created, likedAccommodation, undefined);
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async dislikeAccommodation(req, res) {
        const extratedInfo = extractAccommodationIdAndUserId(req);
        const { accommodationId, userId } = extratedInfo;
        await handleDislikeAccommodation(accommodationId, userId);
        return successResponse(res, created, dislikedAccommodation, undefined);
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async unlikeAccommodation(req, res) {
        const extratedInfo = extractAccommodationIdAndUserId(req);
        await handleUnlikeAccommodation(extratedInfo.accommodationId, extratedInfo.userId);
        return successResponse(res, ok, unlikedAccommodation, undefined);
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async unDislikeAccommodation(req, res) {
        await handleUnDislikeAccommodation(
            extractAccommodationIdAndUserId(req).accommodationId,
            extractAccommodationIdAndUserId(req).userId
        );
        return successResponse(res, ok, unDislikedAccommodation, undefined);
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} user reactions
     * @description Use this get user reactions on a specific accommodation facility
     */
    static async getUserReactionsOnAccommodation(req, res) {
        const { id } = req.params;
        const likes = await getAccommodationLikes(id);
        const dislikes = await getAccommodationDislikes(id);
        const neutral = await getAccommodationNeutralReactions(id);
        return successResponse(res, ok, unDislikedAccommodation, undefined, {
            likes, dislikes, neutral
        });
    }
}

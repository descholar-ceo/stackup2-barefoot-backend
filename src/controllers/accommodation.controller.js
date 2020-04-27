import AccommodationService from '../services/accommodation.service';
import responseHandlers from '../utils/responseHandlers';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';

const {
    successResponse,
    errorResponse,
} = responseHandlers;

const {
    bookedAccommodation,
    duplicateAccommodationBookings,
    successRating,
    failedRating,
    notRated,
    allRates,
} = customMessages;

const {
    badRequest,
    created,
    ok,
} = statusCodes;

const {
    handleBookAccommodation,
    handleRatingAccommodation,
    getAllRatedAccommodationById
} = AccommodationService;

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
    static async rateAccommodation(req, res) {
        try {
            const ratingInfo = { ...req.body };
            const ratingDetail = await handleRatingAccommodation(ratingInfo);
            return successResponse(
                res, 
                created, 
                successRating, 
                undefined, 
                ratingDetail
);    
        } catch (error) {
            return errorResponse(
                res, 
                badRequest, 
                failedRating
);
        }
    }

            /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async getRatesAccommodation(req, res) {
        const { accommodationId } = req.params;
            const rated = await getAllRatedAccommodationById(accommodationId);
            const [rate] = rated;
            console.log(rate);
           if (rate === null || rate === undefined) {
               return errorResponse(res, badRequest, notRated);
           }
            return successResponse(
                res, 
                ok, 
                allRates, 
                undefined, 
                rated
);    
    }
}

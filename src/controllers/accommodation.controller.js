import AccommodationService from '../services/accommodation.service';
import responseHandlers from '../utils/responseHandlers';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import handleEmailNotifications from '../utils/handleEmailNotifications.util';
import { bookAccommodationMessage, accommodationTripManager } from '../utils/emailMessages';
import UserService from '../services/authentication.service';

const {
    successResponse,
    errorResponse,
} = responseHandlers;

const {
    bookedAccommodation,
    duplicateAccommodationBookings,
    bookingInfo,
} = customMessages;

const {
    badRequest,
    created,
    ok,
} = statusCodes;

const {
    handleBookAccommodation,
    getBookingById
} = AccommodationService;

const { getUserById } = UserService;

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
            const bookingData = req.body;
            const currentUser = req.sessionUser;
            let manager = await getUserById(currentUser.lineManager);
            manager = manager.dataValues;
            const bookingDetail = await handleBookAccommodation(bookingData);
            const link = `${process.env.APP_URL}/api/accommodations/${bookingDetail.id}`;
            await handleEmailNotifications(currentUser, bookAccommodationMessage, link, 'Book accommodation');
            await handleEmailNotifications(manager, accommodationTripManager, link, 'Book accommodation');
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
    static async getBookedAccommodation(req, res) {
    const { accommodationId } = req.params;
    const accommodation = await getBookingById(accommodationId);
    return successResponse(res, ok, bookingInfo, null, accommodation);
    }
}

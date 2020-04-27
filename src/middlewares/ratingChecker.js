import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import responseHandler from '../utils/responseHandlers';
import RequestService from '../services/request.service';
import AccommodationService from '../services/accommodation.service';

const { errorResponse } = responseHandler;
const { badRequest } = statusCodes;
const { 
    notAssociated, 
    requestNotExists,
    notBookingOwner,
    beforeTripDate,
    notExistAccommodation,
    notBooked, 
} = customMessages;
const { findTripRequestById } = RequestService;
const { 
  getBookedAccommodationById, 
  getAccommodationById, 
  getBookedAccommodation 
} = AccommodationService;
/**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists, was booked and if you are the owner
 * get request id from request body, checks if the request exist or not
 */
const isTripRequestValidIsYours = async (req, res, next) => {
  const tokenDecoded = req.sessionUser;
  const request = await findTripRequestById(req.body.requestId);
  if (!request) {
      return errorResponse(res, badRequest, requestNotExists);
  }
  const { dataValues } = request;
  if (tokenDecoded.id !== request.dataValues.userId) {
    return errorResponse(res, badRequest, notBookingOwner);
  }
  req.request = dataValues;
  next();
};
/**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists, was booked and if you are the owner
 * get request id from request body, checks if the request exist or not
 */
const isYourAccommodationBooked = async (req, res, next) => {
    const tokenDecoded = req.sessionUser;
    const currentDate = new Date();
    const booking = await getBookedAccommodationById(req.body.requestId);
    if (!booking) {
          return errorResponse(res, badRequest, notAssociated);
    }
    const { dataValues } = booking;
    req.booking = dataValues;
    next();
  };
  /**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists, was booked and if you are the owner
 * get request id from request body, checks if the request exist or not
 */
const rateTheAccommodation = async (req, res, next) => {
  const tokenDecoded = req.sessionUser;
  const currentDate = new Date();
  const { booking } = req;

  const requestTravelDate = new Date(booking.arrivalDate);
  if (requestTravelDate > currentDate) {
    return errorResponse(res, badRequest, beforeTripDate);
  }
  req.body = {
      ...req.body,
      accommodationId: booking.accommodationId,
      createdBy: tokenDecoded.id
  };
  next();
};
  /**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists and if it was rated
 * get accommodation id from request parameter, checks if the accommodation exist or not
 */
const isYourAccommodationValid = async (req, res, next) => {
  const accommodation = await getAccommodationById(req.params.accommodationId);
  if (!accommodation) {
      return errorResponse(res, badRequest, notExistAccommodation);
  }
  const bookedAccommodation = await getBookedAccommodation(req.params.accommodationId);
  if (!bookedAccommodation) {
    return errorResponse(res, badRequest, notBooked);
  }
  next();
};

  export default { 
    isYourAccommodationBooked, 
    isYourAccommodationValid, 
    rateTheAccommodation, 
    isTripRequestValidIsYours 
  };

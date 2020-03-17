import _ from 'lodash';
import requestService from '../services/request.service';
import responseHandler from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import requestStatus from '../utils/tripRequestsStatus.util';
import userRoles from '../utils/userRoles.utils';
import UserService from '../services/authentication.service';

const { getOneRequestFromDb, getOneRequestFromDb1, getOneRequestFromDb2, findTripRequestById } = requestService;
const { errorResponse } = responseHandler;
const {
  notExistRequest,
  notYourRequest,
  notOpenRequest,
  emptyUpdate,
  tripRequestNotFound,
  notExistUser,
  cannotAssignApproved,
  cannotAssignRejected,
  cannotAssignToNonManager,
  requesterNotMyDirectReport,
} = customMessages;
const { badRequest, notFound, forbidden, unAuthorized } = statusCodes;
const { PENDING, ACCEPTED, REJECTED } = requestStatus;
const { MANAGER } = userRoles;

/**
 * @param {String/Date} newData Node/Express Request object
 * @param {String/Date} existingData Node/Express Response object
 * @returns {String/Date} Node/Express Next callback function or an error response
 * @description Checks if request exists,
 * get request id from request parameter, checks if the request exist or not
 */
const checkData = async (newData, existingData) => (
  newData !== undefined ? newData : existingData
);

/**
 * @param {Request} body Node/Express Request object
 * @param {Response} id Node/Express Response object
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if request exists,
 * get request id from request parameter, checks if the request exist or not
 */
const requestFromDb2 = async (body, id, type) => {
  const result1 = await getOneRequestFromDb1(id);
  const { dataValues } = result1;
  return {
    travelTo: checkData(body, dataValues.travelTo),
    travelFrom: checkData(body, dataValues.travelFrom),
    travelDate: checkData(body, dataValues.travelDate),
    returnDate: checkData(body, dataValues.returnDate),
  };
};

/**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if request exists,
 * get request id from request parameter, checks if the request exist or not
 */
const isRequestValid = async (req, res, next) => {
  const { requestId } = req.params;
  const result = await getOneRequestFromDb(requestId);
  
  if (Object.keys(req.body).length === 0) {
    return errorResponse(res, badRequest, emptyUpdate);
  }
  if (!result) {
    return errorResponse(res, badRequest, notExistRequest);
  }
  const { dataValues } = result;
  
  req.requestOwner = dataValues.userId;
  req.requestStatus = dataValues.status;
  req.body = {
    travelTo: await (await requestFromDb2(req.body.travelTo, dataValues.id, dataValues.travelType)).travelTo,
    travelFrom: await (await requestFromDb2(req.body.travelFrom, dataValues.id, dataValues.travelType)).travelFrom,
    travelType: await checkData(req.body.travelType, dataValues.travelType),
    travelDate: await (await requestFromDb2(req.body.travelDate, dataValues.id, dataValues.travelType)).travelDate,
    returnDate: await (await requestFromDb2(req.body.returnDate, dataValues.id, dataValues.travelType)).returnDate,
    travelReason: await checkData(req.body.travelReason, dataValues.travelReason),
    accommodation: await checkData(req.body.accommodation, dataValues.accommodation)
  };
  next();
};

/**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if request exists,
 * get request id from request parameter, checks if the request exist or not
 */
const isRequestOpenIsRequestYours = async (req, res, next) => {
  const tokenDecoded = req.sessionUser;
  const owner = req.requestOwner;
  const status = req.requestStatus;
  if (tokenDecoded.id !== owner) {
    return errorResponse(res, badRequest, notYourRequest);
  }
  if (status !== PENDING) {
    return errorResponse(res, badRequest, notOpenRequest);
  }
  if (!req.body.returnDate) {
    req.body = _.omit(req.body, 'returnDate');
  }
  next();
};

/**
   * @description Checks if the trip request exists
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @param {NextFunction} next next callback function
   * @returns {NextFunction | Object} next or error response object
   */
const checkTripRequest = async (req, res, next) => {
  const { tripRequestId } = req.params;
  const tripRequest = await findTripRequestById(tripRequestId);
  if (tripRequest) {
    const { dataValues } = tripRequest;
    const { status } = dataValues;
    req.tripRequestCurrentStatus = status;
    req.tripRequestData = dataValues;
    return next();
  } else {
    return errorResponse(res, notFound, tripRequestNotFound);
  }
};

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next next callback function
 * @returns {object} next or error response object
 * @description Checks if user is verified and is manager and if the request is already approved
 */
const isNewUserAManager = async (req, res, next) => {
  const { userId } = req.body;
  if (req.tripRequestCurrentStatus === ACCEPTED) {
    return errorResponse(res, forbidden, cannotAssignApproved);
  }
  if (req.tripRequestCurrentStatus === REJECTED) {
    return errorResponse(res, forbidden, cannotAssignRejected);
  }
  const user = await UserService.getUserById(userId);
  if (!user) return errorResponse(res, notFound, notExistUser);
  const { role } = user;
  if (role !== MANAGER) return errorResponse(res, forbidden, cannotAssignToNonManager);
  req.newManager = user.dataValues;
  next();
};

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next next callback function
 * @returns {object} next or error response object
 * @description Checks if the current manager has rights on this trip request
 */
const checkRequesterManager = async (req, res, next) => {
  const { userId, handledBy } = req.tripRequestData;
  const managerId = req.sessionUser.id;
  const user = await UserService.getUserById(userId);
  const { lineManager } = user;
  if (managerId !== lineManager && managerId !== handledBy) {
    return errorResponse(res, unAuthorized, requesterNotMyDirectReport);
  }
  next();
};

export default {
  isRequestOpenIsRequestYours,
  isRequestValid,
  checkTripRequest,
  isNewUserAManager,
  checkRequesterManager,
};

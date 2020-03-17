import Joi from '@hapi/joi';
import _ from 'lodash';
import customMessages from './customMessages';
import responseHandlers from './responseHandlers';
import statusCodes from './statusCodes';
import Validators from './validators';
import utils from './authentication.utils';
import AccommodationService from '../services/accommodation.service';
import tripRequestsService from '../services/request.service';

const { errorResponse } = responseHandlers;

const { badRequest } = statusCodes;

const {
  invalidTravelType, invalidReturnDate, 
  travelFromEqualError, travelDateError, arrayLengthError,
  accommodationNotExist,
  tripRequestNotExist,
  travelFromNETravelTo
} = customMessages;
const { 
  validationOTripRequest, 
  validationMTripRequest,
  validateReturnDate,
  validateTripRequestsSearch,
  validateTripRequestsSearchField,
  validateBookAccommodation,
  validateRequestId,
  validateUserId
} = Validators;
const { decodeToken } = utils;

const {
  getAccommodationById,
} = AccommodationService;

const {
  getTripRequestById,
} = tripRequestsService;

/**
* @param {string} pattern
* @param {string} messages
* @param {boolean} isProfileUpdate
* @returns {object} a chained validation methods
*/
const validationMethods = (pattern, messages, isProfileUpdate) => {
  const methods = isProfileUpdate ? Joi.string()
    .regex(pattern)
    .messages(messages) : Joi.string()
      .regex(pattern)
      .trim()
      .required()
      .messages(messages);
  return methods;
};

/**
* @param {object} user
* @param {object} isProfileUpdate
* @returns {object} return body assigned to their validation methods
*/
const validateSignup = (user) => {
  const { isProfileUpdate } = user;
  const schema = Joi.object({
    firstName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidFirstname}` }, isProfileUpdate),
    lastName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidLastname}` }, isProfileUpdate),
    username: validationMethods(/^([a-zA-Z0-9@_.-]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidUsername}` }, isProfileUpdate),
    email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` }, isProfileUpdate),
    password: validationMethods(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{8,}$/, { 'string.pattern.base': `${customMessages.invalidPassword}` }, isProfileUpdate),
    gender: validationMethods(/^Male$|^male$|^Female$|^female$/, { 'string.pattern.base': `${customMessages.invalidGender}` }, isProfileUpdate),
    address: validationMethods(/^(\w)+$/, { 'string.pattern.base': `${customMessages.invalidAddress}` }, isProfileUpdate),
  });
  return schema.validate(user, {
    abortEarly: false,
    allowUnknown: true
  });
};

/**
 * @param {object} data
 * @returns {object} Return the validations
 */
const validateRole = (data) => {
  const schema = Joi.object({
    role: validationMethods(
      /^super administrator$|^travel administrator$|^travel team member$|^requester$|^manager$/,
      { 'string.pattern.base': `${customMessages.invalidRole}` }
    ),
    email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` })
  });
  return schema.validate(data, {
    abortEarly: false
  });
};
/**
* @param {object} password
* @returns {object} return body assigned to their validation methods
*/
const validatePassword = password => {
  const schema = Joi.object({
    password: validationMethods(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{8,}$/, { 'string.pattern.base': `${customMessages.invalidPassword}` })
  });
  return schema.validate(password, {
    abortEarly: false,
    allowUnknown: true
  });
};

/**
* @param {object} error
* @param {object} res
* @param {object} next
* @returns {object} return body assigned to their validation methods
*/
const displayErrorMessages = (error, res, next) => {
  if (error) {
    const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, messages);
  }
  return next();
};
/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} error or next
* @description Verifies if token has not expired
*/
export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    await decodeToken(token);
    next();
  } catch (error) {
    return errorResponse(res, statusCodes.badRequest, customMessages.tokenInvalid);
  }
};

/**
* @param {object} data
* @returns {Object} return data in lowercase
*/
const lowerCase = data => `${data}`.toLowerCase();

 /** 
   * @param {Response} travelFrom 
   * @param {Response} travelTo 
   * @param {Response} travelDate
   * @param {Response} travelType
   * @returns {Object} Custom response with the new trip request details
   */
const arrayErrorChecker = (travelFrom, travelTo, travelDate) => {
  let error = '';
  if (travelTo instanceof Array) {
    if (travelFrom.length !== travelTo.length || travelTo.length !== travelDate.length) {
      error += `; ${arrayLengthError}`;
    }  
    travelTo.forEach(item => {
      if (lowerCase(travelFrom[0]) === lowerCase(item)) {
        error += `; ${travelFromNETravelTo}`;
      }
    });
  }
  if (error === '') {
    error = '';
  }
  return error;
};

 /**
   * @param {Response} arrayError
   * @param {Response} errorCheck
   * @param {Response} travelType
   * @returns {Object} return error message
   */
  const errorCondition = (arrayError, errorCheck, travelType) => {
    let error = '';
    if (arrayError && travelType === 'multi-cities') {
      error += arrayError;
    }
    if (errorCheck && travelType === 'multi-cities') {
      error += errorCheck;
    }
    if (error === '') { 
      error = '';
    }
    error = error.indexOf('; ') === 0 ? error.replace('; ', '') : error;
    return error;
  };

  /** 
   * @param {Response} two 
   * @param {Response} one 
   * @returns {Object} return one if two does not exist
   */
  const isSet = (two, one) => {
    if (two !== 'undefined') {
      return two;
    } else {
      return one;
    }
  };

 /** 
   * @param {Response} travelFrom 
   * @param {Response} travelTo 
   * @param {Response} travelDate
   * @returns {Object} Custom response with the new trip request details
   */
  const createTripRequestCondition = (travelFrom, travelTo, travelDate) => {
    let error = '';
    if (lowerCase(travelFrom[1]) !== lowerCase(travelTo[0]) 
    || isSet(lowerCase(travelFrom[2]), lowerCase(travelTo[1])) !== lowerCase(travelTo[1])) {
      error += `; ${travelFromEqualError}`;
    } 
    if (travelDate[0] > travelDate[1] || travelDate[1] > travelDate[2]) {
      error += `; ${travelDateError}`;
    } 
    
  if (lowerCase(travelTo[0]) === lowerCase(travelTo[1]) 
  || lowerCase(travelTo[1]) === lowerCase(travelTo[2])
  || lowerCase(travelTo[0]) === lowerCase(travelTo[2])) {
error += `; ${travelFromNETravelTo}`;
}
    if (error === '') {
      error = '';
    }
      return error;
  };

 /** 
 * @param {object}tripRequestInfo Node/express request
 * @param {object} req Node/express request
 * @param {object} res Node/express response
 * @param {object} next Node/Express Next callback function
 * @returns {Object} Custom response with created trip details
 */
const returnTripHandler = async (tripRequestInfo, req, res, next) => {
  const errorMessage = [];
  let errors = '';
  try {
    const commonInfo = _.omit(tripRequestInfo, 'returnDate');
    req.body = await validationOTripRequest(commonInfo);
  } catch (err) {
    errorMessage.push(err.message);
  }
  try {
    const validRequest = await validateReturnDate(tripRequestInfo);
    req.body.userId = req.sessionUser.id;
    req.body.returnDate = validRequest.returnDate;
  } catch (err) {
    errorMessage.push(invalidReturnDate);
  }
  if (errorMessage.length === 0) {
    return next();
  }
  errorMessage.forEach((element) => {
    errors += `${element}.`;
  });
  return errorResponse(res, badRequest, errors);
};

/**
 * @param {Request} travelType return travel type
 * @param {Response} tripRequestInfo return req bodies
 * @param {Response} res Node/express response
 * @returns {Object} return specific validation callback
 */
const travelTypeHandler = async (travelType, tripRequestInfo) => {
  let validationType = null;
  switch (travelType) {
      case 'one-way':
      validationType = await validationOTripRequest(tripRequestInfo);
      return validationType;
      case 'multi-cities':
      validationType = await validationMTripRequest(tripRequestInfo);
      return validationType;   
    default:
      return null;
  }
};

/**
 * @param {Request} msg Node/express request
 * @returns {Object} Custom response with created trip details
 */
const validationErr = (msg) => {
if (msg === undefined) {
  return '';
} else {
  return msg;
}
};

/**
 * @param {Request} req Node/express request
 * @param {Response} res Node/express response
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {Object} Custom response with created trip details
 * @description validates all trip requests
 */
const isTripRequestValid = async (req, res, next) => {
  const tripRequestInfo = req.body;
  let { travelType } = tripRequestInfo;
  const { travelFrom, travelTo, travelDate } = tripRequestInfo;
  const whiteSpaces = /\s+/g;
  travelType = String(travelType).replace(whiteSpaces, ' ').trim().toLowerCase();
  if (travelType === 'return-trip') {
    return returnTripHandler(tripRequestInfo, req, res, next);
  } 
  let error = '';
    try {
      const arrayError = await arrayErrorChecker(travelFrom, travelTo, travelDate);
  const errorCheck = await createTripRequestCondition(travelFrom, travelTo, travelDate);
  error = await errorCondition(arrayError, errorCheck, travelType);
      const validationOutput = await travelTypeHandler(travelType, tripRequestInfo);
      if (error !== '') { throw error; }
      if (validationOutput === null) {
        return errorResponse(res, badRequest, invalidTravelType);
      }
      validationOutput.userId = req.sessionUser.id;
      req.body = validationOutput;
      return next();
    } catch (validationError) {
      const err = validationErr(validationError.message);
      return errorResponse(res, badRequest, `${err}${error}`);
    }   
};

/**
 * @param {Request} req Node/express request
 * @param {Response} res Node/express response
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {Object} nex function
 * @description validates search fields
 */
const isTripRequestsSearchValid = async (req, res, next) => {
  try {
    const { field, search, limit, offset } = req.query;
    const whiteSpaces = /\s+/g;
    const validSearchTerm = String(search).replace(whiteSpaces, ' ').trim();
    const validSearch = await validateTripRequestsSearch({
      field,
      search: validSearchTerm,
      limit,
      offset,
    });
    const { field: searchField, search: searchFieldValue } = validSearch;
    if (['id', 'travelDate', 'returnDate', 'status', 'travelType'].includes(searchField)) {
      await validateTripRequestsSearchField(searchField, searchFieldValue);
    }
    req.query = validSearch;
    return next();
  } catch (validationError) {
    return errorResponse(res, badRequest, validationError.message);
  }
};

/**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @param {NextFunction} next Node/Express Next callback function
* @returns {NextFunction} next Node/Express Next function
*/
const checkAccommodationBookingInfo = async (req, res, next) => {
  try {
    const bookingInfo = req.body;
    const validBookingInfo = await validateBookAccommodation(bookingInfo);
    const {
      accommodationId,
      tripRequestId,
    } = validBookingInfo;
    const accommodationExists = !!await getAccommodationById(accommodationId);
    const tripRequestExists = !!await getTripRequestById(tripRequestId);
    if (!accommodationExists) {
      return errorResponse(res, badRequest, accommodationNotExist);
    }
    if (!tripRequestExists) {
      return errorResponse(res, badRequest, tripRequestNotExist);
    }
    return next();
  } catch (validationError) {
    return errorResponse(res, badRequest, validationError.message);
  }
}; 

/** 
* @param {object} req Node/express request
* @param {object} res Node/express response
* @param {object} next Node/Express Next callback function
* @returns {Object} Custom response with created trip details
* @description validates trip request id
*/
const handleRequestStatusUpdate = async (req, res, next) => {
  const errorMessage = [];
  let errors = '';
  try {
    await validateRequestId(req.params.tripRequestId);
  } catch (err) {
    errorMessage.push(err);
  }
  if (errorMessage.length === 0) {
    return next();
  }
  errorMessage.forEach((element) => {
    errors += `${element.message}.`;
  });
  return errorResponse(res, badRequest, errors);
};

/** 
* @param {object} req Node/express request
* @param {object} res Node/express response
* @param {object} next Node/Express Next callback function
* @returns {Object} response error object
* @description validates trip request reassignment
*/
const handleRequestReassignment = async (req, res, next) => {
  const validator = await validateUserId(req);
  const { error } = validator;
  displayErrorMessages(error, res, next);
};

export {
  validateSignup,
  isTripRequestValid,
  validatePassword,
  displayErrorMessages,
  validateRole,
  validationMethods,
  isTripRequestsSearchValid,
  checkAccommodationBookingInfo,
  handleRequestStatusUpdate,
  handleRequestReassignment
};

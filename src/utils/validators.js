import Joi from '@hapi/joi';
import customMessages from './customMessages';
import { validationMethods } from './validations';
import RequestService from '../services/request.service';

const {
  invalidTravelFrom,
  invalidTravelTo,
  invalidTravelReason,
  invalidTravelDate,
  invalidTravelType,
  invalidTravelAccomodation,
  invalidTripRequestsSearchTerm,
  invalidTripRequestsSearchField,
  invalidTripRequestsSearchLimit,
  invalidTripRequestsSearchOffset,
  invalidTripRequestsSearchFieldId,
  invalidTripRequestsSearchFieldTravelDate,
  invalidTripRequestsSearchFieldReturnDate,
  invalidTripRequestsSearchFieldStatus,
  invalidTripRequestsSearchFieldTravelType,
  invalidBookAccommodationTripRequestId,
  dataLengthErr,
  invalidTripsStatsStartDate,
  invalidTripsStatsEndDate,
  viewStatsNoRequesterId,
  invalidBookAccommodationAccommodationId,
  invalidBookAccommodationArrivalDate,
  invalidBookAccommodationDepartureDate
} = customMessages;

 const { findDate, findUser } = RequestService;
 const maxDate = new Date().setHours(0, 0, 0, 0) + 15811200000;
 const minDate = new Date().setHours(0, 0, 0, 0) - 86400000;
 const joiTType = Joi.string()
.trim()
.required()
.lowercase()
.messages({ 'string.pattern.base': `${customMessages.invalidTravelType}; ` });
const joiTDate1 = Joi.array()
.items(Joi.date().min(minDate).max(maxDate)
.iso()
.messages({ 'date.format': 'travelDate must be in ISO 8601 date format; ', 'date.empty': 'travelDate should not be empty; ' }));
const joiArray1 = Joi.array().items(Joi.string().trim().messages({ 'string.base': 'travelFrom or travelTo should not be empty; ' }));
const joiReason = Joi.string().trim().required() 
.messages({ 'string.base': `${invalidTravelReason}; `, 'string.empty': `${invalidTravelReason}; ` });
 /**
* @returns {object} defines custom validators for different kind of API requests
* @description {object} defines custom validators for different kind of API requests
*/
export default class Validators {
 /**
* @param {object} fieldDataType data type for the field
* @param {object} errorMessage error message to display
* @returns {object} an object of validation error messages
*/
static createValidationErrors(fieldDataType, errorMessage) {
  return {
    [`${fieldDataType}.base`]: errorMessage,
    [`${fieldDataType}.empty`]: errorMessage,
    [`${fieldDataType}.min`]: errorMessage,
    [`${fieldDataType}.max`]: errorMessage,
    [`${fieldDataType}.format`]: errorMessage,
    [`${fieldDataType}.less`]: errorMessage,
    [`${fieldDataType}.greater`]: errorMessage,
    'any.required': errorMessage,
    'any.only': errorMessage,
    'any.ref': errorMessage,
  };
}

/**
* @param {object} fieldDataType data type for the field
* @param {object} baseError error message to display
* @param {object} maxError error message to display
* @param {object} minError error message to display
* @returns {object} an object of validation error messages
*/
static arrayValidationErrors = (fieldDataType, baseError, maxError, minError) => {
 return {
   [`${fieldDataType}.base`]: baseError,
   [`${fieldDataType}.max`]: maxError,
   [`${fieldDataType}.min`]: minError,
 };
}

/**
* @param {object} tripRequestData one way trip request data
* @returns {Promise<any>} a Promise of validation output
*/
static async validationOTripRequest(tripRequestData) {
  const { createValidationErrors } = Validators;
  const joiStringO = Joi.string().trim().messages(createValidationErrors('string', 'travelFrom or travelTo should not be empty; ')).required();
  const schema = Joi.object({
    travelTo: joiStringO,
    travelFrom: joiStringO,
    travelReason: joiReason,
    travelType: joiTType,
    travelDate: Joi.date().required().min(minDate).max(maxDate)
    .iso()
    .messages(createValidationErrors('date', invalidTravelDate)),
    accommodation: Joi.bool().required()
    .messages(createValidationErrors('boolean', `${invalidTravelAccomodation}; `)),
});
  return schema.validateAsync(tripRequestData, { abortEarly: false });
  }

  /**
  * @param {object} tripRequest return trip request data
  * @returns {Promise<any>} validation output
  */
  static async validateReturnDate(tripRequest) {
    const { createValidationErrors } = Validators;

    const schema = Joi.object({
      returnDate: Joi.date().required().min(new Date()).iso()
        .min(Joi.ref('travelDate'))
        .messages(createValidationErrors('date', invalidTravelDate))
    });
    return schema.validateAsync(tripRequest, {
      abortEarly: false,
      allowUnknown: true
    });
  }

  /**
  * @param {object} searchCriteria the search object containing different search criteria
  * @returns {Promise<any>} validation output
  */
  static async validateTripRequestsSearch(searchCriteria) {
    const { createValidationErrors } = Validators;
    const schema = Joi.object({
      search: Joi.string().required()
        .messages(createValidationErrors('string', invalidTripRequestsSearchTerm)),
      field: Joi.string().required()
        .valid(
          'id',
          'status',
          'travelTo',
          'travelFrom',
          'travelDate',
          'returnDate',
          'travelType',
          'travelReason'
        )
        .messages(createValidationErrors('string', invalidTripRequestsSearchField)),
      limit: Joi.number().min(1).required()
        .messages(createValidationErrors('number', invalidTripRequestsSearchLimit)),
      offset: Joi.number().min(0).required()
        .messages(createValidationErrors('number', invalidTripRequestsSearchOffset)),
    });
    return schema.validateAsync(searchCriteria, {
      abortEarly: false,
      allowUnknown: true,
    });
  }

  /**
  * @param {object} searchField the search field to validate
  * @param {object} searchFieldValue the value of search field to validate
  * @returns {Promise<any>} a Promise of validation output
  */
  static async validateTripRequestsSearchField(searchField, searchFieldValue) {
    const { createValidationErrors } = Validators;
    /**
    * @description generates a validation schema for a particalar search field
    * @returns {Joi.Schema} Joi validation schema
    */
    const schema = () => {
      switch (searchField) {
        case 'id':
          return Joi.number().required()
            .messages(createValidationErrors('number', invalidTripRequestsSearchFieldId));

        case 'travelDate':
          return Joi.date().iso().required()
            .messages(createValidationErrors('date', invalidTripRequestsSearchFieldTravelDate));

        case 'returnDate':
          return Joi.date().iso().required()
            .messages(createValidationErrors('date', invalidTripRequestsSearchFieldReturnDate));

        case 'status':
          return Joi.string().required()
            .valid('accepted', 'rejected', 'pending')
            .messages(createValidationErrors('string', invalidTripRequestsSearchFieldStatus));

        default:
          return Joi.string().required()
            .valid('one-way', 'One-way', 'return-trip', 'multi-city')
            .messages(createValidationErrors('string', invalidTripRequestsSearchFieldTravelType));
      }
    };
    return schema().validateAsync(searchFieldValue);
  }

  /**
  * @param {Date} tripsStatsTimeframe a timeframe for trip requests stats(start date & end date)
  * @returns {Promise<any>} validation output
  */
  static async validateTripsStatsTimeframe(tripsStatsTimeframe) {
    const { createValidationErrors } = Validators;
    const maxiDate = new Date();
    const validDate = Joi.date().required().iso().less(maxiDate);
    const schema = Joi.object({
      startDate: validDate
        .messages(createValidationErrors('date', invalidTripsStatsStartDate)),
      endDate: validDate.greater(Joi.ref('startDate'))
        .messages(createValidationErrors('date', invalidTripsStatsEndDate)),
    });
    return schema.validateAsync(tripsStatsTimeframe, {
      abortEarly: false,
      stripUnknown: true,
    });
  }

  /**
  * @param {Object} requester contains requester's unique id
  * @returns {Promise<any>} validation output
  */
  static async validateRequesterInfo(requester) {
    const { createValidationErrors } = Validators;
    const schema = Joi.object({
      requesterId: Joi.number().required()
        .messages(createValidationErrors('number', viewStatsNoRequesterId)),
    });
    return schema.validateAsync(requester, {
      abortEarly: false,
      stripUnknown: true,
    });
  }
  
  /**
  * @param {Object} bookingDetails booking information
  * @returns {Promise<any>} validation output
  */
  static validateBookAccommodation(bookingDetails) {
    const { createValidationErrors } = Validators;
    const minrDate = new Date();
    const validDate = Joi.date().required().iso().greater(minrDate);
    const schema = Joi.object({
      tripRequestId: Joi.number().required()
        .messages(createValidationErrors('number', invalidBookAccommodationTripRequestId)),
      accommodationId: Joi.number().required()
        .messages(createValidationErrors('number', invalidBookAccommodationAccommodationId)),
      arrivalDate: validDate
        .messages(createValidationErrors('date', invalidBookAccommodationArrivalDate)),
      departureDate: validDate
        .greater(Joi.ref('arrivalDate'))
        .messages(createValidationErrors('date', invalidBookAccommodationDepartureDate)),
    });
    return schema.validateAsync(bookingDetails, {
      abortEarly: false,
      stripUnknown: true,
    });
  }

  /**
  * @param {number} tripRequestId Trip request ID
  * @returns {Object} response message
  * @description validates the trip request ID in URL
  */
  static async validateRequestId(tripRequestId) {
    const { createValidationErrors } = Validators;
    const schema = Joi.number().integer().required()
      .messages(createValidationErrors('number', customMessages.invalidTripRequestId));
    return schema.validateAsync(tripRequestId, {
      abortEarly: false,
      allowUnknown: true
    });
  }

  /**
  * @param {object} req Trip request status
  * @returns {Object} response message
  * @description validates the user email
  */
  static async validateUserId(req) {
    const data = {
      tripRequestId: req.params.tripRequestId,
      userId: req.body.userId
    };
    const { createValidationErrors } = Validators;
    const schema = Joi.object({
      tripRequestId: Joi.number().integer().required()
        .messages(createValidationErrors('number', customMessages.invalidTripRequestId)),
      userId: validationMethods(/^([0-9])+$/, { 'string.pattern.base': `${customMessages.invalidUserId}` }),
    });
    return schema.validate(data, {
      abortEarly: false,
    });
  }

/** 
* @param {object} tripRequestData one way trip request data
* @returns {Promise<any>} a Promise of validation output
*/
static async validationMTripRequest(tripRequestData) {
  const { 
    createValidationErrors, arrayValidationErrors } = Validators;
  const schema = Joi.object({
    travelTo: joiArray1.min(2).max(3).required()
    .messages(arrayValidationErrors('array', 'travelFrom or travelTo should be an array; ', `travelFrom or travelTo ${dataLengthErr}; `, `travelFrom or travelTo ${dataLengthErr}; `)),
    travelFrom: joiArray1.min(2).max(3).required()
    .messages({ 'array.base': 'travelFrom or travelTo should be an array; ', 'array.max': `travelFrom or travelTo ${dataLengthErr};`, 'array.min': `travelFrom or travelTo ${dataLengthErr};` }),
    travelReason: joiReason,
    travelType: joiTType,
    travelDate: joiTDate1.min(2).max(3).required()
    .messages(arrayValidationErrors('array', 'travelDate should be an array; ', 'travelDate should not have less than 2 or more than 3 destinations;', 'travelDate should not have less than 2 or more than 3 destinations;')),
    accommodation: Joi.bool().required()
    .messages(createValidationErrors('boolean', `${invalidTravelAccomodation}; `)),
});
  return schema.validateAsync(tripRequestData, { abortEarly: false });
  }
  
  /** 
   * @param {Response} travelFrom 
   * @param {Response} travelTo 
   * @param {Response} travelDate
   * @param {Response} id
   * @returns {Object} Custom response with the new trip request details
   */
  static func = (travelFrom, travelTo, travelDate, id) => {
    const data = [];
            travelFrom.forEach((item, i) => data.push({
            travelFrom: item,
            travelTo: travelTo[i],
            travelDate: travelDate[i],
            requestId: id
            }));
            return data;
  }

  /**
     * @param {Request} travelDate array
     * @param {Request} id authenticated user id
     * @returns {Object} return error
     */
    static findUserDate = async (travelDate, id) => {
      if (await findDate(travelDate) && await findUser(id)) {
        return true; 
        }
        return false;
    }
}

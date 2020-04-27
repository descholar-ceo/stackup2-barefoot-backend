import Joi from '@hapi/joi';
import customMessages from './customMessages';
import { validationMethods } from './validations';

const {
  invalidTravelFrom,
  invalidTravelTo,
  invalidTravelReason,
  invalidTravelDate,
  invalidTravelType,
  invalidTravelAccomodation,
  invalidBookAccommodationTripRequestId,
} = customMessages;

const {
  invalidTripRequestsSearchTerm,
  invalidTripRequestsSearchField,
  invalidTripRequestsSearchLimit,
  invalidTripRequestsSearchOffset,
  invalidTripRequestsSearchFieldId,
  invalidTripRequestsSearchFieldTravelDate,
  invalidTripRequestsSearchFieldReturnDate,
  invalidTripRequestsSearchFieldStatus,
  invalidTripRequestsSearchFieldTravelType,
} = customMessages;

const {
  invalidTripsStatsStartDate,
  invalidTripsStatsEndDate,
  viewStatsNoRequesterId,
  invalidBookAccommodationAccommodationId,
  invalidBookAccommodationArrivalDate,
  invalidBookAccommodationDepartureDate,
} = customMessages;

/**
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
  * @param {object} tripRequestData one way trip request data
  * @returns {Promise<any>} a Promise of validation output
  */
  static async validateOneWayTripRequest(tripRequestData) {
    const maxDate = new Date().setHours(0, 0, 0, 0) + 15811200000;
    const minDate = new Date().setHours(0, 0, 0, 0) - 86400000;
    const whiteSpaces = /\s+/g;
    const { createValidationErrors } = Validators;
    const cleanString = Joi.string().replace(whiteSpaces, ' ').trim().required();
    const schema = Joi.object({
      travelFrom: cleanString
        .messages(createValidationErrors('string', invalidTravelFrom)),
      travelTo: cleanString
        .messages(createValidationErrors('string', invalidTravelTo)),
      travelReason: cleanString
        .messages(createValidationErrors('string', invalidTravelReason)),
      travelDate: Joi.date().required().min(minDate).max(maxDate)
        .iso()
        .messages(createValidationErrors('date', invalidTravelDate)),
      accommodation: Joi.bool().required()
        .messages(createValidationErrors('boolean', invalidTravelAccomodation)),
      travelType: cleanString.lowercase()
        .messages(createValidationErrors('string', invalidTravelType)),
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
    const maxDate = new Date();
    const validDate = Joi.date().required().iso().less(maxDate);
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
    const minDate = new Date();
    const validDate = Joi.date().required().iso().greater(minDate);
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
  * @param {number} id Trip request ID
  * @param {string} message Appropriate error message
  * @returns {Object} response message
  * @description validates the trip request ID in URL
  */
  static async validateId(id, message) {
    const { createValidationErrors } = Validators;
    const schema = Joi.number().integer().required()
      .messages(createValidationErrors('number', message));
    return schema.validateAsync(id, {
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
  * @param {number} rates rates for an accommodation
  * @returns {Object} response message
  * @description validates the trip request ID in URL
  */
 static async validateRates(rates) {
  const { createValidationErrors } = Validators;
  const schema = Joi.number()
                    .integer()
                    .required()
                    .min(1)
                    .max(5)
    .messages(createValidationErrors('number', customMessages.invalidRates));
  return schema.validateAsync(rates, {
    abortEarly: false,
    allowUnknown: true
  });
}
}

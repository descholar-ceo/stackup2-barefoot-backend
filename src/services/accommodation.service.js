import Op from 'sequelize';
import models from '../database/models';

const { booking, accommodation, rating } = models;

/**
 * @description Trip requests service
 */
export default class AccommodationService {
  /**
   *@description Saves booking information in database
   * @param {Object} bookingInfo trip request data
   * @returns {Object} Saved booking information
    */
  static handleBookAccommodation(bookingInfo) {
    return booking.create(
      bookingInfo,
      {
        fields: [
          'tripRequestId',
          'accommodationId',
          'arrivalDate',
          'departureDate',
        ]
      }
    );
  }

  /**
   *@description retrives accommodation details by id
   * @param {Object} id unique accommodation id
   * @returns {Object} accommodation facility details
    */
  static getAccommodationById(id) {
    return accommodation.findOne({
      where: {
        id,
      }
    });
  }

  /**
   *@description Saves rates for an accommodation in database
   * @param {Object} ratesData rates related data 
   * @returns {Object} Saved rating information
    */
   static handleRatingAccommodation(ratesData) {
    return rating.create(
      ratesData,
      {
        fields: [
          'requestId',
          'accommodationId',
          'createdBy',
          'rates',
        ]
      }
    );
  }

    /**
   *@description retrives booking details by id
   * @param {number} requestId unique request id
   * @returns {Object} booked accommodation facility details
    */
   static getBookedAccommodationById(requestId) {
    return booking.findOne({
      where: {
        tripRequestId: requestId
      }
    });
  }

      /**
   *@description retrives booking details by id
   * @param {number} accommodationId unique request id
   * @returns {Object} booked accommodation facility details
    */
   static getBookedAccommodation(accommodationId) {
    return booking.findOne({
      where: {
        accommodationId
      }
    });
  }

    /**
   *@description retrives booking details by id
   * @param {number} id unique request id
   * @returns {Object} booked accommodation facility details
    */
   static getAllRatedAccommodationById(id) {
    return rating.findAll({
      where: {
        accommodationId: id
      }
    });
  }
}

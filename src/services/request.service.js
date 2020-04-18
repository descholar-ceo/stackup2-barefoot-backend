import models from '../database/models';
import tripRequestsStatus from '../utils/tripRequestsStatus.util';

const { request, sequelize, Sequelize, user } = models;
const { Op } = Sequelize;
const { ACCEPTED, } = tripRequestsStatus;

/**
 * @description Trip requests service
 */
export default class RequestService {
  /**
   *@description Saves trip request details in database
   * @param {Object} tripRequestData trip request data
   * @returns {Object} Saved trip request details
    */
  static handleTripRequest(tripRequestData) {
    return request.create(
      tripRequestData,
      {
        fields: [
          'userId',
          'travelTo',
          'travelFrom',
          'travelReason',
          'travelType',
          'travelDate',
          'returnDate',
          'accommodation'
        ]
      }
    );
  }

  /**
   * @returns {Integer} returns number of traveled places
   * @description returns all of the destinations a and their appearance times from the database
   */
  static getMostTraveledDestinations = async () => {
    const placeAndTheirVisitTimes = await sequelize.query('SELECT "travelTo", COUNT(*) FROM requests WHERE status =\'accepted\' OR status=\'Accepted\' GROUP BY "travelTo" ORDER BY count DESC');

    return placeAndTheirVisitTimes;
  }

  /**
   * @param {Integer} userId
   * @returns {object} foundReq
   * @description it returns a one request of a specific user if it is passed userId
   *  otherwise it returns any request
   */
  static getOneRequestFromDb = async (userId) => {
    const foundReq = await request.findOne({ where: { id: { [Op.eq]: userId } } });
    return foundReq;
  }

  /**
   *@param {object} reqOptions
   *@returns {object} reqs
   *@description it returns a list of all request
   */
  static getAllRequests = async (reqOptions) => {
    const { userId, offset, limit } = reqOptions;
    const reqs = await request.findAndCountAll({ where: { userId }, offset, limit, order: [['createdAt', 'DESC']] });
    return reqs;
  }

  /**
   *@description Saves trip request details in database
   * @param {Object} searchCriteria an object of different search options
   * @returns {Object} fields that matches the search keyword 
  */
  static handleSearchTripRequests(searchCriteria) {
    const { field, search, limit, offset, userId } = searchCriteria;
    if (['id', 'travelDate', 'returnDate', 'travelType', 'status'].includes(field)) {
      if (userId) {
        return request.findAll({ where: { userId, [field]: { [Op.eq]: search } }, limit, offset, });
      }
      return request.findAll({ where: { [field]: { [Op.eq]: search } }, limit, offset, });
    }
    if (userId) {
      return request.findAll({ where: { userId, [field]: { [Op.iLike]: `%${search}%` } }, limit, offset, });
    }
    return request.findAll({ where: { [field]: { [Op.iLike]: `%${search}%` } }, limit, offset, });
  }

  /**
  *@description Retrieves trips stats from database
  * @param {Number} userId current user's database id
  * @param {Date} startDate start date for stats
  * @param {Date} endDate end date for stats
  * @returns {Object} trips stats
   */
  static getTripsStats(userId, startDate, endDate) {
    return request.count({
      where: {
        userId,
        status: ACCEPTED,
        travelDate: {
          [Op.between]: [startDate, endDate]
        },
      },
    });
  }

     /**
   *@description update open trip request details in database
   * @param {Object} tripRequestData trip request new data
   * @param {Integer} requestId trip request id
   * @returns {Object} updated trip request details
    */
  static updateTripRequest(tripRequestData, requestId) {
    if (tripRequestData.travelType === 'one-way') {
      tripRequestData.returnDate = null;
    }
    const {
      travelTo,
      travelFrom,
      travelReason,
      travelType,
      travelDate,
      returnDate,
      accommodation
    } = tripRequestData;
    return request.update(
      {
        travelTo,
        travelFrom,
        travelReason,
        travelType,
        travelDate,
        returnDate,
        accommodation
      },
      { where: { id: requestId } }
    );
  }

  /**
    *@description retrieves a trip request matching @id from database
    * @param {Number} id unique trip request id
    * @returns {Object} trip request matching @id
    */
  static getTripRequestById(id) {
    return request.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * @description Used to find a trip request by id 
   * @param {number} tripId Trip request id
   * @returns {object} returns a trip request object
   */
  static findTripRequestById = async (tripId) => {
    const id = tripId;
    const tripRequest = await request.findOne({ where: { id } });
    return tripRequest;
  };

  /**
   * @description Used by a manager to approve or reject a trip request
   * @param {number} id Trip request id
   * @param {string} status Approval status: accepted
   * @param {number} handledBy Manager id
   * @returns {object} returns a trip request with changed status
   */
  static updateTripRequestStatus = async (id, status, handledBy) => {
    const updatedRequest = await request.update(
      {
        status,
        handledBy
      },
      {
        where: { id }
      }
    );
    return updatedRequest;
  }

  /**
   * @description Used by a manager to assign a trip request to another manager
   * @param {number} requestId Trip request id
   * @param {number} newManagerId New manager id
   * @returns {object} returns a trip request with changed handler
   */
  static reassignTripRequest = async (requestId, newManagerId) => {
    const id = requestId;
    const handledBy = newManagerId;
    const updateHandler = await request.update(
      {
        handledBy
      },
      {
        where: { id }
      }
    );
    return updateHandler;
  }

  /**
   *@description Saves trip request details in database
   * @param {string} id of a trip
   * @returns {Object} all pending requests
    */
   static findTrip(id) {
    return request.findOne({
      where: { id }
    });
   }
  
  /**
   * @param {string} id
   * @param {boolean} status
   * @returns {Object} change inAppNotification to false
    */
  static async updateInAppNotification(id, status) {
    const update = await user.update(
      { inAppNotification: !status },
      { where: { id } }
     );
     return update;
  }

  /**
   * @param {string} ids
   * @returns {Object} an array of requests based on the array of ids passed through params
    */
  // static async getTripRequestsFromRequesterId(ids) {
  //   const requests = request.findAll({
  //     where: {
  //       id: {
  //         [Op.and]: [
  //           { [Op.in]: ids }
  //         ]
  //       },
  //     }
  //   });
  //   return requests;
  // }
  }

import { Op } from 'sequelize';
import models from '../database/models';
import tripRequestsStatus from '../utils/tripRequestsStatus.util';

const { request, trips, sequelize, Sequelize } = models;
const { ACCEPTED, } = tripRequestsStatus;

 /**
   *@description Saves trip request details in database
   * @param {Object} field trip request data
   * @returns {Object} Saved trip request details
    */
const getModel = (field) => {
  let val = null;
  val = request;
  const arr = ['travelFrom', 'travelTo', 'travelDate', 'returnDate'];
  arr.forEach(item => {
    if (field === item) {
      val = trips;
    }
  });
  return val;
};
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
          'travelReason',
          'travelType',
          'accommodation'
        ]
      }
    );
  }

    /**
   *@description Saves trip request details in database
   * @param {Object} tripRequestData trip request data
   * @returns {Object} Saved trip request details
    */
   static handleSubTripRequest(tripRequestData) {
    return trips.create(
      tripRequestData,
      {
        fields: [
          'requestId',
          'travelFrom',
          'travelTo',
          'travelDate',
          'returnDate'
        ]
      }
    );
  }

  /**
   * @returns {Integer} returns number of traveled places
   * @description returns all of the destinations a and their appearance times from the database
   */
  static getMostTraveledDestinations = async () => {
    const placeAndTheirVisitTimes = await sequelize.query('SELECT trips."travelTo", COUNT(*) FROM trips INNER JOIN requests ON requests.id = trips."requestId" WHERE requests.status =\'accepted\' OR requests.status=\'Accepted\' GROUP BY trips."travelTo" ORDER BY count DESC');
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
   * @param {Integer} userId
   * @returns {object} foundReq
   * @description it returns a one request of a specific user if it is passed userId
   *  otherwise it returns any request
   */
  static getOneRequestFromDb1 = async (userId) => {
    const foundReq = await trips.findOne({ where: { requestId: { [Op.eq]: userId } } });
    return foundReq;
  }

  /**
   * @param {Integer} userId
   * @returns {object} foundReq
   * @description it returns a one request of a specific user if it is passed userId
   *  otherwise it returns any request
   */
  static getOneRequestFromDb2 = async (userId) => {
    const foundReq = await trips.findAll({ where: { requestId: { [Op.eq]: userId } } });
    return foundReq;
  }

  /**
   *@param {object} reqOptions
   *@returns {object} reqs
   *@description it returns a list of all request
   */
  static getAllRequests = async (reqOptions) => {
    const { userId, offset, limit } = reqOptions;
    const reqs = await request.findAndCountAll({ 
      where: { userId },
      include: [
        { model:trips, separate: true }
      ],
      offset, 
      limit, 
      order: [['createdAt', 'DESC']] });
    return reqs;
  }

  /**
   *@description Saves trip request details in database
   * @param {Object} searchCriteria an object of different search options
   * @returns {Object} fields that matches the search keyword 
  */
  static handleSearchTripRequests(searchCriteria) {
    const { field, search, limit, offset, userId } = searchCriteria;
    const modelz = getModel(field);
    if (['id', 'travelDate', 'returnDate', 'travelType', 'status'].includes(field)) {
      if (userId) {
        return sequelize.query(`SELECT * FROM trips LEFT JOIN requests ON requests.id = trips."requestId" WHERE requests."userId" = ${userId} AND trips."${[field][0]}" = '${search}' LIMIT ${limit} OFFSET ${offset}`);
      }
      return modelz.findAll({ where: { [field]: { [Op.eq]: search } }, limit, offset, });
    }
    if (userId) {
       return sequelize.query(`SELECT * FROM trips LEFT JOIN requests ON requests.id = trips."requestId" WHERE requests."userId" = ${userId} AND trips."${[field][0]}" LIKE '%${search}%' LIMIT ${limit} OFFSET ${offset}`);
    }
    return modelz.findAll({ where: { [field]: { [Op.iLike]: `%${search}%` } }, limit, offset, });
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
      },
      include: [{
        model: trips,
        required: true,
        where: {
          travelDate: {
            [Op.between]: [startDate, endDate]
          },
        }
      }]
    });
  }

    /**
  *@description Retrieves trips stats from database
  * @param {Number} date
  * @returns {Object} trips 
   */
  static findDate = async (date) => {
    const tDate = await trips.findOne({
      where: { travelDate: date }
    });
    return tDate;
  }

  /**
  *@description Retrieves trips stats from database
  * @param {Number} id
  * @returns {Object} trips 
   */
  static findUser = async (id) => {
    const user = await request.findOne({
      where: { 
        userId: id 
      }
    });
    return user;
  }

       /**
   *@description update open trip request details in database
   * @param {Object} tripRequestData trip request new data
   * @param {Integer} requestId trip request id
   * @returns {Object} updated trip request details
    */
  static updateTripRequest1(tripRequestData, requestId) {
    const {
     travelReason,
     travelType,
     accommodation
    } = tripRequestData;
    
   return request.update(
     {
      travelReason,
      travelType,
      accommodation
     },
     { where: { id: requestId } }
   );
   /*
   return sequelize.query(`UPDATE requests SET requests.travelReason = ${travelReason},
   requests.travelType = ${travelType}, requests.accommodation = ${accommodation},
   sub_requests.travelFrom = ${travelFrom}, sub_requests.travelTo = ${travelTo},
   sub_requests.travelDate = ${travelDate}, sub_requests.returnDate = ${returnDate}
   FROM sub_requests WHERE requests.id = sub_requests.requestId OR requests.id = ${requestId}`);
   */
}

     /**
   *@description update open trip request details in database
   * @param {Object} tripRequestData trip request new data
   * @param {Integer} requestId trip request id
   * @returns {Object} updated trip request details
    */
   static updateTripRequest2(tripRequestData, requestId) {
    const {
     travelTo,
     travelFrom,
     travelDate,
     returnDate
    } = tripRequestData;
    
   return trips.update(
     {
      travelTo, 
      travelFrom,
      travelDate,
      returnDate
     },
     { where: { requestId } }
   );
   /*
   return sequelize.query(`UPDATE requests SET requests.travelReason = ${travelReason},
   requests.travelType = ${travelType}, requests.accommodation = ${accommodation},
   sub_requests.travelFrom = ${travelFrom}, sub_requests.travelTo = ${travelTo},
   sub_requests.travelDate = ${travelDate}, sub_requests.returnDate = ${returnDate}
   FROM sub_requests WHERE requests.id = sub_requests.requestId OR requests.id = ${requestId}`);
   */
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
}


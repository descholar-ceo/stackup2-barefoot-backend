import UserService from '../services/authentication.service';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessage from '../utils/customMessages';
import RequestServices from '../services/request.service';
import generateInAppNotifications from '../utils/generateInAppNotifications';

const { getUserById } = UserService;
const { findTrip } = RequestServices;
const { successResponse, errorResponse } = responseHandlers;
const { allPendingTrip, notificationsDisabled, emptyInAppNotification, tripFound } = customMessage;
const { managerInAppNotifications, requesterInAppNotifications } = generateInAppNotifications;

const { ok, unAuthorized } = statusCodes;

/**
   * @description notifications controller class
   */
export default class notificationController {
  /**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @returns {array} array of all pending requests of a user for a particular user or manager
* @description in-app notification for requester
*/
  static async inAppNotifications(req, res) {
    const { id, role } = req.sessionUser;
    const { status, typeId } = req.query;
    const { dataValues } = await getUserById(id);
    const canViewNotification = dataValues.inAppNotification;
    if (!canViewNotification) {
      return errorResponse(res, unAuthorized, notificationsDisabled);
    }
    if (role === 'manager') {
      await managerInAppNotifications(res, id, status, typeId);
    } else {
      await requesterInAppNotifications(res, id, status, typeId);
    }
  }

  /**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @returns {Object} trips stats of any user
* @description retrieves trip request by id
*/
static async getTrip(req, res) {
  const { id } = req.params;
  const trip = await findTrip(id);
  return successResponse(res, ok, tripFound, undefined, trip);
}
}

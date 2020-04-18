import notificationsUtil from './inAppNotification.util';
import statusCodes from './statusCodes';
import customMessage from './customMessages';
import responseHandlers from './responseHandlers';

const { successResponse, errorResponse } = responseHandlers;
const { ok, unAuthorized } = statusCodes;
const { allPendingTrip, notificationsDisabled, emptyInAppNotification } = customMessage;
const { getInAppNotificationForRequester, getInAppNotificationForManager } = notificationsUtil;

/**
* @param {Response} res Node/express response
* @param {integer}  id
* @param {string}  status
* @param {string}  typeId
* @returns {array} array of all pending requests of a user for a particular manager manager
* @description in-app notification for manager
*/
const managerInAppNotifications = async (res, id, status, typeId) => {
    const requests = await getInAppNotificationForManager(id, status, typeId);
    return successResponse(res, ok, emptyInAppNotification, undefined, requests);
};

/**
* @param {Response} res Node/express response
* @param {integer}  id
* @param {string}  status
* @param {string}  typeId
* @returns {array} array of all pending requests of a user for a particular user or manager
* @description in-app notification for requester
*/
const requesterInAppNotifications = async (res, id, status, typeId) => {
    const requests = await getInAppNotificationForRequester(id, status, typeId);
    return successResponse(res, ok, allPendingTrip, undefined, requests);
};
export default { managerInAppNotifications, requesterInAppNotifications };

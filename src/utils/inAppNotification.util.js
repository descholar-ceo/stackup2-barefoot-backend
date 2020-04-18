import NotificationService from '../services/notification.service';
import RequestService from '../services/request.service';
import UserService from '../services/authentication.service';
import filterNotificationByType from './filterNotificationByType.util';


const { getManagerByLineManager } = UserService;
const {
  findManagerInAppNotification,
  getAllYourInAppNotifications,
  combineAllNotifications
} = NotificationService;
const { getTripRequestsFromRequesterId } = RequestService;

const { findTripRequestByIdList } = NotificationService;

/**
 * @param {integer} id
 * @param {boolean} status
 * @param {string} typeId
 * @returns {object} returns notifications based on requester
 * @description this function returns in-app notifications for requester
 * details depending on the value passed
 */
const getInAppNotificationForRequester = async (id, status, typeId) => {
  let notifications;
  if (!status) {
    notifications = await combineAllNotifications(id);
  } else {
    const notificationStatus = status === 'unread';
    notifications = await findTripRequestByIdList(id, notificationStatus, typeId);
  }
  if (typeId) {
    const filteredNotifications = filterNotificationByType(notifications, typeId);
    return filteredNotifications;
  }
  return notifications;
};
/**
 * @param {integer} id
 * @param {boolean} status
 * @param {boolean} typeId
 * @returns {object} returns notifications based on manager id
 * @returns {object} returns notifications based on manager id
 * @description this function returns in-app notifications for manager
 * details depending on the value passed
 */
const getInAppNotificationForManager = async (id, status, typeId) => {
  let notifications;
  const Requesters = await getManagerByLineManager(id);
  const myRequestersID = Requesters.map(requester => requester.id);
  if (!status) {
    notifications = await combineAllNotifications(myRequestersID);
  } else {
    const notificationStatus = status === 'unread';
    notifications = await findManagerInAppNotification(myRequestersID, notificationStatus);
  }
  if (typeId) {
    const filteredNotifications = filterNotificationByType(notifications, typeId);
    return filteredNotifications;
  }
  return notifications;
};

export default { getInAppNotificationForRequester, getInAppNotificationForManager };

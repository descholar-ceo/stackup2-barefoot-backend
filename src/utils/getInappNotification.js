import NotificationService from '../services/notification.service';
import RequestService from '../services/request.service';
import UserService from '../services/authentication.service';


const { getManagerByLineManager } = UserService;
const { findManagerInAppNotification } = NotificationService;
const { getTripRequestsFromRequesterId } = RequestService;

const { findTripRequestByIdList } = NotificationService;

/**
 * @param {integer} id
 * @param {boolean} status
 * @returns {object} returns notifications based on requester
 * @description this function returns in-app notifications for requester
 * details depending on the value passed
 */
const getInAppNotificationForRequester = async (id, status) => {
  const notifications = await findTripRequestByIdList(id, status);
  const requestsId = notifications.map(notification => notification.requestId);
  const requests = await getTripRequestsFromRequesterId(requestsId);
  return requests;
};
/**
 * @param {integer} id
 * @param {boolean} notificationStatus
 * @returns {object} returns notifications based on manager id
 * @description this function returns in-app notifications for manager
 * details depending on the value passed
 */
const getInAppNotificationForManager = async (id, notificationStatus) => {
  // let requests;
  // console.log('>>> ', notificationStatus);
  const Requesters = await getManagerByLineManager(id);
  const myRequestersID = Requesters.map(requester => requester.id);
  const notifications = await findManagerInAppNotification(myRequestersID, notificationStatus);
  const requestsId = notifications.map(notification => notification.requestId);
  //   if (notificationStatus === 'all') {
  //     requests = await getTripRequestsFromRequesterId(requestsId);
  //     return requests;
  // }
  const requests = await getTripRequestsFromRequesterId(requestsId);
  return requests;
};
export default { getInAppNotificationForRequester, getInAppNotificationForManager };

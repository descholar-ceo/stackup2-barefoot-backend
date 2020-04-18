import models from '../database/models';

const { notification, notificationType, request } = models;
const { Sequelize } = models;

/**
 * @description Trip requests service
   * @return {string} requestersId
 * 
 */
export default class NotificationService {
  /**
   *@description Saves in-app notification to the db
   * @param {Object} user request data
   * @param {Object} createdRequestId to the created trip request
   * @param {Object} notificationTypeId the id of a notification type
   * @returns {Object} Saved notification request details
    */
  static createInAppNotification(user, createdRequestId, notificationTypeId) {
    const requesterId = user.id;
    const unread = true;
    const typeId = notificationTypeId;
    const requestId = createdRequestId;
    const newData = {
      requesterId,
      requestId,
      unread,
      typeId
    };
    return notification.create(
      newData,
      {
        fields: [
          'requesterId',
          'requestId',
          'unread',
          'typeId'
        ]
      }
    );
  }

  /**
   * @description returns notifications to the requester depending on the status
 * @param {string} value
 * @param {string} status
 * @param {integer} typeId
 * @returns {object} returns an array of notifications
 */
  static findTripRequestByIdList = async (value, status, typeId) => {
    let notifications;
    if (typeId !== undefined) {
      notifications = notification.findAll({
        where: {
          requesterId: value,
          unread: status,
          typeId
        },
        include: [{ model: notificationType, as: 'type' }, { model: request, as: 'request' }]
      });
    } else {
      notifications = notification.findAll({
        where: {
          requesterId: value,
          unread: status,
        },
        include: [{ model: notificationType, as: 'type' }, { model: request, as: 'request' }]
      });
    }
    return notifications;
  };


  /**
   *@description return all relevant notifications
   * @param {integer} value 
   * @returns {Object} all notifications
    */
  static combineAllNotifications = async (value) => {
    let notifications;
    if (!Array.isArray(value)) {
      notifications = notification.findAll({
        where: { requesterId: value },
        include: [{ model: request, as: 'request' }]

      });
    } else {
      notifications = notification.findAll({
        where: {
          requesterId: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.in]: value }
            ]
          },
        },
        include: [{ model: notificationType, as: 'type' }, { model: request, as: 'request' }]
      });
    }
    return notifications;
  }

  /**
   *@description return notifications for the lineManager
   * @param {string} requestersIds
   * @param {string} status
   * @returns {Object} Saved notification request details
    */
  static findManagerInAppNotification = async (requestersIds, status) => {
    const notifications = notification.findAll({
      where: {
        [Sequelize.Op.and]: [{ unread: status },
        {
          requesterId: {
            [Sequelize.Op.in]: requestersIds
          }
        }]
      },
      include: [{ model: notificationType, as: 'type' }, { model: request, as: 'request' }]
    });
    return notifications;
  }
}

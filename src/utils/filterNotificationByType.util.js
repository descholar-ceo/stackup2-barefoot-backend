/* eslint-disable radix */
/**
 * @param {Array} notifications
 * @param {integer} typeId
 * @returns {object} returns array of inApp notifications
 * @description this function filters notifications by typeId
 * details depending on the value passed
 */
const filterNotificationByType = (notifications, typeId) => {
    const id = parseInt(typeId);
    return notifications.filter(notification => notification.dataValues.typeId === id);
};
export default filterNotificationByType;

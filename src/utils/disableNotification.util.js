/* eslint-disable require-jsdoc */
import userService from '../services/authentication.service';
import requestService from '../services/request.service';

const { updateIsVerifiedOrDisableNotification, getUserById } = userService;
const { updateInAppNotification } = requestService;
const disableNotification = async (mode, id) => {
    const { dataValues } = await getUserById(id);
    const emailNotificationStatus = dataValues.emailNotification;
    const inappNotificationStatus = dataValues.inAppNotification;
    if (mode === 'email') {
       await updateIsVerifiedOrDisableNotification(id, emailNotificationStatus);
    } else if (mode === 'inapp') {
        await updateInAppNotification(id, inappNotificationStatus);
    } else {
        return null;
    }
};  
export default disableNotification;

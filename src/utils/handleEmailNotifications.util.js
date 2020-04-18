import UserService from '../services/authentication.service';
import sendEmail from '../services/sendEmail.service';

const { findUserByEmail, getUserById } = UserService;

/**
   * @param {object} currentUser
   * @param {string} body
   * @param {string} tripLink
   * @param {string} title
   * @returns {Object} nothing
   * @description generates an email notification to both the lineManager and the requester
   */
const handleEmailNotifications = async (currentUser, body, tripLink, title) => {
    const { email, firstName } = currentUser;
    const user = await findUserByEmail(email);
    if (user.emailNotification) {
        await sendEmail.sendNotificationEmail(email, firstName, tripLink, body, title);
    }
};
export default handleEmailNotifications;

import jwtDecode from 'jwt-decode';
import _ from 'lodash';
import utils from '../utils/authentication.utils';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import objectFormatter from '../utils/objectFormatter';
import passportResponse from '../utils/passportResponse';
import UserService from '../services/authentication.service';
import RequestService from '../services/request.service';
import sendMail from '../utils/email.util';
import { resetMessage, changedMessage, verifyMessage } from '../utils/emailMessages';
import sendEmail from '../services/sendEmail.service';
import redisClient from '../database/redis.config';
import disableNotification from '../utils/disableNotification.util';

const {
  passwordHasher,
  generateToken,
  getFormData,
  decodeToken
} = utils;
const { successResponse, errorResponse, updatedResponse } = responseHandlers;
const {
  handleSignUp,
  findUserByEmailOrUsername,
  findUserEmailIfExist,
  updateUserPassword,
  updateIsVerifiedOrDisableNotification
} = UserService;
const {
  fbObjectFormatter,
  googleObjectFormatter
} = objectFormatter;

/**
   *@param {object} req request object
   *@param {object} res response object
   *@returns {object} response json object
   *  @description User authentication class
   */
export default class AuthenticationController {
  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description User sign up controller
   */
  static async signUp(req, res) {
    const payload = await getFormData(req.body);
    const { email, username } = payload;
    const checkEmail = await findUserEmailIfExist(email.toLowerCase());
    const checkUsername = await findUserByEmailOrUsername(username);
    if (checkEmail || checkUsername) {
      return errorResponse(res, statusCodes.conflict, customMessages.alreadyExistEmailOrUsername);
    }
    const password = await passwordHasher(payload.password);
    const dataWithoutPassword = _.omit(payload, 'password');
    const userData = { ...dataWithoutPassword, password };
    const saveUser = await handleSignUp(userData);
    const savedUserObject = _.omit(saveUser, 'password');
    const token = await generateToken(savedUserObject);
    await sendEmail.sendNotificationEmail(
      req.body.email,
      req.body.firstName,
      `${process.env.APP_URL}/api/auth/verify?token=${token}`,
      verifyMessage,
      'Verification email'
);
    return successResponse(res, statusCodes.created, customMessages.userSignupSuccess, token);
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to the user
   * @description function userLogin() sends the response of successful login
   */
  static userLogin = async (req, res) => {
    const { foundUser } = req;
    const token = await generateToken(foundUser);
    successResponse(res, statusCodes.ok, customMessages.loginSuccess, token);
  };

  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description send reset email controller
   */
  static async sendResetEmail(req, res) {
    const { email } = req.body;
    const {
      intro, instruction, text
    } = resetMessage;
      const users = await findUserByEmailOrUsername(email.toLowerCase());
      if (users) {
        const user = users.dataValues;
        const token = await generateToken(user);
        const url = `${token}`;
        await sendMail(user.email, user.firstName, intro, instruction, text, url);
        return successResponse(res, statusCodes.ok, customMessages.resetEmail, token);
      }
      return errorResponse(res, statusCodes.forbidden, customMessages.notExistUser);
  }

  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description update password controller
   */
  static async updatePassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    const {
      intro, instruction, text
    } = changedMessage;

    const userDetails = await decodeToken(token);
    const users = await findUserByEmailOrUsername(userDetails.email);
    const user = users.dataValues;
    const hashed = await passwordHasher(password);
    await updateUserPassword(hashed, user.id);
    await sendMail(user.email, user.firstName, intro, instruction, text, '#');
    return updatedResponse(res, statusCodes.ok, customMessages.changed);
  }

  static verify = async (req, res) => {
    const { token } = req.query;
    const decoded = jwtDecode(token);
    const { email } = decoded;
    await updateIsVerifiedOrDisableNotification(email);
    return successResponse(res, statusCodes.ok, customMessages.verifyMessage);
  }

  /**
  * @param {object} req
  * @param {object} res
  * @returns {object} sends response to the user
  * @description sends the response of successful login
  */
  static async facebookLogin(req, res) {
    const User = req.user;
    const { provider, _json: jsonFbObj } = User;
    const user = fbObjectFormatter(jsonFbObj, provider);
    const token = await passportResponse(user);
    return successResponse(
      res,
      statusCodes.ok,
      customMessages.socialMediaAuthSucess,
      token
    );
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to the user
   * @description sends the response of successful login
   */
  static async googleLogin(req, res) {
    const User = req.user;
    const { id, provider, _json: jsongoogleObj } = User;
    const user = googleObjectFormatter(jsongoogleObj, provider, id);
    const token = await passportResponse(user);
    return successResponse(
      res,
      statusCodes.ok, customMessages.socialMediaAuthSucess,
      token
    );
  }

  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description Log user out and save their token
   */
  static userLogout = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    redisClient.sadd('token', token);
    return successResponse(res, statusCodes.ok, customMessages.userLogoutSuccess);
  };

 /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to the user
   * @description sends the response of successful disable email notifications
   */
  static async disableNotification(req, res) {
    const { id } = req.sessionUser;
    const { mode } = req.query;
    const result = await disableNotification(mode, id);
    if (result === null) {
      return errorResponse(res, statusCodes.forbidden, customMessages.invalidMode);
    }
    return updatedResponse(
      res,
      statusCodes.ok, customMessages.NotificationDisabled,
    );
  }
}

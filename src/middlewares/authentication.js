import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import UserService from '../services/authentication.service';
import responseHandlers from '../utils/responseHandlers';
import redisClient from '../database/redis.config';
import userRoles from '../utils/userRoles.utils';
import utils from '../utils/authentication.utils';

const { errorResponse } = responseHandlers;
const { unAuthorized, badRequest, notFound, forbidden } = statusCodes;
const {
  tokenVerifyFailed,
  accountNotVerified,
  tokenInvalid,
  tokenMissing,
  userNotAllowedForAction,
} = customMessages;
const {
  lineManagerNotFound,
  userNotlineManager,
} = customMessages;
const { SUPER_ADMIN, SUPER_USER, MANAGER } = userRoles;
const { convertToLowerCase } = utils;
/**
 * @description Verifies authenticity of current user
 */
export default class Authentication {
  /**
   * @param {Request} req Node/Express Request object
   * @param {Response} res Node/Express Response object
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {NextFunction | Object} Node/Express Next callback function or an error response
   * @description Checks presence of a token in the Authorization request header,
   * decodes it, checks if token is blacklisted, 
   * checks if user is verified then adds the decoded data
   * to the request object as sessionUser property
   */
  static async isUserLoggedInAndVerified(req, res, next) {
    let token = req.get('authorization');
    if (!token) {
      return errorResponse(res, badRequest, tokenMissing);
    }
    token = token.split(' ').pop();
    try {
      const decodedToken = verify(token, process.env.JWT_KEY);
      const user = await UserService.findUserByEmailOrUsername(decodedToken.email);
      return redisClient.smembers('token', (err, userToken) => {
        if (userToken.includes(token) || !user) {
          return errorResponse(res, unAuthorized, tokenVerifyFailed);
        }
        if (!user.isVerified) {
          return errorResponse(res, unAuthorized, accountNotVerified);
        }
        req.sessionUser = decodedToken;
        return next();
      });
    } catch (error) { 
      return errorResponse(res, badRequest, tokenInvalid);
    }
  }


  /**
  * @param {Request} req Node/Express Request object
  * @param {Response} res Node/Express Response object
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction | Object} Node/Express Next callback function or an error response
  * @description Checks the user type,
  * decodes it, checks if the user is super admin or not
  */
  static async isUserSuperAdmin(req, res, next) {
    const tokenDecoded = req.sessionUser;
    if (tokenDecoded.role === SUPER_ADMIN || tokenDecoded.role === SUPER_USER) {
      req.body.email = convertToLowerCase(req.body.email);
      req.body.role = convertToLowerCase(req.body.role);
      return next();
    }
    return responseHandlers.errorResponse(res, unAuthorized, userNotAllowedForAction);
  }

  /**
  * @param {Request} req Node/Express Request object
  * @param {Response} res Node/Express Response object
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction | Object} Node/Express Next callback function or an error response
  * @description Checks if the user is manager or not
  */
  static async isUserManager(req, res, next) {
    const { role } = req.sessionUser;
    if (role === MANAGER) {
      return next();
    }
    return responseHandlers.errorResponse(res, unAuthorized, userNotAllowedForAction);
  }

  /**
  * @param {Request} req Node/Express Request object
  * @param {Response} res Node/Express Response object
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction | Object} Node/Express Next callback function or an error response
  * @description Checks if the user exists and is a manager
  */
  static async validateLineManager(req, res, next) {
    const { lineManager } = req.body;
    if (lineManager) {
      const user = await UserService.getUserById(lineManager);
      if (!user) {
        return responseHandlers.errorResponse(res, notFound, lineManagerNotFound);
      }
      const { role } = user.dataValues;
      if (role !== MANAGER) {
        return responseHandlers.errorResponse(res, forbidden, userNotlineManager);
      }
    }
    next();
  }
}

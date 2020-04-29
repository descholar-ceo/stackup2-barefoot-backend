import _ from 'lodash';
import customMessages from '../utils/customMessages';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import Validators from '../utils/validators';
import AccommodationService from '../services/accommodation.service';
import UserAccommodationReactionUtils from '../utils/userAccommodationReaction.utils';

const { errorResponse } = responseHandlers;

const { badRequest } = statusCodes;

const {
  accommodationNotExist,
  userAccommodationReactionNotExist,
} = customMessages;

const {
  validateAccommodationId,
} = Validators;

const {
  getAccommodationById,
  getUserAccommodationReaction,
} = AccommodationService;

const {
  extractAccommodationIdAndUserId,
} = UserAccommodationReactionUtils;

/** 
* @description a middleware for checking and validating User Accommodation Reactions
*/
export default class UserAccommodationReaction {
  /**
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction} next Node/Express Next function
  * @description checks if the provided accommodation exists in db and validates it
  */
  static async checkAccommodationInfo(req, res, next) {
    try {
      const validationOutput = await validateAccommodationId({ accommodationId: req.params.id });
      const { accommodationId } = validationOutput;
      const accommodationExists = !!await getAccommodationById(accommodationId);
      if (!accommodationExists) {
        return errorResponse(res, badRequest, accommodationNotExist);
      }
      return next();
    } catch (validationError) {
      return errorResponse(res, badRequest, validationError.message);
    }
  }

  /** 
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction} next Node/Express Next function
  * @description checks if the provided accommodation user reaction exists in db
  */
  static async checkUserAccommodationReactionExistence(req, res, next) {
    if (!await getUserAccommodationReaction(extractAccommodationIdAndUserId(req))) {
      return errorResponse(res, badRequest, userAccommodationReactionNotExist);
    }
    return next();
  }

  /** 
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction} next Node/Express Next function
  * @description checks if the accommodation has been liked before by the current user
  */
  static async hasUserLikedAccommodationBefore(req, res, next) {
    const { isLike, } = await getUserAccommodationReaction(extractAccommodationIdAndUserId(req));
    if (!isLike) {
      return errorResponse(res, badRequest, userAccommodationReactionNotExist);
    }
    return next();
  }

  /** 
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction} next Node/Express Next function
  * @description checks if the accommodation has been disliked before by the current user
  */
  static async hasUserDislikedAccommodationBefore(req, res, next) {
    const reactionInfo = extractAccommodationIdAndUserId(req);
    const { isDislike, } = await getUserAccommodationReaction(reactionInfo);
    if (!isDislike) {
      return errorResponse(res, badRequest, userAccommodationReactionNotExist);
    }
    return next();
  }
}

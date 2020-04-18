import Joi from '@hapi/joi';
import RequestService from '../services/request.service';
import CommentService from '../services/comment.service';
import customMessages from './customMessages';
import responseHandlers from './responseHandlers';
import statusCodes from './statusCodes';
import { displayErrorMessages } from './validations';
import Validators from './validators';
import userRoles from './userRoles.utils';

const { MANAGER } = userRoles;
const { createValidationErrors } = Validators;
const { errorResponse } = responseHandlers;
const { unAuthorized, notFound } = statusCodes;

const {
  emptyCommentBody,
  requestIdMustBeANumber,
  viewCmtNotMineReq,
  pageMustBeANumber
} = customMessages;
const {
  commentOnOthersReqNotAdmin,
  isNotMyComment,
  commentNoFound,
  requestNotExists
} = customMessages;

const { getCommentByPk } = CommentService;
const { getOneRequestFromDb } = RequestService;
/**
 * 
 * @param {object} commentData 
 * @param {bool} isUpdate 
 * @returns {object} validation
 * @description it returns validations of commentData
 */
const validateCmtData = (commentData, isUpdate) => {
  const submittedCmt = Joi.string().regex(/^(?!\s*$).+/).trim().required();
  const schema = isUpdate ? Joi.object({ comment: submittedCmt.messages(createValidationErrors('string', emptyCommentBody)) })
    : Joi.object({
    comment: submittedCmt.messages(createValidationErrors('string', emptyCommentBody)),
    requestId: Joi.number().integer().required().messages(createValidationErrors('number', requestIdMustBeANumber))
    });
  return schema.validate(commentData, {
    abortEarly: false,
  });
};
/**
 * 
 * @param {object} commentData 
 * @param {bool} isUpdate 
 * @returns {object} validation
 * @description it returns validations of commentData
 */
const joiValidateCmtRetrieval = (commentData) => {
  const schema = Joi.object({
      page: Joi.number().integer().optional().messages(createValidationErrors('number', pageMustBeANumber)),
      requestId: Joi.number().integer().required().messages(createValidationErrors('number', requestIdMustBeANumber))
    });
  return schema.validate(commentData, {
    abortEarly: false,
  });
};
/**
 * 
 * @param {object} reqData 
 * @param {bool} isUpdate 
 * @returns {object} validation
 * @description it returns validations of commentData
 */
const joiValidateRequestRetrieval = (reqData) => {
  const schema = Joi.object({
      page: Joi.number().integer().optional().messages(createValidationErrors('number', pageMustBeANumber)) });
  return schema.validate(reqData, {
    abortEarly: false,
  });
};

/**
 * @param {object} req 
 * @param {object} res
 * @returns {object} next
 */
const isItemExists = async (req) => {
  let itemId;
  let foundItem;
  let result = false;
  if (req.params.commentId) {
    itemId = req.params.commentId;
    if (!isNaN(itemId)) {
      foundItem = await getCommentByPk(itemId);
      req.commentFromDb = foundItem;
      result = true;
    }
  } else {
    itemId = req.params.requestId;
    foundItem = await getOneRequestFromDb(itemId);
    req.travelReqFromDb = foundItem;
    result = true;
  }
    if (foundItem) {
      return result;
    }
};

/**
 *@param{string} role
 *@param{integer} id
 *@param{object} travelReq
 *@param{array} result
 *@returns{array} result
 */
const yesTravelExists = (role, id, travelReq, result) => {
  if (role !== MANAGER) {
      if (id === travelReq.userId) {
          result = [true];
      } else { result = [false, viewCmtNotMineReq, unAuthorized]; }
    } else {
      result = [true];
  }
  return result;
};
/**
 * 
 * @param {object} req 
 * @returns {boolean} true or false 
 * @description it returns true if request exists 
 */
const isReqExistsAndPermitted = async (req) => {
  const { requestId } = req.query;
  const { role, id } = req.sessionUser;
  const travelReq = await getOneRequestFromDb(requestId);
  let result = [false];
  
  if (travelReq) {
    result = yesTravelExists(role, id, travelReq, result);
  } else {
    result = [false, requestNotExists, notFound];
  }
  return result;
};

/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} next 
 */
const midMethod = (req, res, next) => {
    const currUserId = req.sessionUser.id;
  const currUserRole = req.sessionUser.role;
  if (currUserRole !== MANAGER) {
        const { travelReqFromDb } = req;
    if (currUserId === travelReqFromDb.userId) {
   req.body.comment = req.body.comment.replace(/\s+/g, ' ');
            next();
          } else {
           errorResponse(res, unAuthorized, commentOnOthersReqNotAdmin);
          }
  } else {
    req.body.comment = req.body.comment.replace(/\s+/g, ' ');
        next();
      }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {object} next
 * @description it returns next to other ops if check pass
 */
const validateCommentRetrieval = async (req, res, next) => {
  const { error } = joiValidateCmtRetrieval(req.query);
  if (!error) {
    const isReqValid = await isReqExistsAndPermitted(req);
    if (isReqValid[0]) {
      next();
    } else {
      errorResponse(res, isReqValid[2], isReqValid[1]);
    }
  } else {
    displayErrorMessages(error, res, next);
  }
};

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {method} next method
 * @description middleware to check if the comment on a request is made by a manager or not
 */
const validateCommentPost = async (req, res, next) => {
  const { requestId } = req.params;
  const { comment } = req.body;
  const { error } = validateCmtData({ requestId, comment }, false);
  if (!error) {
    const isReqExist = await isItemExists(req);
    if (isReqExist) {
      midMethod(req, res, next);
    } else {
      errorResponse(res, notFound, requestNotExists);
    }
  } else {
    displayErrorMessages(error, res, next);
  }
};

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {method} next
 * @description it allows to continue update comment if the updater is the owner of the comment
 */
const validateCommentUpdate = async (req, res, next) => {
  const currUserId = req.sessionUser.id;
  await isItemExists(req);
  const { commentFromDb } = req;
  if (commentFromDb) {
    if (currUserId === commentFromDb.userId) {
          const { error } = validateCmtData(req.body, true);
          displayErrorMessages(error, res, next);
        } else {
          errorResponse(res, unAuthorized, isNotMyComment);
              }   
        } else {
          errorResponse(res, notFound, commentNoFound);
  }     
};
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {method} next
 * @description it allows to continue update comment if the updater is the owner of the comment
 */
const validateCommentDelete = async (req, res, next) => {
  const currUserId = req.sessionUser.id;
  await isItemExists(req);
  const { commentFromDb } = req;

  if (commentFromDb) {
    if (currUserId === commentFromDb.userId) {
      next();
        } else {
      errorResponse(res, unAuthorized, isNotMyComment);
              }   
        } else {
          errorResponse(res, notFound, commentNoFound);
  }     
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next 
 * @description it validate retrieve of requests
 */
const validateReqRetrieve = (req, res, next) => {
  const { error } = joiValidateRequestRetrieval(req.query);
  if (error) {
    displayErrorMessages(error, res, next);
  } else {
    next();
  }
};

export {
  validateCommentPost,
  validateCommentUpdate,
  validateCommentDelete,
  isItemExists,
  validateCommentRetrieval, validateReqRetrieve
};

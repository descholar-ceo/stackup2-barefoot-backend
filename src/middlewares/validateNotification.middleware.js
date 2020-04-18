/* eslint-disable radix */
import statusCode from '../utils/statusCodes';
import customMessage from '../utils/customMessages';
import reponsesHandler from '../utils/responseHandlers';

const { badRequest } = statusCode;
const { invalidStatus, invlidTypeId } = customMessage;
const { errorResponse } = reponsesHandler;
/**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @param {Response} next Node/express next
* @returns {object} error message if the status is invalid
* @description validates quey.params.status
*/
const validateNotificationStatus = (req, res, next) => {
    const { status } = req.query;
    const validStatuses = ['read', 'unread'];
    if (status) {
        if (!validStatuses.includes(status)) {
            return errorResponse(res, badRequest, invalidStatus);
        }
    }
    return next();
};

/**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @param {Response} next Node/express next
* @returns {object} error message if the status is invalid
* @description validates quey.params.status
*/
const validateNotificationTypeId = (req, res, next) => {
    const { typeId } = req.query;
    if (typeId) {
        if (isNaN((typeId))) {
            return errorResponse(res, badRequest, invlidTypeId);
        }
    }
    return next();
};
export default { validateNotificationStatus, validateNotificationTypeId };

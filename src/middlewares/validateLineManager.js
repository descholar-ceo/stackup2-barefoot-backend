import UserService from '../services/authentication.service';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';

const { getUserById } = UserService;
const { errorResponse } = responseHandlers;
const { badRequest } = statusCodes;
const { managerDoesntExist, lineManagerIsNotAManager } = customMessages;

/**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @param {Response} next Node/express next
* @returns {object} error message if the lineManager doesn't exist or is not a manager
* @description validates the line manager of a current user
*/
const validateLineManager = async (req, res, next) => {
    const { lineManager } = req.sessionUser;
      let manager = await getUserById(lineManager);
      if (manager === null) {
        return errorResponse(res, badRequest, managerDoesntExist);
      }
      manager = manager.dataValues;
      if (manager.role !== 'manager') {
        return errorResponse(res, badRequest, lineManagerIsNotAManager);
    }
    return next();
};
export default validateLineManager;

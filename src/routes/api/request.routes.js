import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import requestCheck from '../../middlewares/requestChecker';
import validateNotification from '../../middlewares/validateNotification.middleware';
import validateLineManager from '../../middlewares/validateLineManager';
import controllers from '../../controllers';
import notificationController from '../../controllers/notification.controller';
import {
  validateCommentPost,
  validateCommentUpdate,
  validateCommentDelete,
  validateCommentRetrieval, validateReqRetrieve
} from '../../utils/comment.validations';
import {
  isTripRequestValid,
  isTripRequestsSearchValid,
  handleRequestStatusUpdate,
  handleRequestReassignment,
} from '../../utils/validations';
    
const { 
    createTripRequest, 
    placesAndVisitTimes, 
    getListOfMyRequests, 
    updateTripRequest,
    searchTripRequests,
    getUserTripsStats, 
} = RequestController;
const {
  isUserLoggedInAndVerified,
  isUserManager,
} = Authentication;
const {
  isRequestOpenIsRequestYours,
  isRequestValid,
  checkTripRequest,
  isNewUserAManager,
  checkRequesterManager
} = requestCheck;
const {
  addNewComment,
  getCommentSpecificReq,
  updateComments,
  deleteComment
} = controllers.CommentController;

const { inAppNotifications, getTrip } = notificationController;

const router = express.Router();
const { validateNotificationStatus, validateNotificationTypeId } = validateNotification;

router.post('/', [isUserLoggedInAndVerified, isTripRequestValid], validateLineManager, createTripRequest);
router.get('/most-traveled-destinations', isUserLoggedInAndVerified, placesAndVisitTimes);
router.post('/:requestId/comment', isUserLoggedInAndVerified, validateCommentPost, addNewComment);
router.get('/comment', isUserLoggedInAndVerified, validateCommentRetrieval, getCommentSpecificReq);
router.patch('/comment/:commentId', isUserLoggedInAndVerified, validateCommentUpdate, updateComments);
router.delete('/comment/:commentId', isUserLoggedInAndVerified, validateCommentDelete, deleteComment);
router.get('/', isUserLoggedInAndVerified, validateReqRetrieve, getListOfMyRequests);
router.get('/search', [isUserLoggedInAndVerified, isTripRequestsSearchValid], searchTripRequests);
router.get('/stats', [isUserLoggedInAndVerified], getUserTripsStats);
router.patch('/:requestId', isUserLoggedInAndVerified, isRequestValid, isRequestOpenIsRequestYours, isTripRequestValid, validateLineManager, updateTripRequest);
router.patch(
  '/:tripRequestId/approve',
  isUserLoggedInAndVerified,
  isUserManager,
  handleRequestStatusUpdate,
  checkTripRequest,
  checkRequesterManager,
  validateLineManager,
  RequestController.approveTripRequest
);
router.patch(
  '/:tripRequestId/reject',
  isUserLoggedInAndVerified,
  isUserManager,
  handleRequestStatusUpdate,
  checkTripRequest,
  checkRequesterManager,
  validateLineManager,
  RequestController.rejectTripRequest
);
router.patch(
  '/:tripRequestId/reassign',
  isUserLoggedInAndVerified,
  isUserManager,
  handleRequestReassignment,
  checkTripRequest,
  isNewUserAManager,
  checkRequesterManager,
  validateLineManager,
  RequestController.assignTripRequest
);
router.get('/inapp/notification/', isUserLoggedInAndVerified, validateNotificationStatus, validateNotificationTypeId, inAppNotifications);
router.get('/:id', getTrip);

export default router;

import express from 'express';
import AuthenticationController from '../../controllers/authentication.controller';
import { bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials } from '../../middlewares/credentialChecker';
import passport from '../../config/passport';
import { signupValidation, passwordValidation, validateResetEmail } from '../../middlewares/authValidation';
import { verifyToken } from '../../utils/validations';
import Authentication from '../../middlewares/authentication';

const {
  signUp,
  userLogin,
  sendResetEmail,
  updatePassword,
  verify,
  userLogout
} = AuthenticationController;
const {
  isUserLoggedInAndVerified,
  checkUserVerification,
} = Authentication;

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', signupValidation, signUp);
authenticationRouter.post('/login', bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials, userLogin);
authenticationRouter.post('/resetpassword', validateResetEmail, sendResetEmail);
authenticationRouter.post('/resetpassword/:token', passwordValidation, verifyToken, updatePassword);
authenticationRouter.get('/verify', checkUserVerification, verify);
authenticationRouter.get('/logout', isUserLoggedInAndVerified, userLogout);

authenticationRouter.get('/facebook', passport.authenticate('facebook'));
authenticationRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false }), AuthenticationController.facebookLogin);
authenticationRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authenticationRouter.get('/google/callback', passport.authenticate('google', { session: false }), AuthenticationController.googleLogin);

export default authenticationRouter;

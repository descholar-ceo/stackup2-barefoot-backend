/* eslint-disable require-jsdoc */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';
import AuthenticationService from '../../src/services/authentication.service';
import redisClient from '../../src/database/redis.config';
import BackgroundTasks from '../../src/utils/backgroundTasks.utils';
import scheduler from '../../src/taskScheduler';
import models from '../../src/database/models';
import { DROP_USER } from '../data/insert-sample-data-in_db';
import roles from '../../src/utils/userRoles.utils';

let generatedToken;
const loginToken = {
  token: null,
  notVerified: null
};
const {
  signupData,
  invalidFirstname,
  invalidLastname,
  invalidUsername,
  invalidEmail,
  invalidGender,
  invalidPassword,
  invalidAddress,
  signupDataNotVerified,
  testingTokens,
  managerTestAccount,
  loginSuperUser,
} = mockData;

const { expiredTokenCleanUp } = BackgroundTasks;
const { sequelize } = models;

chai.use(chaiHttp);
chai.should();

let superUserToken = '';

describe('User sign up', () => {
  it('Should return 400 if firstname is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidFirstname)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidFirstname);
        done();
      });
  });
  it('Should return 400 if lastname is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidLastname)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidLastname);
        done();
      });
  });
  it('Should return 400 if username is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidUsername)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidUsername);
        done();
      });
  });
  it('Should return 400 if email is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidEmail)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidEmail);
        done();
      });
  });
  it('Should return 400 if gender is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidGender)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidGender);
        done();
      });
  });
  it('Should return 400 if password is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidPassword)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidPassword);
        done();
      });
  });
  it('Should return 400 if address is invalid', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(invalidAddress)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.invalidAddress);
        done();
      });
  });
  it('Should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(signupData)
      .end((err, res) => {
        const { message, token } = res.body;
        generatedToken = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should return 201 not verified', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(signupDataNotVerified)
      .end((err, res) => {
        const { message, token } = res.body;
        loginToken.notVerified = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should return 409 if provided email or username exist', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(signupData)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.conflict);
        expect(error).to.equal(customMessages.alreadyExistEmailOrUsername);
        done();
      });
  });
});
describe('Login', () => {
  it(`Login with real data especially email which are in the db, should return an
   object with a property of message and token`, (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.realLoginDataFromTheDb)
      .end((err, res) => {
        if (err) done(err);
        loginToken.token = res.body.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal('Successfully logged in');
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it(`Login with real data especially username which are in the db, should return an
   object with a property of message and token`, (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.realLoginDataFromTheDb1)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal('Successfully logged in');
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('Login with empty credentials should return an object with property error', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send({})
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal('Please enter your email or username and your password');
        done();
      });
  });
  it('Login with empty password', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.emptyLoginPassword)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal('Please enter your password');
        done();
      });
  });
  it('Login with empty password', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.emptyLoginEmail)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal('Please enter your email or username');
        done();
      });
  });
  it('Login with wrong password', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.WrongLoginPasswordData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal('Email and password mismatch');
        done();
      });
  });
  it('Login with wrong email', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.WrongLoginEmailData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal('Unknown credentials');
        done();
      });
  });
});
describe('Reset Email', () => {
  // reset email password sent
  it('reset correct password email', (done) => {
    chai
      .request(server)
      .post('/api/auth/resetpassword')
      .send(mockData.existEmail)
      .end((err, res) => {
        generatedToken = res.body.token;
        res.should.have.status(statusCodes.ok);
        res.body.message.should.be.equal(customMessages.resetEmail);
        done();
      });
  });
  // reset email password not sent
  it('reset wrong password email', (done) => {
    chai
      .request(server)
      .post('/api/auth/resetpassword')
      .send(mockData.notExistEmail)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        res.body.error.should.be.equal(customMessages.notExistUser);
        done();
      });
  });
  // reset email password not sent
  it('reset password for invalid email', (done) => {
    chai
      .request(server)
      .post('/api/auth/resetpassword')
      .send(mockData.invalidResetEmail)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        res.body.error.should.be.equal(customMessages.invalidEmail);
        done();
      });
  });
  // success update password
  it('update the password', (done) => {
    chai
      .request(server)
      .post(`/api/auth/resetpassword/${generatedToken}`)
      .send(mockData.validNewPassword)
      .end((err, res) => {
        res.should.have.status(statusCodes.ok);
        res.body.message.should.be.equal(customMessages.changed);
        done();
      });
  });
  // update invalid password
  it('update invalid password', (done) => {
    chai
      .request(server)
      .post(`/api/auth/resetpassword/${generatedToken}`)
      .send(mockData.invalidNewPassword)
      .end((err, res) => {
        res.body.error.should.be.equal(customMessages.invalidPassword);
        done();
      });
  });
  // welcome test
  it('welcome test', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(statusCodes.ok);
        done();
      });
  });
  // occured an error while updating
  it('errored update of the password ', (done) => {
    const { wrongToken } = testingTokens;
    chai
      .request(server)
      .post(`/api/auth/resetpassword/${wrongToken}`)
      .send(mockData.validNewPassword)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        res.body.error.should.be.equal(customMessages.tokenInvalid);
        done();
      });
  });
});
describe('Verify the account tests', () => {
  it('Should verify the email with token', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${generatedToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message);
        expect(message).to.equal(customMessages.verifyMessage);
        sequelize.query(DROP_USER);
        done();
      });
  });
  it('Verifying a user who does not exist should return 404', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${generatedToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.notFound);
        expect(error);
        expect(error).to.equal(customMessages.notExistUser);
        done();
      });
  });
  it('User sign up should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(signupData)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        generatedToken = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should verify the email with token', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${generatedToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message);
        expect(message).to.equal(customMessages.verifyMessage);
        done();
      });
  });
  it('Verifying an already verified user should return 409', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${generatedToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.conflict);
        expect(error);
        expect(error).to.equal(customMessages.accountAlreadyVerified);
        done();
      });
  });
  it('Verifying a user with an expired token should return 400', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${testingTokens.expiredToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.tokenInvalid);
        done();
      });
  });
  it('Verifying the user email without the token should return 400', (done) => {
    chai.request(server)
      .get('/api/auth/verify?token=')

      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error).to.be.a('string');
        expect(error).to.equal(customMessages.tokenMissing);
        done();
      });
  });
});
describe('Testing functions from authentication service class', () => {
  it('Function findUserByEmailOrUsername() expect to return a user', async () => {
    const { findUserByEmailOrUsername } = AuthenticationService;
    const returnedUser = await findUserByEmailOrUsername(mockData.findUserByEmailOfUsername);
    expect(returnedUser).to.be.an('object');
  });
});
describe('User logout', () => {
  it('First time logout should return 200', (done) => {
    chai
      .request(server)
      .get('/api/auth/logout')
      .set('Authorization', `Bearer ${generatedToken}`)
      .end((err, res) => {
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message);
        expect(message).to.equal(customMessages.userLogoutSuccess);
        done();
      });
  });
  it('Invalid but not expired token should return 401', (done) => {
    chai
      .request(server)
      .get('/api/auth/logout')
      .set('Authorization', `Bearer ${generatedToken}`)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.unAuthorized);
        expect(error);
        expect(error).to.equal(customMessages.tokenVerifyFailed);
        done();
      });
  });
  it('Logout without token should return 400', (done) => {
    chai
      .request(server)
      .get('/api/auth/logout')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.tokenMissing);
        done();
      });
  });
  it('Expired token should return 400', (done) => {
    chai
      .request(server)
      .get('/api/auth/logout')
      .set('Authorization', `Bearer ${testingTokens.expiredToken}`)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.tokenInvalid);
        done();
      });
  });
});
describe('Cron jobs for background tasks', () => {
  it('Should start the scheduler', async () => {
    scheduler.start();
  });
  before(() => {
    redisClient.sadd('token', testingTokens.expiredToken);
  });
  it('Should remove expired tokens if any', async () => {
    const result = await expiredTokenCleanUp();
  });
});

describe('Create manager account', () => {
  it('User sign up should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(managerTestAccount)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        generatedToken = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should verify the email with token', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${generatedToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message);
        expect(message).to.equal(customMessages.verifyMessage);
        done();
      });
  });
  // it('Signin as super user should return 200', done => {
  //   chai
  //     .request(server)
  //     .post('/api/auth/login')
  //     .set('Accept', 'Application/json')
  //     .send(loginSuperUser)
  //     .end((err, res) => {
  //       if (err) done(err);
  //       const { token } = res.body;
  //       superUserToken = `Bearer ${token}`;
  //       expect(res).to.have.status(statusCodes.ok);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
  //       done();
  //     });
  // });
  // it('Super User assigning role of manager to a regular user should return 200', done => {
  //   chai
  //     .request(server)
  //     .patch('/api/roles/assign-role')
  //     .set('Accept', 'Application/json')
  //     .set('authorization', superUserToken)
  //     .send({
  //       email: managerTestAccount.email,
  //       role: roles.MANAGER,
  //     })
  //     .end((err, res) => {
  //       if (err) done(err);
  //       expect(res).to.have.status(statusCodes.ok);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body).to.have.property('message').to.equal(customMessages.roleAssigned);
  //       done();
  //     });
  // });
});

export default loginToken;

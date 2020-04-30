import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';
import UserService from '../../src/services/authentication.service';

const { requester3Account } = mockData;
const { findUserByEmailOrUsername } = UserService;

let authTokenOfVerifiedUser;
let authTokenOfUnVerifiedUser;
let userToken;
let managerId;

chai.use(chaiHttp);
chai.should();

describe('Profile tests', () => {
  it(`Login with valid data especially email which are in the db, should return an
   object with a property of message and token`, (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.realLoginDataFromTheDb1)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Login with valid data from db containing verified user', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.realLoginDataFromTheDb)
      .end((err, res) => {
        if (err) done(err);
        authTokenOfVerifiedUser = res.body.token;
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Login with valid data from db containing unverified user', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(mockData.realLoginDataFromDbUnVerifiedUser)
      .end((err, res) => {
        if (err) done(err);
        authTokenOfUnVerifiedUser = res.body.token;
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
        expect(res.body).to.have.property('token');
        done();
      });
  });
  // it('Should verify user account', (done) => {
  //   chai.request(server)
  //     .get(`/api/auth/verify?token=${authTokenOfVerifiedUser}`)
  //     .end((err, res) => {
  //       if (err) done(err);
  //       console.log('===========');
  //       console.log(authTokenOfVerifiedUser);
  //       console.log('**** ', res.body);
  //       const { message } = res.body;
  //       expect(res.status).to.equal(statusCodes.ok);
  //       expect(message).to.be.a('string');
  //       expect(message).to.equal(customMessages.verifyMessage);
  //       done();
  //     });
  // });
  it(`Requesting a user profile with valid data and verified user, expect it to return user profile details
    with response status of 200`, (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.profileRetrievalSuccess);
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });

  it(`Requesting user profile while a user is not yet verified, expect it to return an object
    with an error message and status code of 401`, (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .set('authorization', `Bearer ${authTokenOfUnVerifiedUser}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.accountNotVerified);
        done();
      });
  });
  it(`Requesting to access a not exist profile expect it to return an object with error message and
    status code of 400`, (done) => {
    chai
      .request(server)
      .get('/api/profile/0')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.profileNotFound);
        done();
      });
  });
  it(`Update profile with verified credentials, and valid data; expecting to return code of 200, 
    and an object containing message and data as properties`, (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send(mockData.updateProfileWithValidData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.profileUpdateSuccess);
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });
  it(`Update profile with verified credentials, and invalid data (change email not allowed); 
  expecting to return code of 400, and an object containing message and data as properties`, (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send(mockData.updateProfileWithEmailWithinThem)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.changeEmailNotAllowed);
        done();
      });
  });
  it(`Update profile with verified credentials, with already exist username;
   expecting to return code of 401, and an object containing error message as property`, (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send(mockData.updateProfileWithAlreadyExistsUsername)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.conflict);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.usernameExistOrEmpty);
        done();
      });
  });

  it(`Update profile picture with verified credentials, and valid data; expecting to return code of 200, 
    and an object containing message and token as properties`, (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .attach('myImg', `${__dirname}/assets/img/react-logo.png`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.profileUpdateSuccess);
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });
  it(`Update profile picture with verified credentials, and unsupported media-type; expecting to return code of 415, 
    and an object containing  error message`, (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .attach('myImg', `${__dirname}/assets/img/welcometothenewworld.txt`)
      .end((err, res) => {
        if (err) done(err);
        console.log('This is the unsupported mediatype msg', res.body);
        expect(res).to.have.status(statusCodes.unsupportedMediaType);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.invalidPictureExt);
        done();
      });
  });
  it(`Update profile with unverified credentials should return status code of 403 and an error message telling
    a user to verify his/her account first`, (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', `Bearer ${authTokenOfUnVerifiedUser}`)
      .send(mockData.updateProfileWithValidData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.accountNotVerified);
        done();
      });
  });
  it(`Change user password with unverified account should return an object containing error message and status
  code of 401`, (done) => {
    chai
      .request(server)
      .patch('/api/profile/password')
      .set('authorization', `Bearer ${authTokenOfUnVerifiedUser}`)
      .send(mockData.changeUserPasswordWithValidDataAndVerified)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.accountNotVerified);
        done();
      });
  });
  it(`Change password with invalid old password should return an object and error message informing him/her
  about her/his mistake with status code 401`, (done) => {
    chai
      .request(server)
      .patch('/api/profile/password')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send(mockData.changeUserPasswordWithValidDataAndVerified)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.incorrectOldPassword);
        done();
      });
  });
  it(`Change password with invalid empty password should return an object and error message informing him/her
  about her/his mistake with status code 400`, (done) => {
    chai
      .request(server)
      .patch('/api/profile/password')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send(mockData.changeUserPasswordWithoutOldPassword)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.loginPasswordEmpty);
        done();
      });
  });
  it(`Change password with valid should return an object and message informing a user that his password 
  has been changed successfully`, (done) => {
    chai
      .request(server)
      .patch('/api/profile/password')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send({
        password: mockData.changeUserPasswordWithValidData.password,
        oldPassword: mockData.realLoginDataFromTheDb.password,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.passwordChangeSuccess);
        done();
      });
  });
  it(`Change password with invalid should return an object and message informing a user that his password 
    has must include capital letter, number and special characters`, (done) => {
    chai
      .request(server)
      .patch('/api/profile/password')
      .set('authorization', `Bearer ${authTokenOfVerifiedUser}`)
      .send(mockData.changeUserPasswordWithInValidData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.invalidPassword);
        done();
      });
  });
});

describe('Update Profile Tests - Line Manager', () => {
  it('Login a user should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send({
        email: requester3Account.email,
        password: requester3Account.password,
      })
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(token);
        userToken = `Bearer ${token}`;
        done();
      });
  });
  it('Updating user profile with line manager who does not exist should return 404', (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', userToken)
      .send({ lineManager: mockData.unexistantLineManager })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.notFound);
        expect(error);
        expect(error).to.equal(customMessages.lineManagerNotFound);
        done();
      });
  });
  it('Should find a user by email', (done) => {
    findUserByEmailOrUsername(requester3Account.email)
      .then(data => {
        const { id } = data.dataValues;
        managerId = id;
        chai.expect(id).to.be.a('number');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Updating user profile with a user who is not a manager should return 403', (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', userToken)
      .send({ lineManager: managerId })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.forbidden);
        expect(error);
        expect(error).to.equal(customMessages.userNotlineManager);
        done();
      });
  });
});

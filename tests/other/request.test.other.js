import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';
import UserService from '../../src/services/authentication.service';

const {
  manager1Account,
  manager2Account,
  unexistantUserId,
  tripRequestSample1,
  tripRequestSample2,
  requester3Account,
  loginSuperUser,
  multiCitiestripRequest,
  multiCitiestripRequestGreaterThan3OrLessThan2,
  multiCitiesDifferentLocation1,
  multiCitiesDifferentLocation2,
  multiCitiesGreaterThanDate,
  invalidMultiCitiesTripRequest,
  multiCitiesNotSameArrayLength,
  multiCitiesFirstOriginEqualToDestination,
  oneWayTripRequester1,
  duplicateUpdate
} = mockData;
const { 
  duplicateTripRequest,
  tripRequestCreated, 
  verifyMessage,
  arrayLengthError,
  travelFromEqualError,
  travelDateError,
  travelFromNETravelTo,
  requestUpdated
} = customMessages;
const { created, ok, badRequest } = statusCodes;
const { findUserByEmailOrUsername } = UserService;

chai.use(chaiHttp);
chai.should();

let authToken = '';
let manager1Token = '';
let tripId = '';
const unexistantTripId = 200;
let requestMId = '';
let userId;
let requesterToken;
let managerId;
let superUserToken;
let manager2Token;

describe('Manager approves and reject trip request', () => {
  it('Creating a requester should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(requester3Account)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        authToken = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should verify requester account', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authToken.split(' ').pop()}`)
      .end((err, res) => { 
        if (err) done(err); 
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });
  it('Login a requester should return 200', (done) => {
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
        requesterToken = `Bearer ${token}`;
        done();
      });
  });
  it('Requester creating a one way trip request should return 201', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send({
        travelFrom: 'Lagos',
        travelTo: 'Miami',
        travelDate: '2020-08-08',
        travelReason: 'business meeting',
        travelType: 'one-way',
        accommodation: true,
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(data);
        expect(data).to.be.an('object');
        expect(message).to.be.a('string');
        expect(message).to.equal(tripRequestCreated);
        tripId = data.id;
        done();
      });
  });
  
  it('User approving request is not a manager, should return 401', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/approve`)
      .set('Authorization', requesterToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.unAuthorized);
        expect(error);
        expect(error).to.equal(customMessages.userNotAllowedForAction);
        done();
      });
  });
  it('Creating a new user (manager 1) should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(manager1Account)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        manager1Token = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should verify new user (manager 1) account', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${manager1Token}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });
  it('Signin as super user should return 200', done => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(loginSuperUser)
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        superUserToken = `Bearer ${token}`;
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
        done();
      });
  });
  it('Super User assigning role of manager to a regular user should return 200', done => {
    chai
      .request(server)
      .patch('/api/roles/assign-role')
      .set('Accept', 'Application/json')
      .set('authorization', superUserToken)
      .send({
        email: manager1Account.email,
        role: manager2Account.role
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.roleAssigned);
        done();
      });
  });
  it('Login manager 1 should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send({
        email: manager1Account.email,
        password: manager1Account.password,
      })
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(token);
        manager1Token = `Bearer ${token}`;
        done();
      });
  });
  it('Manager approving request that does not exist should return 404', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${unexistantTripId}/approve`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.notFound);
        expect(error);
        expect(error).to.equal(customMessages.tripRequestNotFound);
        done();
      });
  });
  it('Manager approving request with invalid id should return 400', (done) => {
    chai
      .request(server)
      .patch('/api/trips/abcd/approve')
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(`${customMessages.invalidTripRequestId}.`);
        done();
      });
  });
  it('Should find a new user (manager 1) by email', (done) => {
    findUserByEmailOrUsername(manager1Account.email)
      .then(data => {
        const { id } = data.dataValues;
        managerId = id;
        chai.expect(id).to.be.a('number');
        done();
      })
      .catch(error => { done(); });
  });
  it('Should update the profile of a requester by setting a line manager', (done) => {
    chai
      .request(server)
      .patch('/api/profile')
      .set('authorization', requesterToken)
      .send({ lineManager: managerId })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(statusCodes.ok);
        done();
      });
  });
  it('Manager approving request of direct report or one that is assigned to him should return 200', (done) => {
    chai.request(server)
      .patch(`/api/trips/${tripId}/approve`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message).to.equal(customMessages.requestApprovalSuccess);
        done();
      });
  });
  it('Manager approving request that has already been approved should return 409', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/approve`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.conflict);
        expect(error);
        expect(error).to.equal(customMessages.tripRequestAlreadyApproved);
        done();
      });
  });
  it('Manager rejecting a trip request should return 200', (done) => {
    chai.request(server)
      .patch(`/api/trips/${tripId}/reject`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message).to.equal(customMessages.requestRejectionSuccess);
        done();
      });
  });
  it('Manager rejecting a request that has already been rejected should return 409', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reject`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.conflict);
        expect(error);
        expect(error).to.equal(customMessages.tripRequestAlreadyRejected);
        done();
      });
  });
  it('Manager approving request that has already been rejected should return 403', (done) => {
    chai.request(server)
      .patch(`/api/trips/${tripId}/approve`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.forbidden);
        expect(error).to.equal(customMessages.tripRequestAlreadyRejected);
        done();
      });
  });
});

describe('Manager assigns trip request to another manager', () => {
  it('Creating a user (manager 2) should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(manager2Account)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        manager2Token = token;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token);
        done();
      });
  });
  it('Should verify manager 2 account', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${manager2Token}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });
  it('Creating a one way trip request should return 201', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(tripRequestSample2)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(data); 
        expect(data).to.be.an('object');
        expect(message).to.be.a('string');
        expect(message).to.equal(tripRequestCreated);
        tripId = data.id;
        done();
      });
  });
  it('Should find a new user by email', (done) => {
    findUserByEmailOrUsername(manager2Account.email)
      .then(data => {
        const { id } = data.dataValues;
        userId = id;
        chai.expect(id).to.be.a('number');
        done();
      })
      .catch(error => { done(); });
  });
  it('Manager assigning request that does not exist should return 404', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${unexistantTripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${userId}` })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.notFound);
        expect(error);
        expect(error).to.equal(customMessages.tripRequestNotFound);
        done();
      });
  });
  it('Manager assigning request to a user that does not exist should return 404', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${unexistantUserId}` })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.notFound);
        expect(error);
        expect(error).to.equal(customMessages.notExistUser);
        done();
      });
  });
  it('Manager assigning request to a user without userId should return 400', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.tripRequestReassignEmptyUserId);
        done();
      });
  });
  it('Manager assigning request to a user with invalid userId should return 400', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: unexistantUserId })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.userIdNotString);
        done();
      });
  });
  it('Manager assigning request to a non manager should return 403', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${userId}` })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.forbidden);
        expect(error);
        expect(error).to.equal(customMessages.cannotAssignToNonManager);
        done();
      });
  });
  it('Super admin assigning role of manager to a regular user (manager 2) should return 200', done => {
    chai
      .request(server)
      .patch('/api/roles/assign-role')
      .set('Accept', 'Application/json')
      .set('authorization', superUserToken)
      .send({
        email: manager2Account.email,
        role: manager2Account.role
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.roleAssigned);
        done();
      });
  });
  it('Login manager 2 should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send({
        email: manager2Account.email,
        password: manager2Account.password,
      })
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(token);
        manager2Token = `Bearer ${token}`;
        done();
      });
  });
  it('Manager 2 approving request not assigned to him/direct report should return 401', (done) => {
    chai.request(server)
      .patch(`/api/trips/${tripId}/approve`)
      .set('Authorization', manager2Token)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.unAuthorized);
        expect(error).to.equal(customMessages.requesterNotMyDirectReport);
        done();
      });
  });
  it('Manager assigning request to another manager should return 200', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${userId}` })
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message);
        expect(message).to.equal(customMessages.tripRequestReassignSuccess);
        done();
      });
  });
  it('Manager assigning request to the same manager should return 409', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${userId}` })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.conflict);
        expect(error);
        expect(error).to.equal(customMessages.tripRequestReassignConflict);
        done();
      });
  });
  it('Manager approving request should return 200', (done) => {
    chai.request(server)
      .patch(`/api/trips/${tripId}/approve`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message).to.equal(customMessages.requestApprovalSuccess);
        done();
      });
  });
  it('Manager assigning request that is already approved should return 403', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${userId}` })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.forbidden);
        expect(error);
        expect(error).to.equal(customMessages.cannotAssignApproved);
        done();
      });
  });
  it('Manager rejecting a trip request should return 200', (done) => {
    chai.request(server)
      .patch(`/api/trips/${tripId}/reject`)
      .set('Authorization', manager1Token)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(statusCodes.ok);
        expect(message).to.equal(customMessages.requestRejectionSuccess);
        done();
      });
  });
  it('Manager assigning request that is already rejected should return 403', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${tripId}/reassign`)
      .set('Authorization', manager1Token)
      .send({ userId: `${userId}` })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.forbidden);
        expect(error);
        expect(error).to.equal(customMessages.cannotAssignRejected);
        done();
      });
  });
});

describe('Multi City Trip Request', () => {
  it('should create a multi cities trip request', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiestripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        requestMId = data.id;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(tripRequestCreated);
        done();
      });
  });

  it('should not create a multi cities trip request if requests greater than 2', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiestripRequestGreaterThan3OrLessThan2)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        done();
      });
  });

  it('Request first destination should be the same as the second origin', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiesDifferentLocation1)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(travelFromEqualError);
        done();
      });
  });
  it('Request second destination should be the same as the third origin', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiesDifferentLocation2)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(travelFromEqualError);
        done();
      });
  });
  it('Request first date should not be greater than the second', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiesGreaterThanDate)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(travelDateError);
        done();
      });
  });
  it('Request travelFrom, travelTo and travelDate, should all hold the same amount of data', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiesNotSameArrayLength)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(arrayLengthError);
        done();
      });
  });
  it('Request first origin should not equal to any destination', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiesFirstOriginEqualToDestination)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(travelFromNETravelTo);
        done();
      });
  });
  it('should not create a duplicate multi cities request', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(multiCitiestripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(duplicateTripRequest);
        done();
      });
  });
  it('should not create a multi cities request with invalid values', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', requesterToken)
      .send(invalidMultiCitiesTripRequest)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });
});


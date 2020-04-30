import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../src/database/models';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';
import loginToken from '../controllers/authentication.test';
import { INSERT_SAMPLE_REQUEST, UPDATE_USER_8_TO_MANAGER, INSERT_REQUEST, INSERT_USER, SELECT_REQUEST } from '../data/insert-sample-data-in_db';

const { sequelize } = models;
const {
  oneWayTripRequest,
  oneWayTripRequester,
  tripRequesterNoCommentYet,
  returnTripRequest,
  returnTripInvalidType,
  invalidReturnDate,
  tripRequesterManagerNoRquestYet,
  managerLoginValidData,
  searchTripRequests,
  tripsStatsValidTimeframe,
  tripsStatsInvalidTimeframe,
  testingTokens,
  travelUpdated,
  duplicateUpdate,
  updateUser,
  updator,
  loginSuperUser,
  managerTestAccount,
} = mockData;
const {
  invalidTravelType,
  oneWayTripRequestCreated,
  tokenInvalid,
  tokenMissing,
  userSignupSuccess,
  accountNotVerified,
  verifyMessage,
  duplicateTripRequest,
  noPlacesRetrieved,
  placesRetrieved,
  commentAdded,
  requestIdMustBeANumber,
  commentUpdatedSuccess,
  isNotMyComment,
  commentNoFound,
  commentOnOthersReqNotAdmin,
  requestNotExists,
  commentDeleted, commentsRetrieved, noCommentYet, noCommentOnThisPage, viewCmtNotMineReq,
  requestsRetrieved, noRequestsYet, noRequestsFoundOnThisPage, pageMustBeANumber,
  invalidTripRequestsSearchTerm,
  invalidTripRequestsSearchField,
  invalidTripRequestsSearchLimit,
  invalidTripRequestsSearchOffset,
  invalidTripRequestsSearchFieldId,
  invalidTripRequestsSearchFieldTravelDate,
  invalidTripRequestsSearchFieldReturnDate,
  invalidTripRequestsSearchFieldStatus,
  invalidTripRequestsSearchFieldTravelType,
  emptySearchResult,
  invalidTripsStatsEndDate,
  viewStatsUnauthorized,
  requesterNotRegistered,
  requestUpdated,
  notOpenRequest,
  emptyUpdate,
  notExistRequest,
  notYourRequest,
} = customMessages;
const {
  created,
  badRequest,
  unAuthorized,
  ok, notFound
} = statusCodes;
const { wrongToken } = testingTokens;
chai.use(chaiHttp);
chai.should();

let authToken = '';
let authTokenNoCommentYet = '';
let authTokenManagerToVerify = '';
let authTokenManager = '';
let authTokenRequesterNoReqYet = '';
let requesterProfile = {};
let managerProfile = {};
let requestId = '';
let requestId2 = '';
let authUpdator = '';
let authApproved = '';
let managerTestAccountToken = '';

describe('One way trip request', () => {
  it('should create a trip requester(new user)', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(oneWayTripRequester)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(userSignupSuccess);
        expect(token);
        authToken = `Bearer ${token}`;
        done();
      });
  });


  it('Will create a new user who will need to retrieve requests without comments', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(tripRequesterNoCommentYet)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(userSignupSuccess);
        expect(token);
        authTokenNoCommentYet = `Bearer ${token}`;
        done();
      });
  });

  it('Will verify a requester with no commented requests', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authTokenNoCommentYet.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });
  it('Will create a manager', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(tripRequesterManagerNoRquestYet)
      .end((err, res) => {
        if (err) done(err);
        sequelize.query(UPDATE_USER_8_TO_MANAGER);
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(userSignupSuccess);
        expect(token);
        authTokenManagerToVerify = `Bearer ${token}`;
        done();
      });
  });

  it('Will verify Manager\'s account and update that account from requester to manager', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authTokenManagerToVerify.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });

  it('Login as a manager', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(managerLoginValidData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal('Successfully logged in');
        expect(res.body).to.have.property('token');
        authTokenManager = `Bearer ${res.body.token}`;
        done();
      });
  });

  it('should not create a one way trip request for unverified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unAuthorized);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(accountNotVerified);
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

  it(`Requesting the most traveled destinations while there is no any yet, should return an object with 404
  error code, and error message`, (done) => {
    chai
      .request(server)
      .get('/api/trips/most-traveled-destinations')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(statusCodes.notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(noPlacesRetrieved);
        done();
      });
  });
  it('should create a one way trip request for verified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        requestId2 = data.id;
        expect(res.status).to.equal(created);
        expect(message);
        expect(data);
        expect(data).to.be.an('object');
        expect(message).to.be.a('string');
        expect(message).to.equal(oneWayTripRequestCreated);
        done();
      });
  });
  it('should create a return trip request for verified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        requestId = data.id;
        expect(res.status).to.equal(created);
        expect(message);
        expect(data);
        expect(data).to.be.an('object');
        expect(message).to.be.a('string');
        expect(message).to.equal(oneWayTripRequestCreated);
        done();
      });
  });
  it('should not create a duplicate one way trip request', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(oneWayTripRequest)
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
  it('should not create a duplicate return trip request', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(returnTripRequest)
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
  it('should not create a one way trip request with invalid travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...oneWayTripRequest, travelType: 'invalid-travel-type' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });

  it('should not create a one way trip request without travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...oneWayTripRequest, travelType: undefined })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });

  it('should not create a one way trip request with invalid trip info', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...oneWayTripRequest, travelDate: 'invalid-travel-date' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });

  it('should not create a one way trip request without an authorization token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenMissing);
        done();
      });
  });
  it('should not create a one way trip request with invalid/expired token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', 'Bearer invalid_expired_token')
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenInvalid);
        done();
      });
  });
});
describe('Return trip request', () => {
  it('should not create a return trip request for unverified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', loginToken.notVerified)
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unAuthorized);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(accountNotVerified);
        done();
      });
  });


  it('should not create a return trip request without return date', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(invalidReturnDate)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(`${customMessages.invalidReturnDate}.`);
        done();
      });
  });

  it('should not create a return trip request with invalid travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(returnTripInvalidType)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });
  it('should not create a return trip request without travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...returnTripRequest, travelType: undefined })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });
  it('should not create a return trip request with invalid trip info', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...returnTripRequest, travelDate: 'invalid-travel-date' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });
  it('should not create a return trip request with invalid trip info', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...returnTripRequest, returnDate: 'invalid-return-date' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });
  it('should not create a return trip request without an authorization token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenMissing);
        done();
      });
  });

  it('should not create a return trip request with invalid/expired token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', 'Bearer invalid_expired_token')
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenInvalid);
        done();
      });
  });
  it('should not create a return trip request without an authorization token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenMissing);
        done();
      });
  });
});

describe('Testing most traveled destinations', () => {
  it('Requesting most traveled destinations should return 404', (done) => {
    chai
      .request(server)
      .get('/api/trips/most-traveled-destinations')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.notFound);
        expect(error);
        expect(error).to.equal(customMessages.noPlacesRetrieved);
        // sequelize.query(INSERT_SAMPLE_REQUEST);
        done();
      });
  });
  //   it(`Requesting the most traveled destinations, should return an object with 200 
  // status code, and array containing data`, (done) => {
  //     chai
  //       .request(server)
  //       .get('/api/trips/most-traveled-destinations')
  //       .set('Authorization', authToken)
  //       .end((err, res) => {
  //         console.log('?+?+?+?+?+?+??+?+?+?+?+?+?+?+?+');
  //         console.log(res.body);
  //         if (err) done(err);
  //         expect(res).to.have.status(ok);
  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.property('message').to.equal(placesRetrieved);
  //         expect(res.body).to.have.property('data').to.be.an('array');
  //         done();
  //       });
  //   });
});

describe('Testing other cases on comments', () => {
  it(`Posting comment with valid data, expect to return an object with 201 status 
  code and message and data as properties`, (done) => {
    chai
      .request(server)
      .post('/api/trips/1/comment')
      .set('Authorization', authToken)
      .send({ requestId: 1, comment: 'Comment with valid data on my request which is supposed to be inserted' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(created);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(commentAdded);
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });
  it(`Posting comment on notFoundRequest, expect to return an object with 404 status 
  code and message and data as properties`, (done) => {
    chai
      .request(server)
      .post('/api/trips/0/comment')
      .set('Authorization', authToken)
      .send({ comment: 'Comment on request which doesn\'t exist' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(requestNotExists);
        done();
      });
  });
  it(`Reading comment on my request from not exists page, expect it to return an object with error
    with 404 status code`, (done) => {
    chai
      .request(server)
      .get('/api/trips/comment?requestId=1&page=10000')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(noCommentOnThisPage);
        done();
      });
  });
  it('Reading comment on my request with no comment should return 404', (done) => {
    chai
      .request(server)
      .get('/api/trips/comment?requestId=5&page=1')
      .set('Authorization', authTokenNoCommentYet)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(customMessages.requestNotExists);
        done();
      });
  });
  it(`Updating comment which is not mine, expect it to return a response of 401 
  status code and an object containing error message`, (done) => {
    chai
      .request(server)
      .patch('/api/trips/comment/1')
      .set('Authorization', authTokenManager)
      .send({ comment: 'Welcome back to the new world' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(isNotMyComment);
        done();
      });
  });
  it(`Updating comment which is mine, expect it to return a response of 200 status code and an object containing
  message and data as properties`, (done) => {
    chai
      .request(server)
      .patch('/api/trips/comment/1')
      .set('Authorization', authToken)
      .send({ comment: 'Welcome back to the new world' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(commentUpdatedSuccess);
        expect(res.body).to.have.property('data').to.be.an('array');
        done();
      });
  });
  it(`Updating comment which doesn\'t exist, expect it to return a response of 404 status code and 
  an object containing error message`, (done) => {
    chai
      .request(server)
      .patch('/api/trips/comment/0')
      .set('Authorization', authToken)
      .send({ comment: 'Welcome back to the new world' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(commentNoFound);
        done();
      });
  });

  it(`Updating comment which doesn\'t exist, expect it to return a response of 404 status code and 
  an object containing error message`, (done) => {
    chai
      .request(server)
      .patch('/api/trips/comment/seoul')
      .set('Authorization', authToken)
      .send({ comment: 'Welcome back to the new world' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(commentNoFound);
        done();
      });
  });

  // it('Posting comment on other user\'s request while I am not a manager should return 401', (done) => {
  //   chai
  //     .request(server)
  //     // .post('/api/trips/5/comment')
  //     .post('/api/trips/2/comment')
  //     .set('Authorization', authToken)
  //     .send({ comment: 'Comment on other users while I am not a manager' })
  //     .end((err, res) => {
  //       console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  //       console.log(res.body);
  //       if (err) done(err);
  //       expect(res).to.have.status(unAuthorized);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body).to.have.property('error').to.equal(commentOnOthersReqNotAdmin);
  //       done();
  //     });
  // });
  it('Signin as a regular user should return 200', done => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send({
        email: managerTestAccount.email,
        password: managerTestAccount.password,
      })
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        managerTestAccountToken = `Bearer ${token}`;
        expect(res).to.have.status(statusCodes.ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
        done();
      });
  });
  it('Posting comment on other user\'s request while I am not a manager should return 401', (done) => {
    chai
      .request(server)
      // .post('/api/trips/5/comment')
      .post('/api/trips/2/comment')
      .set('Authorization', managerTestAccountToken)
      .send({ comment: 'Comment on other users while I am not a manager' })
      .end((err, res) => {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log(res.body);
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(commentOnOthersReqNotAdmin);
        done();
      });
  });

  it(`Posting comment with weird data, expect it to return a response of 
  401 status code and an object containing error message`, (done) => {
    chai
      .request(server)
      .post('/api/trips/cool/comment')
      .set('Authorization', authToken)
      .send({ comment: 'Comment with weird data' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(requestIdMustBeANumber);
        done();
      });
  });

  it(`Posting comment as a manager on any request, expect it to return response with 201 status code
  and an object with message and data properties`, (done) => {
    chai
      .request(server)
      .post('/api/trips/1/comment')
      .set('Authorization', authToken)
      .send({ comment: 'Comment with valid data as a manager which is supposed to be inserted' })
      .end((err, res) => {
        console.log('@@@@@@@@@@@@@@@@@@@@@');
        console.log(res.body);
        if (err) done(err);
        expect(res).to.have.status(created);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(commentAdded);
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });

  it('Will read all comments any comment as a manager', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=1&page=1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal(commentsRetrieved);
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('commentNumber');
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('foundComments');
        done();
      });
  });

  it('Will read any comment as a manager', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=1&page=1')
      .set('Authorization', authTokenNoCommentYet)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(viewCmtNotMineReq);
        done();
      });
  });
  it('Will read all comments on a single request', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=1&page=1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal(commentsRetrieved);
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('commentNumber');
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('foundComments');
        done();
      });
  });
  it('Will read all comments on a single request without sending page number', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal(commentsRetrieved);
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('commentNumber');
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('foundComments');
        done();
      });
  });

  it('Will try to read comments on a single request where request param is a string', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=seoul&page=1')
      .set('Authorization', authTokenManager)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(requestIdMustBeANumber);
        done();
      });
  });
  it('Will try to read comments on not found request', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=0&page=1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(requestNotExists);
        done();
      });
  });
  it('Will try to read comment on a request which doesn\'t have any comment yet', (done) => {
    chai.request(server)
      .get('/api/trips/comment?requestId=2&page=1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(noCommentYet);
        done();
      });
  });

  it('Will retrieve all requests of logged-in user', (done) => {
    chai
      .request(server)
      .get('/api/trips')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.an('object').to.have.property('message').to.equal(requestsRetrieved);
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('totalRequests').to.be.an('number');
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('foundRequests').to.be.an('array');
        done();
      });
  });
  it('Will retrieve all requests of logged-in user with sending the page', (done) => {
    chai
      .request(server)
      .get('/api/trips?page=1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.an('object').to.have.property('message').to.equal(requestsRetrieved);
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('totalRequests').to.be.an('number');
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('foundRequests').to.be.an('array');
        done();
      });
  });
  it('Will retrieve all requests of logged-in user with sending the page', (done) => {
    chai
      .request(server)
      .get('/api/trips?page=0')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.an('object').to.have.property('message').to.equal(requestsRetrieved);
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('totalRequests').to.be.an('number');
        expect(res.body).to.be.an('object').to.have.property('data').to.be.an('object').to.have.property('foundRequests').to.be.an('array');
        done();
      });
  });
  it(`Login with real data especially email which are in the db, should return an
   object with a property of message and token`, (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      // .send({ email: 'john@doe.com', password: 'Markjoe45@' })
      .send({ email: 'john@doe.com', password: 'Helloworld3@' })
      .end((err, res) => {
        if (err) done(err);
        authTokenRequesterNoReqYet = `Bearer ${res.body.token}`;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal('Successfully logged in');
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('Will not retrieve any request since this user doesn\'t have any request yet', (done) => {
    chai
      .request(server)
      .get('/api/trips')
      .set('Authorization', authTokenRequesterNoReqYet)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(noRequestsYet);
        done();
      });
  });
  it('Will not retrieve any request on a particular page because there is not there any request yet', (done) => {
    chai
      .request(server)
      .get('/api/trips?page=10000000')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(noRequestsFoundOnThisPage);
        done();
      });
  });
  it('Will not retrieve any request on a particular page because there is not there any request yet', (done) => {
    chai
      .request(server)
      .get('/api/trips?page=cool')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.an('object').to.have.property('error').to.equal(pageMustBeANumber);
        done();
      });
  });
});

describe('Testing deleting comments', () => {
  it('Will not be able to delete an not exists comment, expect it to return a response with 200 status code and an object with message', (done) => {
    chai
      .request(server)
      .delete('/api/trips/comment/0')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(commentNoFound);
        done();
      });
  });


  it(`Will try to delete comment which is not mine, 
    expect it to return a response with 401 status code and error message`, (done) => {
    chai
      .request(server)
      .delete('/api/trips/comment/1')
      .set('Authorization', authTokenManager)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(isNotMyComment);
        done();
      });
  });


  it('Will delete comment, expect it to return a response with 200 status code and an object with message', (done) => {
    chai
      .request(server)
      .delete('/api/trips/comment/1')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(commentDeleted);
        done();
      });
  });
});

describe('Search trip requests', () => {
  it('should retrieve trip requests with valid search criteria 1', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query(searchTripRequests)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('array');
        done();
      });
  });
  it('should retrieve trip requests with valid search criteria 2', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'travelTo', search: 'a' })
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('array');
        done();
      });
  });
  it('should retrieve trip requests(more than 0) with valid search criteria', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'travelFrom', search: 'Kigali' })
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('array');
        done();
      });
  });
  it('should retrieve trip requests with valid search criteria(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authTokenManager)
      .query(searchTripRequests)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('array');
        done();
      });
  });
  it('should retrieve trip requests with valid search criteria(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authTokenManager)
      .query({ ...searchTripRequests, field: 'travelFrom', search: 'k' })
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('array');
        done();
      });
  });
  it('should not retrieve trip requests with invalid search field travelType', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'travelType', search: 'invalidTravelType' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchFieldTravelType);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search field status', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'status', search: 'invalidStatus' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchFieldStatus);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search field returnDate', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'returnDate', search: 'invalidReturnDate' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchFieldReturnDate);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search field travelDate', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'travelDate', search: 'invalidTravelDate' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchFieldTravelDate);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search field id', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'id', search: 'invalidId' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchFieldId);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search offset', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, offset: 'invalidOffset' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchOffset);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search limit', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, limit: 'invalidLimit' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchLimit);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search field', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, field: 'InvalidField' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchField);
        done();
      });
  });
  it('should retrieve no trip requests', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, search: '2019-01-01' })
      .end((err, res) => {
        if (err) done(err);
        const { data, message } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('array');
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(emptySearchResult);
        done();
      });
  });
  it('should not retrieve trip requests with invalid search term', (done) => {
    chai
      .request(server)
      .get('/api/trips/search')
      .set('Authorization', authToken)
      .query({ ...searchTripRequests, search: '' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripRequestsSearchTerm);
        done();
      });
  });
});

describe('Trips stats', () => {
  it('should retrieve trips stats of current user(requester)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authToken)
      .query(tripsStatsValidTimeframe)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        const { tripsMade } = data;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('object');
        expect(tripsMade);
        expect(tripsMade).to.be.a('number');
        done();
      });
  });
  it('should retrieve trips stats of current user(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authTokenManager)
      .query(tripsStatsValidTimeframe)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        const { tripsMade } = data;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('object');
        expect(tripsMade);
        expect(tripsMade).to.be.a('number');
        done();
      });
  });
  it('should retrieve requester profile information', (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .set('authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        const { data } = res.body;
        expect(data);
        expect(data).to.be.an('object');
        requesterProfile = data;
        done();
      });
  });
  it('should retrieve manager profile information', (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .set('authorization', authTokenManager)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        const { data } = res.body;
        expect(data);
        expect(data).to.be.an('object');
        managerProfile = data;
        done();
      });
  });
  it('should retrieve trips stats of current user using their id(requester)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authToken)
      .query({ ...tripsStatsValidTimeframe, requesterId: requesterProfile.id })
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        const { tripsMade } = data;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('object');
        expect(tripsMade);
        expect(tripsMade).to.be.a('number');
        done();
      });
  });
  it('should retrieve trips stats of current user using their id(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authTokenManager)
      .query({ ...tripsStatsValidTimeframe, requesterId: managerProfile.id })
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        const { tripsMade } = data;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('object');
        expect(tripsMade);
        expect(tripsMade).to.be.a('number');
        done();
      });
  });
  it('should not retrieve trips stats of another user(requester)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authToken)
      .query({ ...tripsStatsValidTimeframe, requesterId: requesterProfile.id + 1 })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unAuthorized);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(viewStatsUnauthorized);
        done();
      });
  });
  it('should not retrieve trips stats due to invalid timeframe{requester}', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authToken)
      .query(tripsStatsInvalidTimeframe)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripsStatsEndDate);
        done();
      });
  });
  it('should retrieve trips stats of another user(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authToken)
      .query({ ...tripsStatsValidTimeframe, requesterId: managerProfile.id })
      .end((err, res) => {
        console.log('|||||||||||||||||||||||||||||');
        console.log(res.body);
        if (err) done(err);
        expect(res.status).to.equal(ok);
        const { data } = res.body;
        expect(data);
        expect(data).to.be.an('object');
        const { tripsMade } = data;
        expect(tripsMade);
        expect(tripsMade).to.be.a('number');
        done();
      });
  });
  it('should retrieve trips stats of a non-registered user(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authTokenManagerToVerify)
      .query({ ...tripsStatsValidTimeframe, requesterId: 15531 })
      .end((err, res) => {
        console.log('################');
        console.log(res.body);
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(requesterNotRegistered);
        done();
      });
  });
  it('should not retrieve trips stats due to invalid timeframe(manager)', (done) => {
    chai
      .request(server)
      .get('/api/trips/stats')
      .set('Authorization', authTokenManagerToVerify)
      .query({ ...tripsStatsInvalidTimeframe, requesterId: 1 })
      .end((err, res) => {
        console.log('::::::::::::::::::');
        console.log(res.body);
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTripsStatsEndDate);
        done();
      });
  });
});
describe('update open travel request', () => {
  let notOpenId;
  before('Insert sample request in db', () => {
    sequelize.query(INSERT_REQUEST)
      .then(() => {
        sequelize.query(SELECT_REQUEST)
          .then((request) => {
            [notOpenId] = request;
          });
      });
  });
  it('should not update open travel request when token is missing', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${requestId}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(tokenMissing);
        done();
      });
  });
  it('should not update open travel request when token is invalid', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${requestId}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(tokenInvalid);
        done();
      });
  });
  it('should not update open travel request when there is a request on that new travel date provided ', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${requestId}`)
      .set('Authorization', authToken)
      .send(travelUpdated)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(duplicateTripRequest);
        done();
      });
  });
  it('should update open travel request', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${requestId2}`)
      .set('Authorization', authToken)
      .send(duplicateUpdate)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(requestUpdated);
        done();
      });
  });
  it('should login the owner of approved request', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send(loginSuperUser)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal('Successfully logged in');
        expect(res.body).to.have.property('token');
        authApproved = `Bearer ${res.body.token}`;
        done();
      });
  });
  it('should not update approved or rejected travel request', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${notOpenId[1].id}`)
      .set('Authorization', authApproved)
      .send(travelUpdated)
      .end((err, res) => {
        console.log('////////////////////');
        console.log(notOpenId[1]);
        console.log(res.body);
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(notOpenRequest);
        done();
      });
  });
  it('should not update open travel request with empty information', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${requestId}`)
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(emptyUpdate);
        done();
      });
  });
  it('should not update open travel request which does not exist', (done) => {
    chai
      .request(server)
      .patch('/api/trips/5000')
      .set('Authorization', authToken)
      .send(travelUpdated)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(notExistRequest);
        done();
      });
  });

  it('should create an updator', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(updateUser)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(userSignupSuccess);
        expect(token);
        authUpdator = `Bearer ${token}`;
        done();
      });
  });
  it('Should verify requester account', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authUpdator.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });
  it('should not update open travel request which is not yours', (done) => {
    chai
      .request(server)
      .patch(`/api/trips/${requestId}`)
      .set('Authorization', authUpdator)
      .send(travelUpdated)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(notYourRequest);
        done();
      });
  });
});

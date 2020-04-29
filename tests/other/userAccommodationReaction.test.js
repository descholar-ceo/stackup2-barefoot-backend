import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';

chai.use(chaiHttp);

const {
  likedAccommodation,
  dislikedAccommodation,
  userAccommodationReactionNotExist,
  accommodationNotExist,
  unlikedAccommodation,
  unDislikedAccommodation,
  invalidBookAccommodationAccommodationId,
  verifyMessage,
  userSignupSuccess,
  oneWayTripRequestCreated,
  bookedAccommodation,
  nonBookedAccommodationReaction,
} = customMessages;

const {
  created,
  badRequest,
  ok,
} = statusCodes;

const {
  requester4Account,
  nonExistentAccommodationId,
  invalidAccommodationId,
  firstValidAccommodationId,
  secondValidAccommodationId,
} = mockData;

let bearerAuthToken = 'Bearer ';

describe('Like/Dislike Accommodations', () => {
  it('Should create a requester account', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(requester4Account)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(message);
        expect(message).to.equal(userSignupSuccess);
        expect(token);
        bearerAuthToken = `Bearer ${token}`;
        done();
      });
  });
  it('Should verify requester account', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${bearerAuthToken.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(ok);
        const { message } = res.body;
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });
  it('Should login a requester', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('Accept', 'Application/json')
      .send({
        email: requester4Account.email,
        password: requester4Account.password,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(ok);
        const { token } = res.body;
        expect(token);
        bearerAuthToken = `Bearer ${token}`;
        done();
      });
  });
  it('should not like an accommodation facility due to its absence', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${nonExistentAccommodationId}/like`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(accommodationNotExist);
        done();
      });
  });
  it('should not like an accommodation facility due to invalid accommodationId', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${invalidAccommodationId}/like`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidBookAccommodationAccommodationId);
        done();
      });
  });
  it('should not dislike an accommodation facility due to its absence', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${nonExistentAccommodationId}/dislike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(accommodationNotExist);
        done();
      });
  });
  it('should not un-dislike an accommodation facility before disliking it first', (done) => {
    chai
      .request(server)
      .patch(`/api/accommodations/${firstValidAccommodationId}/un-dislike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(userAccommodationReactionNotExist);
        done();
      });
  });
  it('should not unlike an accommodation facility before liking it first', (done) => {
    chai
      .request(server)
      .patch(`/api/accommodations/${firstValidAccommodationId}/unlike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(userAccommodationReactionNotExist);
        done();
      });
  });
  it('should like(new) an accommodation facility', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${firstValidAccommodationId}/like`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(likedAccommodation);
        done();
      });
  });
  it('should like(update) an accommodation facility', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${firstValidAccommodationId}/like`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(likedAccommodation);
        done();
      });
  });
  it('should unlike an accommodation facility', (done) => {
    chai
      .request(server)
      .patch(`/api/accommodations/${firstValidAccommodationId}/unlike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(unlikedAccommodation);
        done();
      });
  });
  it('should dislike an accommodation facility(1)', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${firstValidAccommodationId}/dislike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(dislikedAccommodation);
        done();
      });
  });
  it('should not unlike an accommodation facility before liking it first', (done) => {
    chai
      .request(server)
      .patch(`/api/accommodations/${firstValidAccommodationId}/unlike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(userAccommodationReactionNotExist);
        done();
      });
  });
  it('should un-dislike an accommodation facility', (done) => {
    chai
      .request(server)
      .patch(`/api/accommodations/${firstValidAccommodationId}/un-dislike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(unDislikedAccommodation);
        done();
      });
  });
  it('should not un-dislike an accommodation facility before disliking it first', (done) => {
    chai
      .request(server)
      .patch(`/api/accommodations/${firstValidAccommodationId}/un-dislike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(userAccommodationReactionNotExist);
        done();
      });
  });
  it('should retrieve all user reactions on a specific accommodation facility', (done) => {
    chai
      .request(server)
      .get(`/api/accommodations/${firstValidAccommodationId}/user-reactions`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(ok);
        expect(data);
        expect(data).to.be.an('object');
        expect(data.likes);
        expect(data.dislikes);
        expect(data.neutral);
        done();
      });
  });
  it('should dislike an accommodation facility(2)', (done) => {
    chai
      .request(server)
      .post(`/api/accommodations/${secondValidAccommodationId}/dislike`)
      .set('Authorization', bearerAuthToken)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(dislikedAccommodation);
        done();
      });
  });
});

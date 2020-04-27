import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';

const { 
    ratesRequester, 
    bookAccommodation, 
    ratesTripRequest, 
    validRatesInfo, 
    ratesFutureTripRequest,
    notRatesRequester,
    ratesTripRequestNotBooked,
    invalidRatesInfo,
    bookRateAccommodation,
    loginSuperUser,
} = mockData;
const { 
    oneWayTripRequestCreated, 
    bookedAccommodation, 
    successRating,
    beforeTripDate,
    failedRating,
    requestNotExists,
    notBookingOwner,
    notAssociated,
    invalidTripRequestId,
    invalidRates,
    invalidBookAccommodationAccommodationId,
    notExistAccommodation,
    notBooked,
    allRates,
    notRated,
 } = customMessages;
let ratesToken;
let notRatesToken;
let requestId;
let requestId2;
let requestId3;
let authAdmin;

chai.use(chaiHttp);
chai.should();

describe('Rating an accommodation', () => {
    it('Should create a rates user', (done) => {
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(ratesRequester)
          .end((err, res) => {
            if (err) done(err);
            const { message, token } = res.body;
            ratesToken = token;
            expect(res.status).to.equal(statusCodes.created);
            expect(message);
            expect(message).to.equal(customMessages.userSignupSuccess);
            expect(token);
            done();
          });
      });
      it('Should create not a rates user', (done) => {
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(notRatesRequester)
          .end((err, res) => {
            if (err) done(err);
            const { message, token } = res.body;
            notRatesToken = token;
            expect(res.status).to.equal(statusCodes.created);
            expect(message);
            expect(message).to.equal(customMessages.userSignupSuccess);
            expect(token);
            done();
          });
      });
      it('Should verify a rates user', (done) => {
        chai
          .request(server)
          .get(`/api/auth/verify?token=${ratesToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            done();
          });
      });
      it('Should verify not a rates user', (done) => {
        chai
          .request(server)
          .get(`/api/auth/verify?token=${notRatesToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            done();
          });
      });
      it('should login the admin', (done) => {
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
            authAdmin = `Bearer ${res.body.token}`;
            done();
          });
      });
      it('should create a one way trip request for rates user', (done) => {
        chai
          .request(server)
          .post('/api/trips')
          .set('Authorization', ratesToken)
          .send(ratesTripRequest)
          .end((err, res) => {
            if (err) done(err);
            console.log('1', res.body, 'token', ratesToken);
            const { message, data } = res.body;
            requestId = data.id;
            expect(res.status).to.equal(statusCodes.created);
            expect(message);
            expect(data);
            expect(data).to.be.an('object');
            expect(message).to.be.a('string');
            expect(message).to.equal(oneWayTripRequestCreated);
            done();
          });
        });
        it('should create a one way trip request for rates user not booked accommodation', (done) => {
            chai
              .request(server)
              .post('/api/trips')
              .set('Authorization', ratesToken)
              .send(ratesTripRequestNotBooked)
              .end((err, res) => {
                if (err) done(err);
                const { message, data } = res.body;
                requestId3 = data.id;
                expect(res.status).to.equal(statusCodes.created);
                expect(message);
                expect(data);
                expect(data).to.be.an('object');
                expect(message).to.be.a('string');
                expect(message).to.equal(oneWayTripRequestCreated);
                done();
              });
            });
        it('should create a one way trip request to happen in future for rates user', (done) => {
            chai
              .request(server)
              .post('/api/trips')
              .set('Authorization', ratesToken)
              .send(ratesFutureTripRequest)
              .end((err, res) => {
                if (err) done(err);
                const { message, data } = res.body;
                requestId2 = data.id;
                expect(res.status).to.equal(statusCodes.created);
                expect(message);
                expect(data);
                expect(data).to.be.an('object');
                expect(message).to.be.a('string');
                expect(message).to.equal(oneWayTripRequestCreated);
                done();
              });
            });
        it('should book an accommodation facility', (done) => {
          chai
              .request(server)
              .post('/api/accommodations/book')
              .set('Authorization', ratesToken)
              .send({ ...bookAccommodation, tripRequestId: requestId })
              .end((err, res) => {
                console.log('1', res.body, 'id', requestId);
                  if (err) done(err);
                  const { data, message } = res.body;
                  expect(res.status).to.equal(statusCodes.created);
                  expect(data);
                  expect(data).to.be.an('object');
                  expect(message);
                  expect(message).to.be.a('string');
                  expect(message).to.equal(bookedAccommodation);
                  done();
              });
      });
      it('should book an accommodation facility', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/book')
            .set('Authorization', ratesToken)
            .send({ ...bookRateAccommodation, tripRequestId: requestId2 })
            .end((err, res) => {
              console.log('1', res.body, 'id', requestId2);
                if (err) done(err);
                const { data, message } = res.body;
                expect(res.status).to.equal(statusCodes.created);
                expect(data);
                expect(data).to.be.an('object');
                expect(message);
                expect(message).to.be.a('string');
                expect(message).to.equal(bookedAccommodation);
                done();
            });
    });
    it('should rates an accommodation facility', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/rates')
            .set('Authorization', authAdmin)
            .send({ ...validRatesInfo, requestId: 1 })
            .end((err, res) => {
              console.log('1', res.body);
                if (err) done(err);
                const { data, message } = res.body;
                expect(res.status).to.equal(statusCodes.created);
                expect(data);
                expect(data).to.be.an('object');
                expect(message);
                
                expect(message).to.be.a('string');
                expect(message).to.equal(successRating);
                done();
            });
    });
    it('should not rates an accommodation facility for a trip which was rated', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/rates')
            .set('Authorization', authAdmin)
            .send({ ...validRatesInfo, requestId: 1 })
            .end((err, res) => {
              console.log('1', res.body);
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(failedRating);
                done();
            });
    });
    it('should not rates an accommodation facility for a trip not yet done', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/rates')
            .set('Authorization', ratesToken)
            .send({ ...validRatesInfo, requestId: requestId2 })
            .end((err, res) => {
              console.log('1', res.body);
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(beforeTripDate);
                done();
            });
    });
    it('should not rates an accommodation facility for a trip which does not exist', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/rates')
            .set('Authorization', ratesToken)
            .send({ ...validRatesInfo, requestId: 90000 })
            .end((err, res) => {
              console.log('1', res.body);
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(requestNotExists);
                done();
            });
    });
    it('should not rates an accommodation facility for a trip which is not yours', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/rates')
            .set('Authorization', notRatesToken)
            .send({ ...validRatesInfo, requestId })
            .end((err, res) => {
              console.log('1', res.body);
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(notBookingOwner);
                done();
            });
    });
    it('should not rates an accommodation facility for a trip which is not yours', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/rates')
            .set('Authorization', ratesToken)
            .send({ ...validRatesInfo, requestId: requestId3 })
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(notAssociated);
                done();
            });
    });
    it('should not rates an accommodation facility with invalid rates information', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/rates')
          .set('Authorization', ratesToken)
          .send({ ...invalidRatesInfo, requestId })
          .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(statusCodes.badRequest);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('error').to.equal(`${invalidRates}.`);
              done();
          });
  });
  it('should not rates an accommodation facility with invalid requestId', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/rates')
          .set('Authorization', ratesToken)
          .send({ ...validRatesInfo, requestId: 'jj' })
          .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(statusCodes.badRequest);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('error').to.equal(`${invalidTripRequestId}.`);
              done();
          });
  });
  it('should not retrieve rates for an accommodation which is invalid', (done) => {
    chai
        .request(server)
        .get('/api/accommodations/rates/huj')
        .set('Authorization', ratesToken)
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(statusCodes.badRequest);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').to.equal(`${invalidBookAccommodationAccommodationId}`);
            done();
        });
});
it('should not retrieve rates for an accommodation which does not exist', (done) => {
    chai
        .request(server)
        .get('/api/accommodations/rates/9000')
        .set('Authorization', ratesToken)
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(statusCodes.badRequest);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').to.equal(notExistAccommodation);
            done();
        });
});
it('should not retrieve rates for an accommodation which is not booked', (done) => {
    chai
        .request(server)
        .get('/api/accommodations/rates/2')
        .set('Authorization', ratesToken)
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(statusCodes.badRequest);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').to.equal(notBooked);
            done();
        });
});
it('should retrieve rates for a given accommodation', (done) => {
  chai
      .request(server)
      .get('/api/accommodations/rates/1')
      .set('Authorization', ratesToken)
      .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(statusCodes.ok);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').to.equal(allRates);
          done();
      });
});
it('should not retrieve rates for an accommodation which was not rated', (done) => {
  chai
      .request(server)
      .get('/api/accommodations/rates/3')
      .set('Authorization', ratesToken)
      .end((err, res) => {
        console.log(res.body);
          if (err) done(err);
          expect(res).to.have.status(statusCodes.badRequest);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').to.equal(notRated);
          done();
      });
});
});

/* eslint-disable require-jsdoc */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';

let generatedToken;
const { 
signupData,
invalidFirstname, 
invalidLastname,
invalidUsername, 
invalidEmail, 
invalidGender,
invalidPassword, 
invalidAddress 
} = mockData;

chai.use(chaiHttp);
chai.should();


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
    const user = {
      email: 'john@doe.com'
    };
    chai
      .request(server)
      .post('/api/auth/resetpassword')
      .send(user)
      .end((err, res) => {
        generatedToken = res.body.token;
        res.should.have.status(statusCodes.ok);
        res.body.message.should.be.equal(customMessages.resetEmail);
        done();
      });
  });
  // reset email password not sent
  it('reset wrong password email', (done) => {
    const user = {
      email: 'joe1@gmail.com'
    };
    chai
      .request(server)
      .post('/api/auth/resetpassword')
      .send(user)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        res.body.error.should.be.equal(customMessages.notExistUser);
        done();
      });
  });
  // success update password
  it('update the password', (done) => {
    const pass = {
      password: 'markjoe45'
    };
    chai
      .request(server)
      .post(`/api/auth/resetpassword/${generatedToken}`)
      .send(pass)
      .end((err, res) => {
        res.should.have.status(statusCodes.ok);
        res.body.message.should.be.equal(customMessages.changed);
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
  // occured an error while sending email
  it('occured reset email', (done) => {
    const user = {
      email: {}
    };
    chai
      .request(server)
      .post('/api/auth/resetpassword')
      .send(user)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        res.body.error.should.be.equal(customMessages.errorMessage);
        done();
      });
  });
  // occured an error while updating
  it('errored update of the password ', (done) => {
    const pass = {
      password: 'sesese'
    };
    const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVnaXp3ZW5heW9kaW55QGdtYWlsLmNvbSIsInVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiRGl2aW5lIiwiaWF0IjoxNTgzNDkyMzcxfQ.NHfHvcHcjVhaTYfrywu0-voW_VdVgH2Qcj4CTMOFhdU';
    chai
      .request(server)
      .post(`/api/auth/resetpassword/${wrongToken}`)
      .send(pass)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        res.body.error.should.be.equal(customMessages.errorMessage);
        done();
      });
  });
});

describe('Verify the account tests', () => {
  it('Should verify the email with token', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${generatedToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        done();
      });
  });
});
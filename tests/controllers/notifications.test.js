import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/notification.mock';


const { notificationRequter } = mockData;
const { userSignupSuccess } = customMessages;
const { created } = statusCodes;
let userToken;

describe('Notifications Tests', () => {
    // it('should create a new user for notifications', (done) => {
    //     chai
    //       .request(server)
    //       .post('/api/auth/signup')
    //       .send(notificationRequter)
    //       .end((err, res) => {
    //         if (err) done(err);
    //         const { message, token } = res.body;
    //         expect(res.status).to.equal(created);
    //         expect(message);
    //         expect(message).to.equal(userSignupSuccess);
    //         expect(token);
    //         userToken = `Bearer ${token}`;
    //         done();
    //       });
    //   });
});

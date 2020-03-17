export const INSERT_SAMPLE_REQUEST = `
INSERT INTO requests ("userId","travelReason","travelType",status,accommodation,"createdAt","updatedAt")
VALUES(10,'Business Meeting','one-way','accepted',true,NOW(),NOW()) RETURNING id`;

export const UPDATE_USER_8_TO_MANAGER = 'UPDATE users SET role=\'manager\' WHERE id=11';
export const INSERT_SAMPLE_COMMENT = `
INSERT INTO requests ("userId","requestId",comment,"createdAt","updatedAt")
VALUES(6,1,'Welcome to the new world',NOW(),NOW())`;
export const INSERT_USER = `
INSERT INTO users ("id","firstName","lastName","email","username","password","gender","address","role","isVerified","createdAt","updatedAt")
VALUES(15,'updator','updator',updator@gmail.com,'updator','Updator@0000','male','kigali','requester',true,NOW(),NOW())`;
export const INSERT_REQUEST_U1 = `
INSERT INTO requests ("userId","travelReason","travelType",status,accommodation,"createdAt","updatedAt")
VALUES(1,'Business','one-way','accepted',true,NOW(),NOW()) RETURNING id`;
export const INSERT_REQUEST_U2 = `
INSERT INTO trips ("requestId","travelFrom","travelTo","travelDate","createdAt","updatedAt")
VALUES(5,'Tokyo','Seoul','2020-07-18',NOW(),NOW())`;
export const SELECT_REQUEST = `
SELECT * FROM requests WHERE status = 'accepted';`;

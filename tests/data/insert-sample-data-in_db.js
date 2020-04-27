export const INSERT_SAMPLE_REQUEST = `
INSERT INTO requests ("userId","travelFrom","travelTo","travelDate","travelReason","travelType",status,accommodation,"createdAt","updatedAt")
VALUES(10,'Tokyo','Seoul','2020-05-18','Business Meeting','one-way','accepted',true,NOW(),NOW())`;

export const UPDATE_USER_8_TO_MANAGER = 'UPDATE users SET role=\'manager\' WHERE id=11';
export const INSERT_SAMPLE_COMMENT = `
INSERT INTO requests ("userId",comment,"createdAt","updatedAt")
VALUES(6,'Welcome to the new world',NOW(),NOW())`;
export const INSERT_USER = `
INSERT INTO users ("firstName","lastName","email","username","password","gender","address","role","isVerified","createdAt","updatedAt")
VALUES('updator','updator',updator@gmail.com,'updator','Updator@0000','male','kigali','requester',true,NOW(),NOW())`;
export const INSERT_REQUEST = `
INSERT INTO requests ("userId","travelFrom","travelTo","travelDate","travelReason","travelType",status,accommodation,"createdAt","updatedAt")
VALUES(1,'Tokyo','Seoul','2020-07-18','Business','one-way','accepted',true,NOW(),NOW())`;
export const SELECT_REQUEST = `
SELECT * FROM requests WHERE status = 'accepted';`;

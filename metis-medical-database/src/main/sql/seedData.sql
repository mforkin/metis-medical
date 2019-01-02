INSERT INTO public.specialty(name) values ('Specialty One');

INSERT INTO USERS (username, password, enabled, specialty_id) VALUES ('mike.forkin@gmail.com', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, 1);
INSERT INTO USERS (username, password, enabled, specialty_id) VALUES ('user', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, 1);
INSERT INTO USERS (username, password, enabled, specialty_id) VALUES ('lauren.k.dunn@gmail.com', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, 1);
INSERT INTO USERS (username, password, enabled, specialty_id) VALUES ('lak3r@virginia.edu', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, 1);


INSERT INTO AUTHORITIES (username, authority) values ('mike.forkin@gmail.com', 'ROLE_USER');
INSERT INTO AUTHORITIES (username, authority) values ('mike.forkin@gmail.com', 'ROLE_ADMIN');

INSERT INTO AUTHORITIES (username, authority) values ('lauren.k.dunn@gmail.com', 'ROLE_USER');
INSERT INTO AUTHORITIES (username, authority) values ('lauren.k.dunn@gmail.com', 'ROLE_ADMIN');

INSERT INTO AUTHORITIES (username, authority) values ('lak3r@virginia.edu', 'ROLE_USER');
INSERT INTO AUTHORITIES (username, authority) values ('lak3r@virginia.edu', 'ROLE_ADMIN');

INSERT INTO AUTHORITIES (username, authority) values ('user', 'ROLE_USER');
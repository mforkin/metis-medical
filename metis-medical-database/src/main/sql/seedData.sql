INSERT INTO public.specialty(name) values ('Specialty One');

INSERT INTO USERS (username, password, enabled, specialty_id) VALUES ('admin', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, 1);
INSERT INTO USERS (username, password, enabled, specialty_id) VALUES ('user', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, 1);


INSERT INTO AUTHORITIES (username, authority) values ('admin', 'ROLE_USER');
INSERT INTO AUTHORITIES (username, authority) values ('admin', 'ROLE_ADMIN');

INSERT INTO AUTHORITIES (username, authority) values ('user', 'ROLE_USER');
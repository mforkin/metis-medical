CREATE TABLE public.users(
    username varchar(100) NOT NULL,
    password varchar(90) NOT NULL,
    enabled boolean NOT NULL,
    specialty_id smallint NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY (username)
)
WITH (OIDS=FALSE);

CREATE TABLE public.authorities(
    username varchar(100) NOT NULL,
    authority varchar(50),
    CONSTRAINT ix_auth_username UNIQUE (username, authority)
)
with (OIDS=FALSE);

ALTER TABLE public.authorities ADD CONSTRAINT fk_auth_usr FOREIGN KEY (username)
REFERENCES public.users (username) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

CREATE TABLE public.specialty (
    id serial NOT NULL,
    name text NOT NULL,
    CONSTRAINT "specialty_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

ALTER TABLE public.users ADD CONSTRAINT fk_spec_usr FOREIGN KEY (specialty_id)
REFERENCES public.specialty (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

CREATE TABLE public.vignette (
    id serial NOT NULL,
    name text NOT NULL,
    CONSTRAINT "vignette_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.vignette_specialty (
    vignette_id smallint NOT NULL,
    specialty_id smallint NOT NULL,
    CONSTRAINT "vignette_specialty_pk" PRIMARY KEY (specialty_id, vignette_id)
)
WITH (OIDS=FALSE);

ALTER TABLE public.vignette_specialty ADD CONSTRAINT fk_vig_spe_vig FOREIGN KEY (vignette_id)
REFERENCES public.vignette (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.vignette_specialty ADD CONSTRAINT fk_vig_spe_spec FOREIGN KEY (specialty_id)
REFERENCES public.specialty (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

CREATE TABLE public.stage (
    id serial NOT NULL,
    name text NOT NULL,
    seq smallint NOT NULL,
    vignette_id smallint NOT NULL,
    CONSTRAINT "stage_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

ALTER TABLE public.stage ADD CONSTRAINT stage_vig_fk FOREIGN KEY (vignette_id)
REFERENCES public.vignette (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

CREATE TABLE public.question (
    id serial NOT NULL,
    stage_id smallint NOT NULL,
    seq smallint NOT NULL,
    question text NOT NULL,
    CONSTRAINT "question_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

ALTER TABLE public.question ADD CONSTRAINT ques_stag_fk FOREIGN KEY (stage_id)
REFERENCES public.stage (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

CREATE TABLE public.answer (
    id serial NOT NULL,
    seq smallint NOT NULL,
    answer text NOT NULL,
    correct_text text NOT NULL,
    incorrect_text text NOT NULL,
    selected_text text,
    CONSTRAINT "question_answer_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.question_answer (
    question_id smallint,
    answer_id smallint,
    CONSTRAINT "qa_pk" PRIMARY KEY (question_id, answer_id)
)
WITH (OIDS=FALSE);

ALTER TABLE public.question_answer ADD CONSTRAINT question_answer_question_fk FOREIGN KEY (question_id)
REFERENCES public.question (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.question_answer ADD CONSTRAINT question_answer_answer_fk FOREIGN KEY (answer_id)
REFERENCES public.answer (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;


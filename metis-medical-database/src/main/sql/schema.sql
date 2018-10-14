CREATE TABLE public.specialty (
    id serial NOT NULL,
    name text NOT NULL,
    CONSTRAINT "specialty_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.vignette (
    id serial NOT NULL,
    name text NOT NULL,
    CONSTRAINT "vignette_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.stage (
    id serial NOT NULL,
    name text NOT NULL,
    seq smallint NOT NULL,
    question_id smallint NOT NULL,
    CONSTRAINT "stage_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.vignette_stage (
    vignette_id smallint NOT NULL,
    stage_id smallint NOT NULL,
    CONSTRAINT "vignette_stage_pk" PRIMARY KEY (vignette_id, stage_id)
)
WITH (OIDS=FALSE);

ALTER TABLE public.vignette_stage ADD CONSTRAINT vig_stage_vig_fk FOREIGN KEY (vignette_id)
REFERENCES public.vignette (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.vignette_stage ADD CONSTRAINT vig_stage_stage_fk FOREIGN KEY (stage_id)
REFERENCES public.stage (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

CREATE TABLE public.question (
    id serial NOT NULL,
    question text NOT NULL,
    CONSTRAINT "question_pk" PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.answer (
    id serial NOT NULL,
    seq smallint NOT NULL,
    answer text NOT NULL,
    correct_text text NOT NULL,
    incorrect_text text NOT NULL,
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

ALTER TABLE public.stage ADD CONSTRAINT stage_question_fk FOREIGN KEY (question_id)
REFERENCES public.question (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

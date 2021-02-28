/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated;


import com.greenleaf.metis.medical.jooq.generated.tables.Answer;
import com.greenleaf.metis.medical.jooq.generated.tables.Authorities;
import com.greenleaf.metis.medical.jooq.generated.tables.Question;
import com.greenleaf.metis.medical.jooq.generated.tables.ResetHashes;
import com.greenleaf.metis.medical.jooq.generated.tables.Specialty;
import com.greenleaf.metis.medical.jooq.generated.tables.Stage;
import com.greenleaf.metis.medical.jooq.generated.tables.UserAvailableVignettes;
import com.greenleaf.metis.medical.jooq.generated.tables.UserResults;
import com.greenleaf.metis.medical.jooq.generated.tables.UserResultsAnswers;
import com.greenleaf.metis.medical.jooq.generated.tables.Users;
import com.greenleaf.metis.medical.jooq.generated.tables.Vignette;
import com.greenleaf.metis.medical.jooq.generated.tables.VignetteSpecialty;
import com.greenleaf.metis.medical.jooq.generated.tables.records.AnswerRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.AuthoritiesRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.QuestionRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.ResetHashesRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.SpecialtyRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.StageRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.UserAvailableVignettesRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.UserResultsAnswersRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.UserResultsRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.UsersRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.VignetteRecord;
import com.greenleaf.metis.medical.jooq.generated.tables.records.VignetteSpecialtyRecord;

import javax.annotation.Generated;

import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.UniqueKey;
import org.jooq.impl.Internal;


/**
 * A class modelling foreign key relationships and constraints of tables of 
 * the <code>public</code> schema.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Keys {

    // -------------------------------------------------------------------------
    // IDENTITY definitions
    // -------------------------------------------------------------------------

    public static final Identity<AnswerRecord, Integer> IDENTITY_ANSWER = Identities0.IDENTITY_ANSWER;
    public static final Identity<QuestionRecord, Integer> IDENTITY_QUESTION = Identities0.IDENTITY_QUESTION;
    public static final Identity<SpecialtyRecord, Integer> IDENTITY_SPECIALTY = Identities0.IDENTITY_SPECIALTY;
    public static final Identity<StageRecord, Integer> IDENTITY_STAGE = Identities0.IDENTITY_STAGE;
    public static final Identity<UserResultsRecord, Integer> IDENTITY_USER_RESULTS = Identities0.IDENTITY_USER_RESULTS;
    public static final Identity<VignetteRecord, Integer> IDENTITY_VIGNETTE = Identities0.IDENTITY_VIGNETTE;

    // -------------------------------------------------------------------------
    // UNIQUE and PRIMARY KEY definitions
    // -------------------------------------------------------------------------

    public static final UniqueKey<AnswerRecord> QUESTION_ANSWER_PK = UniqueKeys0.QUESTION_ANSWER_PK;
    public static final UniqueKey<AuthoritiesRecord> IX_AUTH_USERNAME = UniqueKeys0.IX_AUTH_USERNAME;
    public static final UniqueKey<QuestionRecord> QUESTION_PK = UniqueKeys0.QUESTION_PK;
    public static final UniqueKey<ResetHashesRecord> RH_PK = UniqueKeys0.RH_PK;
    public static final UniqueKey<SpecialtyRecord> SPECIALTY_PK = UniqueKeys0.SPECIALTY_PK;
    public static final UniqueKey<StageRecord> STAGE_PK = UniqueKeys0.STAGE_PK;
    public static final UniqueKey<UserAvailableVignettesRecord> UAV_PK = UniqueKeys0.UAV_PK;
    public static final UniqueKey<UserResultsRecord> USER_RESULTS_PK = UniqueKeys0.USER_RESULTS_PK;
    public static final UniqueKey<UserResultsRecord> USER_RES_UNQ = UniqueKeys0.USER_RES_UNQ;
    public static final UniqueKey<UsersRecord> USERS_PK = UniqueKeys0.USERS_PK;
    public static final UniqueKey<VignetteRecord> VIGNETTE_PK = UniqueKeys0.VIGNETTE_PK;
    public static final UniqueKey<VignetteSpecialtyRecord> VIGNETTE_SPECIALTY_PK = UniqueKeys0.VIGNETTE_SPECIALTY_PK;

    // -------------------------------------------------------------------------
    // FOREIGN KEY definitions
    // -------------------------------------------------------------------------

    public static final ForeignKey<AnswerRecord, QuestionRecord> ANSWER__QUES_ANSWER_FK = ForeignKeys0.ANSWER__QUES_ANSWER_FK;
    public static final ForeignKey<AuthoritiesRecord, UsersRecord> AUTHORITIES__FK_AUTH_USR = ForeignKeys0.AUTHORITIES__FK_AUTH_USR;
    public static final ForeignKey<QuestionRecord, StageRecord> QUESTION__QUES_STAG_FK = ForeignKeys0.QUESTION__QUES_STAG_FK;
    public static final ForeignKey<ResetHashesRecord, UsersRecord> RESET_HASHES__RESET_HASHES_FK = ForeignKeys0.RESET_HASHES__RESET_HASHES_FK;
    public static final ForeignKey<StageRecord, VignetteRecord> STAGE__STAGE_VIG_FK = ForeignKeys0.STAGE__STAGE_VIG_FK;
    public static final ForeignKey<UserAvailableVignettesRecord, UsersRecord> USER_AVAILABLE_VIGNETTES__USER_AVAILABLE_VIGNETTES = ForeignKeys0.USER_AVAILABLE_VIGNETTES__USER_AVAILABLE_VIGNETTES;
    public static final ForeignKey<UserResultsRecord, UsersRecord> USER_RESULTS__USER_ANSWER_USER_FK = ForeignKeys0.USER_RESULTS__USER_ANSWER_USER_FK;
    public static final ForeignKey<UserResultsAnswersRecord, UserResultsRecord> USER_RESULTS_ANSWERS__USER_RESULTS_RESULTS_FK = ForeignKeys0.USER_RESULTS_ANSWERS__USER_RESULTS_RESULTS_FK;
    public static final ForeignKey<UserResultsAnswersRecord, AnswerRecord> USER_RESULTS_ANSWERS__USER_RESULTS_ANSWER_ANSWER_FK = ForeignKeys0.USER_RESULTS_ANSWERS__USER_RESULTS_ANSWER_ANSWER_FK;
    public static final ForeignKey<UsersRecord, SpecialtyRecord> USERS__FK_SPEC_USR = ForeignKeys0.USERS__FK_SPEC_USR;
    public static final ForeignKey<VignetteSpecialtyRecord, VignetteRecord> VIGNETTE_SPECIALTY__FK_VIG_SPE_VIG = ForeignKeys0.VIGNETTE_SPECIALTY__FK_VIG_SPE_VIG;
    public static final ForeignKey<VignetteSpecialtyRecord, SpecialtyRecord> VIGNETTE_SPECIALTY__FK_VIG_SPE_SPEC = ForeignKeys0.VIGNETTE_SPECIALTY__FK_VIG_SPE_SPEC;

    // -------------------------------------------------------------------------
    // [#1459] distribute members to avoid static initialisers > 64kb
    // -------------------------------------------------------------------------

    private static class Identities0 {
        public static Identity<AnswerRecord, Integer> IDENTITY_ANSWER = Internal.createIdentity(Answer.ANSWER, Answer.ANSWER.ID);
        public static Identity<QuestionRecord, Integer> IDENTITY_QUESTION = Internal.createIdentity(Question.QUESTION, Question.QUESTION.ID);
        public static Identity<SpecialtyRecord, Integer> IDENTITY_SPECIALTY = Internal.createIdentity(Specialty.SPECIALTY, Specialty.SPECIALTY.ID);
        public static Identity<StageRecord, Integer> IDENTITY_STAGE = Internal.createIdentity(Stage.STAGE, Stage.STAGE.ID);
        public static Identity<UserResultsRecord, Integer> IDENTITY_USER_RESULTS = Internal.createIdentity(UserResults.USER_RESULTS, UserResults.USER_RESULTS.ID);
        public static Identity<VignetteRecord, Integer> IDENTITY_VIGNETTE = Internal.createIdentity(Vignette.VIGNETTE, Vignette.VIGNETTE.ID);
    }

    private static class UniqueKeys0 {
        public static final UniqueKey<AnswerRecord> QUESTION_ANSWER_PK = Internal.createUniqueKey(Answer.ANSWER, "question_answer_pk", Answer.ANSWER.ID);
        public static final UniqueKey<AuthoritiesRecord> IX_AUTH_USERNAME = Internal.createUniqueKey(Authorities.AUTHORITIES, "ix_auth_username", Authorities.AUTHORITIES.USERNAME, Authorities.AUTHORITIES.AUTHORITY);
        public static final UniqueKey<QuestionRecord> QUESTION_PK = Internal.createUniqueKey(Question.QUESTION, "question_pk", Question.QUESTION.ID);
        public static final UniqueKey<ResetHashesRecord> RH_PK = Internal.createUniqueKey(ResetHashes.RESET_HASHES, "rh_pk", ResetHashes.RESET_HASHES.USERNAME);
        public static final UniqueKey<SpecialtyRecord> SPECIALTY_PK = Internal.createUniqueKey(Specialty.SPECIALTY, "specialty_pk", Specialty.SPECIALTY.ID);
        public static final UniqueKey<StageRecord> STAGE_PK = Internal.createUniqueKey(Stage.STAGE, "stage_pk", Stage.STAGE.ID);
        public static final UniqueKey<UserAvailableVignettesRecord> UAV_PK = Internal.createUniqueKey(UserAvailableVignettes.USER_AVAILABLE_VIGNETTES, "uav_pk", UserAvailableVignettes.USER_AVAILABLE_VIGNETTES.USERNAME);
        public static final UniqueKey<UserResultsRecord> USER_RESULTS_PK = Internal.createUniqueKey(UserResults.USER_RESULTS, "user_results_pk", UserResults.USER_RESULTS.ID);
        public static final UniqueKey<UserResultsRecord> USER_RES_UNQ = Internal.createUniqueKey(UserResults.USER_RESULTS, "user_res_unq", UserResults.USER_RESULTS.USERNAME, UserResults.USER_RESULTS.SUBMISSION_DATETIME);
        public static final UniqueKey<UsersRecord> USERS_PK = Internal.createUniqueKey(Users.USERS, "users_pk", Users.USERS.USERNAME);
        public static final UniqueKey<VignetteRecord> VIGNETTE_PK = Internal.createUniqueKey(Vignette.VIGNETTE, "vignette_pk", Vignette.VIGNETTE.ID);
        public static final UniqueKey<VignetteSpecialtyRecord> VIGNETTE_SPECIALTY_PK = Internal.createUniqueKey(VignetteSpecialty.VIGNETTE_SPECIALTY, "vignette_specialty_pk", VignetteSpecialty.VIGNETTE_SPECIALTY.SPECIALTY_ID, VignetteSpecialty.VIGNETTE_SPECIALTY.VIGNETTE_ID);
    }

    private static class ForeignKeys0 {
        public static final ForeignKey<AnswerRecord, QuestionRecord> ANSWER__QUES_ANSWER_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.QUESTION_PK, Answer.ANSWER, "answer__ques_answer_fk", Answer.ANSWER.QUESTION_ID);
        public static final ForeignKey<AuthoritiesRecord, UsersRecord> AUTHORITIES__FK_AUTH_USR = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.USERS_PK, Authorities.AUTHORITIES, "authorities__fk_auth_usr", Authorities.AUTHORITIES.USERNAME);
        public static final ForeignKey<QuestionRecord, StageRecord> QUESTION__QUES_STAG_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.STAGE_PK, Question.QUESTION, "question__ques_stag_fk", Question.QUESTION.STAGE_ID);
        public static final ForeignKey<ResetHashesRecord, UsersRecord> RESET_HASHES__RESET_HASHES_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.USERS_PK, ResetHashes.RESET_HASHES, "reset_hashes__reset_hashes_fk", ResetHashes.RESET_HASHES.USERNAME);
        public static final ForeignKey<StageRecord, VignetteRecord> STAGE__STAGE_VIG_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.VIGNETTE_PK, Stage.STAGE, "stage__stage_vig_fk", Stage.STAGE.VIGNETTE_ID);
        public static final ForeignKey<UserAvailableVignettesRecord, UsersRecord> USER_AVAILABLE_VIGNETTES__USER_AVAILABLE_VIGNETTES = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.USERS_PK, UserAvailableVignettes.USER_AVAILABLE_VIGNETTES, "user_available_vignettes__user_available_vignettes", UserAvailableVignettes.USER_AVAILABLE_VIGNETTES.USERNAME);
        public static final ForeignKey<UserResultsRecord, UsersRecord> USER_RESULTS__USER_ANSWER_USER_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.USERS_PK, UserResults.USER_RESULTS, "user_results__user_answer_user_fk", UserResults.USER_RESULTS.USERNAME);
        public static final ForeignKey<UserResultsAnswersRecord, UserResultsRecord> USER_RESULTS_ANSWERS__USER_RESULTS_RESULTS_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.USER_RESULTS_PK, UserResultsAnswers.USER_RESULTS_ANSWERS, "user_results_answers__user_results_results_fk", UserResultsAnswers.USER_RESULTS_ANSWERS.USER_RESULTS_ID);
        public static final ForeignKey<UserResultsAnswersRecord, AnswerRecord> USER_RESULTS_ANSWERS__USER_RESULTS_ANSWER_ANSWER_FK = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.QUESTION_ANSWER_PK, UserResultsAnswers.USER_RESULTS_ANSWERS, "user_results_answers__user_results_answer_answer_fk", UserResultsAnswers.USER_RESULTS_ANSWERS.ANSWER_ID);
        public static final ForeignKey<UsersRecord, SpecialtyRecord> USERS__FK_SPEC_USR = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.SPECIALTY_PK, Users.USERS, "users__fk_spec_usr", Users.USERS.SPECIALTY_ID);
        public static final ForeignKey<VignetteSpecialtyRecord, VignetteRecord> VIGNETTE_SPECIALTY__FK_VIG_SPE_VIG = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.VIGNETTE_PK, VignetteSpecialty.VIGNETTE_SPECIALTY, "vignette_specialty__fk_vig_spe_vig", VignetteSpecialty.VIGNETTE_SPECIALTY.VIGNETTE_ID);
        public static final ForeignKey<VignetteSpecialtyRecord, SpecialtyRecord> VIGNETTE_SPECIALTY__FK_VIG_SPE_SPEC = Internal.createForeignKey(com.greenleaf.metis.medical.jooq.generated.Keys.SPECIALTY_PK, VignetteSpecialty.VIGNETTE_SPECIALTY, "vignette_specialty__fk_vig_spe_spec", VignetteSpecialty.VIGNETTE_SPECIALTY.SPECIALTY_ID);
    }
}

package com.greenleaf.services

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._
import org.jooq.Record

import collection.JavaConverters._

case class CandidateAnswer (
                            seq: Int,
                            text: String,
                            isCorrect: Boolean,
                            correctResponse: String,
                            incorrectResponse: String,
                            selectedText: String
                           )
case class Answer (
                  id: Option[Int],
                  data: CandidateAnswer
                  )
case class CandidateQuestion(
                            seq: Int,
                            text: String,
                            multi: Option[Boolean],
                            questionType: Option[String],
                            answers: Seq[Answer]
                            )
case class Question (
                    id: Option[Int],
                    data: CandidateQuestion
                    )
case class Stage (
                 id: Option[Int],
                 data: CandidateStage
                 )
case class CandidateStage (
                          name: String,
                          seq: Int,
                          question: Seq[Question]
                          )

case class Vignette (
                      id: Option[Int],
                      data: CandidateVignette,
                      inProgress: Option[(Int, Int, Int)] = None
                    )
case class CandidateVignette (
                             specialtyId: Int,
                             name: String,
                             stages: Seq[Stage],
                             seq: Int
                             )

object VignetteService {
  lazy val db = ConnectionManager.db

  def create(vignette: Vignette) = {
    val vignetteId = db.insertInto(VIGNETTE, VIGNETTE.NAME, VIGNETTE.SEQ)
        .values(vignette.data.name, vignette.data.seq)
        .returning.fetchOne().getId.toInt
    db.insertInto(VIGNETTE_SPECIALTY, VIGNETTE_SPECIALTY.VIGNETTE_ID, VIGNETTE_SPECIALTY.SPECIALTY_ID)
        .values(vignetteId, vignette.data.specialtyId)
        .execute()
    edit(vignette.copy(id = Some(vignetteId)))
  }

  def edit (vignette: Vignette) = {
    db
      .update(VIGNETTE_SPECIALTY)
      .set(VIGNETTE_SPECIALTY.SPECIALTY_ID, Int.box(vignette.data.specialtyId))
      .where(VIGNETTE_SPECIALTY.VIGNETTE_ID.equal(vignette.id.get))
      .execute()

    db.update(VIGNETTE)
      .set(VIGNETTE.NAME, vignette.data.name)
      .set(VIGNETTE.SEQ, Int.box(vignette.data.seq))
      .where(VIGNETTE.ID.equal(vignette.id.get))
      .execute()

    for (s <- vignette.data.stages) {
      val stageId = s.id match {
        case Some(sId) =>
          db.update(STAGE)
            .set(STAGE.NAME, s.data.name)
            .set(STAGE.SEQ, Int.box(s.data.seq))
            .where(STAGE.ID.equal(sId))
            .execute()
          sId
        case None =>
          db.insertInto(STAGE, STAGE.NAME, STAGE.SEQ, STAGE.VIGNETTE_ID)
            .values(s.data.name, s.data.seq, vignette.id.get)
            .returning.fetchOne().getId.toInt
      }

      for (q <- s.data.question) {
        val questionId = q.id match {
          case Some(qId) =>
            db.update(QUESTION)
              .set(QUESTION.SEQ, Int.box(q.data.seq))
              .set(QUESTION.QUESTION_, q.data.text)
              .set(QUESTION.MULTI, Boolean.box(q.data.multi.getOrElse(false)))
              .set(QUESTION.QUESTION_TYPE, q.data.questionType.getOrElse("regular"))
              .where(QUESTION.ID.equal(q.id.get))
              .execute()
            qId
          case None =>
            db.insertInto(QUESTION, QUESTION.QUESTION_, QUESTION.SEQ, QUESTION.STAGE_ID, QUESTION.MULTI, QUESTION.QUESTION_TYPE)
              .values(q.data.text, Int.box(q.data.seq), stageId, q.data.multi.getOrElse(false), q.data.questionType.getOrElse("regular"))
              .returning.fetchOne.getId.toInt
        }


        for (a <- q.data.answers) {
          a.id match {
            case Some(aId) =>
              db.update(ANSWER)
                .set(ANSWER.CORRECT_TEXT, a.data.correctResponse)
                .set(ANSWER.INCORRECT_TEXT, a.data.incorrectResponse)
                .set(ANSWER.IS_CORRECT, Boolean.box(a.data.isCorrect))
                .set(ANSWER.SELECTED_TEXT, a.data.selectedText)
                .set(ANSWER.SEQ, Int.box(a.data.seq))
                .set(ANSWER.ANSWER_, a.data.text)
                .where(ANSWER.ID.equal(a.id.get))
                .execute()
            case None =>
              db.insertInto(ANSWER, ANSWER.ANSWER_, ANSWER.CORRECT_TEXT, ANSWER.INCORRECT_TEXT, ANSWER.IS_CORRECT, ANSWER.SELECTED_TEXT, ANSWER.SEQ, ANSWER.QUESTION_ID)
                .values(a.data.text, a.data.correctResponse, a.data.incorrectResponse, a.data.isCorrect, a.data.selectedText, a.data.seq, questionId)
                .execute()
          }

        }
      }
    }

    vignette
  }

  def getBaseVignetteQuery = {
    db
      .select()
      .from(VIGNETTE)
      .join(VIGNETTE_SPECIALTY).on(VIGNETTE.ID.equal(VIGNETTE_SPECIALTY.VIGNETTE_ID))
  }

  def extractVignetteFromBaseQuery (r: Record, status: Map[Int, (Int, Int, Int)]) = {
    val vId = r.getValue(VIGNETTE.ID).toInt
    Vignette(
      Some(vId),
      CandidateVignette(
        r.getValue(VIGNETTE_SPECIALTY.SPECIALTY_ID).toInt,
        r.getValue(VIGNETTE.NAME),
        Seq(),
        r.getValue(VIGNETTE.SEQ)
      ),
      status.get(vId)
    )
  }

  def getVignetteById(id: Int, username: String) = {
    val vignetteProgress = UserService.getCurrentVignettePositions(username)
    val vignettes = getBaseVignetteQuery
      .where(VIGNETTE.ID.equal(id))
      .fetch.asScala
      .map(r => extractVignetteFromBaseQuery(r, vignetteProgress))

    expandVignette(vignettes)
  }

  def getVignettesBySpecialty(specialtyId: Int, username: String) = {
    //get user info
    val vignetteProgress = UserService.getCurrentVignettePositions(username)
    //get All vignettes
    val vignettes = getBaseVignetteQuery
      .where(VIGNETTE_SPECIALTY.SPECIALTY_ID.equal(specialtyId))
      .fetch.asScala
      .map(r => extractVignetteFromBaseQuery(r, vignetteProgress))

    expandVignette(vignettes)
  }

  //This is most maintainable way, certainly is not most efficient
  //Shouldnt be a problem but if it is refactor to fold the giant join
  def expandVignette(vignettes: Seq[Vignette]) = {

    //add in stage data
    val withStages = for (v <- vignettes) yield {
      val stages = db
        .selectFrom(STAGE)
        .where(STAGE.VIGNETTE_ID.equal(v.id.get))
        .orderBy(STAGE.SEQ.asc())
        .fetch.asScala
        .map(r => {
          Stage(
            Some(r.getId),
            CandidateStage(
              r.getName,
              r.getSeq,
              Seq()
            )
          )
        })
      v.copy(data = v.data.copy(stages = stages))
    }

    //add in questions
    val withQuestions = for (v <- withStages) yield {
      val stages = for (s <- v.data.stages) yield {
        val questions = db
          .selectFrom(QUESTION)
          .where(QUESTION.STAGE_ID.equal(s.id.get))
          .orderBy(QUESTION.SEQ.asc())
          .fetch.asScala
          .map(r => {
            Question(
              Some(r.getId),
              CandidateQuestion(
                r.getSeq,
                r.getQuestion,
                Some(r.getMulti),
                Some(r.getQuestionType),
                Seq()
              )
            )
          })
        s.copy(data = s.data.copy(question = questions))
      }
      v.copy(data = v.data.copy(stages = stages))
    }

    val withAnswers = for (v <- withQuestions) yield {
      val stages = for (s <- v.data.stages) yield {
        val questions = for (q <- s.data.question) yield {
          val answers = db
            .selectFrom(ANSWER)
            .where(ANSWER.QUESTION_ID.equal(q.id.get))
            .orderBy(ANSWER.SEQ.asc())
            .fetch.asScala
            .map(r => {
              Answer(
                Some(r.getId),
                CandidateAnswer(
                  r.getSeq,
                  r.getAnswer,
                  r.getIsCorrect,
                  r.getCorrectText,
                  r.getIncorrectText,
                  r.getSelectedText
                )
              )
            })
          q.copy(data = q.data.copy(answers = answers))
        }
        s.copy(data = s.data.copy(question = questions))
      }
      v.copy(data = v.data.copy(stages = stages))
    }

    withAnswers

  }
}

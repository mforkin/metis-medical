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
                      data: CandidateVignette
                    )
case class CandidateVignette (
                             specialtyId: Int,
                             name: String,
                             stages: Seq[Stage]
                             )

object VignetteService {
  lazy val db = ConnectionManager.db

  def create(vignette: Vignette) = {
    val vignetteId = db.insertInto(VIGNETTE, VIGNETTE.NAME)
        .values(vignette.data.name)
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
              .where(QUESTION.ID.equal(q.id.get))
              .execute()
            qId
          case None =>
            db.insertInto(QUESTION, QUESTION.QUESTION_, QUESTION.SEQ, QUESTION.STAGE_ID)
              .values(q.data.text, Int.box(q.data.seq), stageId)
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

  def extractVignetteFromBaseQuery (r: Record) = {
    Vignette(
      Some(r.getValue(VIGNETTE.ID).toInt),
      CandidateVignette(
        r.getValue(VIGNETTE_SPECIALTY.SPECIALTY_ID).toInt,
        r.getValue(VIGNETTE.NAME),
        Seq()
      )
    )
  }

  def getVignetteById(id: Int) = {
    val vignettes = getBaseVignetteQuery
      .where(VIGNETTE.ID.equal(id))
      .fetch.asScala
      .map(extractVignetteFromBaseQuery)

    expandVignette(vignettes)
  }

  def getVignettesBySpecialty(specialtyId: Int) = {
    //get All vignettes
    val vignettes = getBaseVignetteQuery
      .where(VIGNETTE_SPECIALTY.SPECIALTY_ID.equal(specialtyId))
      .fetch.asScala
      .map(extractVignetteFromBaseQuery)

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

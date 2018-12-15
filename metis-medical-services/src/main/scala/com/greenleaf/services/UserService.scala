package com.greenleaf.services

import java.time.format.DateTimeFormatter

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._

import collection.JavaConverters._

case class User (userName: String, specialtyId: Int)
case class UserResult (stageId: Int, questionId: Int, datetime: String, answerId: Int, isCorrect: Boolean)
object UserService {
  lazy val db = ConnectionManager.db
  def getInfo = User(
    "admin",
    1
  )

  def getInfoForVignette (vId: Int) = {
    val userName = "admin"
    db.select(
      USER_RESULTS.ANSWER_ID,
      USER_RESULTS.SUBMISSION_DATETIME,
      QUESTION.ID,
      STAGE.ID,
      ANSWER.IS_CORRECT
    )
      .from(USER_RESULTS)
      .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS.ANSWER_ID))
      .join(QUESTION).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
      .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
      .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))
      .where(
        USER_RESULTS.USERNAME.equal(userName).and(
          VIGNETTE.ID.equal(vId)
        )
      )
      .fetch.asScala.map(r => {
      val t = r.getValue(USER_RESULTS.SUBMISSION_DATETIME).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
      UserResult(
        r.getValue(STAGE.ID).toInt,
        r.getValue(QUESTION.ID).toInt,
        t,
        r.getValue(USER_RESULTS.ANSWER_ID).toInt,
        Boolean.unbox(r.getValue(ANSWER.IS_CORRECT))
      )
    })
  }

  // Could probably do a fancier query, but this is going to be fine performance wise and is easier to understand
  def getCurrentVignettePositions (username: String) = {
    db.select()
      .from(USER_RESULTS)
      .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS.ANSWER_ID))
      .join(QUESTION).on(ANSWER.QUESTION_ID.equal(QUESTION.ID))
      .join(STAGE).on(STAGE.ID.equal(QUESTION.STAGE_ID))
      .join(VIGNETTE).on(VIGNETTE.ID.equal(STAGE.VIGNETTE_ID))
      .where(USER_RESULTS.USERNAME.equal(username))
      .orderBy(VIGNETTE.ID, STAGE.SEQ, QUESTION.SEQ, USER_RESULTS.SUBMISSION_DATETIME)
      .fetch.asScala.foldLeft(Map[Int,(Int, Int, Int)]()) {
        case (positionMap, rec) =>
          val vId = rec.getValue(VIGNETTE.ID).toInt
          val recStagePos = rec.getValue(STAGE.SEQ).toInt
          val recQuestionPos = rec.getValue(QUESTION.SEQ).toInt
          val recAnswerPos = rec.getValue(ANSWER.SEQ).toInt
          positionMap.updated(
            vId,
            (
              recStagePos,
              recQuestionPos,
              recAnswerPos
            )
          )
      }
  }
}

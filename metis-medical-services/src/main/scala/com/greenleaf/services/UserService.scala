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
}

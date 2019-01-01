package com.greenleaf.services

import java.time.OffsetDateTime

import com.greenleaf.metis.medical.jooq.generated.Tables._
import com.greenleaf.database.ConnectionManager

case class SurveyAnswer (
                          userName: Option[String], // when you are posting you don't need it
                          datetime: String,
                          answerId: Seq[Int]
                        )
object SurveyService {
  lazy val db = ConnectionManager.db

  def submitAnswer (answer: SurveyAnswer) = {
    val userName = "admin" //answer.userName.getOrElse(throw new Exception("Cannot submit answer if you are not logged in."))
    val userResultId = db.insertInto(
      USER_RESULTS,
      USER_RESULTS.USERNAME,
      USER_RESULTS.SUBMISSION_DATETIME
    ).values(
      userName,
      OffsetDateTime.parse(answer.datetime)
    ).returning.fetchOne().getId

    val baseQ = db.insertInto(
      USER_RESULTS_ANSWERS,
      USER_RESULTS_ANSWERS.USER_RESULTS_ID,
      USER_RESULTS_ANSWERS.ANSWER_ID
    )
    answer.answerId.map(a => baseQ.values(userResultId, a))
    baseQ.execute()
    userResultId
  }
}

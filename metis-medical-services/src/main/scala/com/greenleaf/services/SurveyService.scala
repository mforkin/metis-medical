package com.greenleaf.services

import java.time.OffsetDateTime

import com.greenleaf.metis.medical.jooq.generated.Tables._
import com.greenleaf.database.ConnectionManager

case class SurveyAnswer (
                          userName: Option[String], // when you are posting you don't need it
                          datetime: String,
                          answerId: Int
                        )
object SurveyService {
  lazy val db = ConnectionManager.db

  def submitAnswer (answer: SurveyAnswer) = {
    val userName = "admin" //answer.userName.getOrElse(throw new Exception("Cannot submit answer if you are not logged in."))
    val answerId = db.insertInto(
      USER_RESULTS,
      USER_RESULTS.USERNAME,
      USER_RESULTS.SUBMISSION_DATETIME,
      USER_RESULTS.ANSWER_ID
    ).values(
      userName,
      OffsetDateTime.parse(answer.datetime),
      answer.answerId
    ).returning.fetchOne().getAnswerId
  }
}

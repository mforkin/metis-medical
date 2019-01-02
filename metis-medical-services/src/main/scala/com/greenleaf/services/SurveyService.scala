package com.greenleaf.services

import java.time.OffsetDateTime

import com.greenleaf.metis.medical.jooq.generated.Tables._
import com.greenleaf.database.ConnectionManager

case class AnswerMeta (id: Int, meta: Option[String])
case class SurveyAnswer (
                          userName: Option[String], // when you are posting you don't need it
                          datetime: String,
                          answerMetaInfo: Seq[AnswerMeta]
                        )
object SurveyService {
  lazy val db = ConnectionManager.db

  def submitAnswer (answer: SurveyAnswer) = {
    val userName = UserService.getInfo.userName
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
      USER_RESULTS_ANSWERS.ANSWER_ID,
      USER_RESULTS_ANSWERS.META
    )
    answer.answerMetaInfo.map(a => baseQ.values(userResultId, a.id, a.meta.orNull))
    baseQ.execute()
    userResultId
  }
}

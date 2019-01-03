package com.greenleaf.services

import java.time.format.DateTimeFormatter

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._
import org.scalatra.NotAcceptable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.{User => SUser}
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

import collection.JavaConverters._
import scala.collection.mutable

case class User (userName: String, specialtyId: Int, isAdmin: Option[Boolean])
case class UserResult (stageId: Int, questionId: Int, datetime: String, answerId: Seq[Int], isCorrect: Boolean)
object UserService {
  lazy val db = ConnectionManager.db

  lazy val users: mutable.ListBuffer[User] = mutable.ListBuffer()

  val encoder = new BCryptPasswordEncoder()

  def createUser(user: User, password: String) = {
    if (
      db.selectFrom(USERS).where(USERS.USERNAME.equal(user.userName)).fetch.asScala.isEmpty
    ) {
      db.insertInto(USERS, USERS.ENABLED, USERS.PASSWORD, USERS.SPECIALTY_ID, USERS.USERNAME)
        .values(true, encoder.encode(password), user.specialtyId, user.userName)
        .execute()
      db.insertInto(AUTHORITIES, AUTHORITIES.USERNAME, AUTHORITIES.AUTHORITY)
        .values(user.userName, "ROLE_USER")
        .execute()
    } else {
      throw new Exception("User Exists")
    }
  }

  def getInfo = {
    if (users.isEmpty) {
      users.appendAll(
        db.selectFrom(USERS).fetch.asScala.map(u => User(
          u.getUsername,
          u.getSpecialtyId,
          Some(
            db.selectFrom(AUTHORITIES).where(AUTHORITIES.USERNAME.equal(u.getUsername).and(AUTHORITIES.AUTHORITY.equal("ROLE_ADMIN"))).fetch.asScala.size == 1
          )
        ))
      )
    }
    val sUser = SecurityContextHolder.getContext.getAuthentication.getPrincipal.asInstanceOf[SUser]
    users.find(u => u.userName.equalsIgnoreCase(sUser.getUsername)).get
  }

  def getInfoForVignette (vId: Int) = {
    val userName = getInfo.userName
    db.select(
      USER_RESULTS_ANSWERS.ANSWER_ID,
      USER_RESULTS.SUBMISSION_DATETIME,
      QUESTION.ID,
      STAGE.ID,
      ANSWER.IS_CORRECT
    )
      .from(USER_RESULTS)
      .join(USER_RESULTS_ANSWERS).on(USER_RESULTS.ID.equal(USER_RESULTS_ANSWERS.USER_RESULTS_ID))
      .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS_ANSWERS.ANSWER_ID))
      .join(QUESTION).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
      .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
      .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))
      .where(
        USER_RESULTS.USERNAME.equal(userName).and(
          VIGNETTE.ID.equal(vId)
        )
      )
      .fetch.asScala.foldLeft(Map[(Int, Int, String), UserResult]())((tot, r) => {
      val t = r.getValue(USER_RESULTS.SUBMISSION_DATETIME).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
      val sId = r.getValue(STAGE.ID).toInt
      val qId =  r.getValue(QUESTION.ID).toInt
      tot.updated((sId, qId, t), UserResult(
        sId,
        qId,
        t,
        (tot.get(sId, qId, t) match {
          case Some(ur) => ur.answerId
          case None => Seq[Int]()
        }) ++ Seq(r.getValue(USER_RESULTS_ANSWERS.ANSWER_ID).toInt),
        Boolean.unbox(r.getValue(ANSWER.IS_CORRECT))
      ))
    }).values.toSeq
  }

  // Could probably do a fancier query, but this is going to be fine performance wise and is easier to understand
  def getCurrentVignettePositions (username: String) = {
    db.select()
      .from(USER_RESULTS)
      .join(USER_RESULTS_ANSWERS).on(USER_RESULTS.ID.equal(USER_RESULTS_ANSWERS.USER_RESULTS_ID))
      .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS_ANSWERS.ANSWER_ID))
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

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

case class DataPoint(id: String, x: String, y: Int)

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
      users.clear()
      populateUsersCache()
    } else {
      throw new Exception("User Exists")
    }
  }

  private def populateUsersCache (): Unit = {
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

  def getInfo = {
    if (users.isEmpty) populateUsersCache()
    val sUser = SecurityContextHolder.getContext.getAuthentication.getPrincipal.asInstanceOf[SUser]
    users.find(u => u.userName.equalsIgnoreCase(sUser.getUsername)).get
  }

  def getResults = {
    val user = getInfo

    val answersMap = db.select()
      .from(ANSWER)
      .join(QUESTION).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
      .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
      .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))
      .fetch.asScala.foldLeft(Map[(Int, Int, Int), Seq[Int]]())((tot, r) => {
        val sId = r.getValue(STAGE.ID)
        val qId = r.getValue(QUESTION.ID)
        val vId = r.getValue(VIGNETTE.ID)
        tot.updated(
          (vId, sId, qId),
          tot.getOrElse(
            (vId, sId, qId),
            Seq()
          ) ++ (
            if (r.getValue(ANSWER.IS_CORRECT).booleanValue()) {
              Seq(r.getValue(ANSWER.ID).toInt)
            } else {
              Seq()
            }
          )
        )
      })

    val baseQ = db.select()
      .from(USER_RESULTS_ANSWERS)
      .join(USER_RESULTS).on(USER_RESULTS.ID.equal(USER_RESULTS_ANSWERS.USER_RESULTS_ID))
      .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS_ANSWERS.ANSWER_ID))
      .join(QUESTION).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
      .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
      .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))

    if (!user.isAdmin.getOrElse(false)) {
      baseQ.where(USER_RESULTS.USERNAME.equal(user.userName))
    }

    val answerResults = baseQ.fetch.asScala

    val userToAnswers = answerResults.foldLeft(Map[(String, Int, Int, Int), Seq[Int]]())((tot, r) => {
      val userName = r.getValue(USER_RESULTS.USERNAME)
      val vId = r.getValue(VIGNETTE.ID)
      val sId = r.getValue(STAGE.ID)
      val qId = r.getValue(QUESTION.ID)
      tot.updated(
        (userName, vId, sId, qId),
        tot.getOrElse((userName, vId, sId, qId), Seq[Int]()) ++ Seq(r.getValue(ANSWER.ID).toInt)
      )
    })

    val userToCorrectQuestion = userToAnswers.map {
      case ((userName, vId, sId, qId), userAnswers) => (
        (userName, vId, sId, qId),
        answersMap((vId, sId, qId)).size == userAnswers.size && answersMap((vId, sId, qId)).toSet.diff(userAnswers.toSet).isEmpty
      )
    }

    val questionsRightByVignette = userToCorrectQuestion.foldLeft(Map[(Int, String), Int]()) {
      case (tot, ((u, v, s, q), isCorrect)) =>
        tot.updated(
          (v, u),
          tot.getOrElse(
            (v, u),
            0
          ) + (if (isCorrect) 1 else 0)
        )
    }

    val questionsRightByUser = questionsRightByVignette.foldLeft(Map[(Int, Int), Int]()) {
      case (tot, ((v, u), numberCorrect)) =>
        tot.updated((v, numberCorrect), tot.getOrElse((v, numberCorrect), 0) + 1)
    }

    val vignetteDetails = questionsRightByUser.foldLeft(Map[Int, Seq[DataPoint]]()) {
      case (tot, ((v, questionsCorrect), num)) =>
        tot.updated(v, tot.getOrElse(v, Seq[DataPoint]()) ++ Seq(DataPoint(s"v${v}_q$questionsCorrect", s"$questionsCorrect", num)))
    }

    val vignetteQuestionAnswerCount = userToAnswers.foldLeft(Map[(Int, Int, Int, Int), Int]()) {
      case (tot, ((u, v, s, q), answers)) =>
        answers.foldLeft(tot) {
          case (tot, a) =>
            tot.updated((v, s, q, a), tot.getOrElse((v, s, q, a), 0) + 1)
        }
    }

    val questionDetails = vignetteQuestionAnswerCount.foldLeft(Map[Int, Map[Int, Seq[DataPoint]]]()) {
      case (tot, ((v, s, q, a), numAnswered)) =>
        val vignetteMap = tot.getOrElse(v, Map[Int, Seq[DataPoint]]())
        tot.updated(
          v,
          vignetteMap.updated(
            q,
            vignetteMap.getOrElse(
              q,
              Seq[DataPoint]()
            ) ++ Seq(
              DataPoint(s"${v}_${q}_$a", s"$a", numAnswered)
            )
          )
        )
    }

    Map(
      "questionDetails" -> questionDetails,
      "vignetteDetails" -> vignetteDetails
    )

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

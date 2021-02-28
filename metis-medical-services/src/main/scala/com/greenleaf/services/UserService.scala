package com.greenleaf.services

import java.io.ByteArrayOutputStream
import java.time.format.DateTimeFormatter
import java.util.{Properties, UUID}

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._
import com.typesafe.config.ConfigFactory
import javax.mail.internet.{InternetAddress, MimeMessage}
import org.apache.commons.mail.{DefaultAuthenticator, SimpleEmail}
import org.jooq.impl.DSL.max
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.{User => SUser}
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

import collection.JavaConverters._
import scala.collection.mutable

case class DataPoint(id: String, x: String, y: Int)

case class User (userName: String, specialtyId: Int, isAdmin: Option[Boolean])
case class UserPassword (password: String)
case class OnlyUser (userName: String)
case class UserResult (stageId: Int, questionId: Int, datetime: String, answerId: Seq[Int], isCorrect: Boolean, iteration: Int)
object UserService {
  val emailConfig = ConfigFactory.load().getConfig("email")
  val emailUser = emailConfig.getString("userName")
  val emailPassword = emailConfig.getString("password")

  lazy val db = ConnectionManager.db

  lazy val users: mutable.ListBuffer[User] = mutable.ListBuffer()

  val encoder = new BCryptPasswordEncoder()

  def generateResetRequest (userName: String, baseUrl: String): Unit = {
    val hash = UUID.randomUUID().toString
    db.insertInto(RESET_HASHES, RESET_HASHES.USERNAME, RESET_HASHES.HASH)
      .values(userName, hash)
      .execute()

    sendResetMessage(hash, userName, baseUrl)
  }

  def sendResetMessage(hash: String, userName: String, baseUrl: String): Unit = {
    val from = "Metis Medical"
    val to = userName
    val subject = "Password Reset Link"
    val content = s"$userName,\n\nFollow this link to reset your password:\n" +
    s"$baseUrl$hash" +
    "\n\n Thank You,\n\nMetis Medical Support Team"

    val email = new SimpleEmail()
    email.setHostName("smtp.googlemail.com")
    email.setSmtpPort(465)
    email.setAuthenticator(new DefaultAuthenticator(emailUser, emailPassword))
    email.setSSLOnConnect(true)
    email.setFrom(from)
    email.setSubject(subject)
    email.setMsg(content)
    email.addTo(to)
    email.send()
  }

  def updateUser(password: String, resetHash: String): Int = {
    db.selectFrom(RESET_HASHES).where(RESET_HASHES.HASH.equal(resetHash)).fetch.asScala.headOption match {
      case Some(resetOption) =>
        db.update(USERS).set(USERS.PASSWORD, encoder.encode(password)).where(USERS.USERNAME.equal(resetOption.getUsername)).execute
        db.deleteFrom(RESET_HASHES)
          .where(RESET_HASHES.USERNAME.equal(resetOption.getUsername)).and(RESET_HASHES.HASH.equal(resetHash))
          .execute()
      case None =>
        throw new Exception("Invalid Hash")
    }
  }

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

  case class AllResultAnswers (
                                specialtyId: Int, vignetteId: Int, stageId: Int, questionId: Int, questionSeq: Int, iterationId: Int,
                                usersCorrect: Int, totalUsers: Int
                              )
  case class UserResultAnswers (
                             specialtyId: Int, vignetteId: Int, stageId: Int, questionId: Int, questionSeq: Int, iterationId: Int, userId: String,
                             isCorrect: Boolean, answersCorrect: Int, isMulti: Boolean, answers: Seq[Int], answerMeta: Seq[String]
                           )

  def getBaseResultQuery () = {
    db.select(
      VIGNETTE_SPECIALTY.SPECIALTY_ID,
      STAGE.VIGNETTE_ID,
      STAGE.ID,
      QUESTION.ID,
      QUESTION.SEQ,
      USER_RESULTS.ITERATION,
      ANSWER.ID,
      ANSWER.IS_CORRECT,
      USER_RESULTS.USERNAME,
      QUESTION.MULTI,
      USER_RESULTS_ANSWERS.META
    ).from(USER_RESULTS)
      .join(USER_RESULTS_ANSWERS).on(USER_RESULTS.ID.equal(USER_RESULTS_ANSWERS.USER_RESULTS_ID))
      .join(ANSWER).on(USER_RESULTS_ANSWERS.ANSWER_ID.equal(ANSWER.ID))
      .join(QUESTION).on(ANSWER.QUESTION_ID.equal(QUESTION.ID))
      .join(STAGE).on(STAGE.ID.equal(QUESTION.STAGE_ID))
      .join(VIGNETTE_SPECIALTY).on(VIGNETTE_SPECIALTY.VIGNETTE_ID.equal(STAGE.VIGNETTE_ID))
  }

  def getAllAnswers () = {
    val baseResults = getBaseResultQuery()
      .fetch.asScala
      .foldLeft(Map[(Int, Int, Int, Int, String), UserResultAnswers]())((tot, r) => {
        val (vId, sId, qId, iId, u, aId, meta) = (
          r.getValue(STAGE.VIGNETTE_ID).toInt,
          r.getValue(STAGE.ID).toInt,
          r.getValue(QUESTION.ID).toInt,
          r.getValue(USER_RESULTS.ITERATION).toInt,
          r.getValue(USER_RESULTS.USERNAME),
          r.getValue(ANSWER.ID).toInt,
          r.getValue(USER_RESULTS_ANSWERS.META)
        )
        val specialtyId = r.getValue(VIGNETTE_SPECIALTY.SPECIALTY_ID).toInt
        val qSeq = r.getValue(QUESTION.SEQ).toInt
        val isCorrect = Boolean.unbox(r.getValue(ANSWER.IS_CORRECT))
        val isMulti = Boolean.unbox(r.getValue(QUESTION.MULTI))
        tot.get((vId, sId, qId, iId, u)) match {
          case Some(res) =>
            tot.updated((vId, sId, qId, iId, u), UserResultAnswers(
              specialtyId, vId, sId, qId, qSeq, iId, u, isCorrect && res.isCorrect, res.answersCorrect + 1, isMulti, res.answers ++ Seq(aId), res.answerMeta ++ Seq(meta)
            ))
          case None =>
            tot.updated((vId, sId, qId, iId, u), UserResultAnswers(
              specialtyId, vId, sId, qId, qSeq, iId, u, isCorrect, 1, isMulti, Seq(aId), Seq(meta)
            ))
        }
      }).values

    val numCorrectAnswers = mutable.Map[(Int, Int, Int), Int]()
    baseResults.map(r => {
      if (r.isMulti) {
        numCorrectAnswers.get(r.vignetteId, r.stageId, r.questionId) match {
          case Some(l) =>
            if (r.answersCorrect == l) {
              r
            } else {
              r.copy(isCorrect = false)
            }
          case None =>
            val correctQIds = db.select(
              ANSWER.ID
            ).from(QUESTION)
              .join(ANSWER).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
              .join(STAGE).on(STAGE.ID.equal(QUESTION.STAGE_ID))
              .where(ANSWER.IS_CORRECT)
              .and(QUESTION.ID.equal(r.questionId))
              .and(STAGE.ID.equal(r.stageId))
              .fetch().size
            numCorrectAnswers.put((r.vignetteId, r.stageId, r.questionId), correctQIds)
            if (r.answersCorrect == correctQIds) {
              r
            } else {
              r.copy(isCorrect = false)
            }
        }
      } else {
        r
      }
    })
  }

  def getLatestCompletedResult (vId: Int) = {
    val mostRecent = getInfoForVignette(vId)
    val secondMostRecent = getInfoForVignette(vId, 1)

    if (mostRecent.size < secondMostRecent.size) secondMostRecent else mostRecent
  }

  def getInfoForVignette (vId: Int, offset: Int = 0) = {
    val userName = getInfo.userName
    val info = db.select(
      USER_RESULTS_ANSWERS.ANSWER_ID,
      USER_RESULTS.SUBMISSION_DATETIME,
      QUESTION.ID,
      STAGE.ID,
      ANSWER.IS_CORRECT,
      USER_RESULTS.ITERATION
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
      .and(USER_RESULTS.ITERATION.in(
        db.select(max(USER_RESULTS.ITERATION).sub(offset))
          .from(USER_RESULTS)
          .join(USER_RESULTS_ANSWERS).on(USER_RESULTS.ID.equal(USER_RESULTS_ANSWERS.USER_RESULTS_ID))
          .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS_ANSWERS.ANSWER_ID))
          .join(QUESTION).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
          .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
          .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))
          .where(VIGNETTE.ID.equal(vId))
          .and(USER_RESULTS.USERNAME.equal(userName))
      ))
      .fetch.asScala.foldLeft(Map[(Int, Int, String), (UserResult, Int)]())((tot, r) => {
      val t = r.getValue(USER_RESULTS.SUBMISSION_DATETIME).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
      val sId = r.getValue(STAGE.ID).toInt
      val qId =  r.getValue(QUESTION.ID).toInt
      tot.updated((sId, qId, t), (UserResult(
        sId,
        qId,
        t,
        (tot.get(sId, qId, t) match {
          case Some((ur, _)) => ur.answerId
          case None => Seq[Int]()
        }) ++ Seq(r.getValue(USER_RESULTS_ANSWERS.ANSWER_ID).toInt),
        (tot.get(sId, qId, t) match {
          case Some((ur, _)) => ur.isCorrect
          case None => true
        }) && Boolean.unbox(r.getValue(ANSWER.IS_CORRECT)),
        r.getValue(USER_RESULTS.ITERATION).toInt
      ), tot.get(sId, qId, t) match {
        case Some((ur, cnt)) => if (ur.isCorrect) cnt + 1 else cnt
        case None => if (Boolean.unbox(r.getValue(ANSWER.IS_CORRECT))) 1 else 0
      }))
    })

    info.foldLeft(Seq[UserResult]()) {
      case (tot, ((sId, qId, _), (ur, cnt))) => {
        val correctQIds = db.select(
          ANSWER.ID
        ).from(QUESTION)
          .join(ANSWER).on(QUESTION.ID.equal(ANSWER.QUESTION_ID))
          .join(STAGE).on(STAGE.ID.equal(QUESTION.STAGE_ID))
          .where(ANSWER.IS_CORRECT)
          .and(QUESTION.ID.equal(qId))
          .and(STAGE.ID.equal(sId))
          .fetch()
        tot :+ ur.copy(isCorrect = ur.answerId.size == correctQIds.size && ur.isCorrect)
      }
    }
  }

  // Could probably do a fancier query, but this is going to be fine performance wise and is easier to understand
  def getCurrentVignettePositions (username: String) = {
    val rawData = db.select()
      .from(USER_RESULTS)
      .join(USER_RESULTS_ANSWERS).on(USER_RESULTS.ID.equal(USER_RESULTS_ANSWERS.USER_RESULTS_ID))
      .join(ANSWER).on(ANSWER.ID.equal(USER_RESULTS_ANSWERS.ANSWER_ID))
      .join(QUESTION).on(ANSWER.QUESTION_ID.equal(QUESTION.ID))
      .join(STAGE).on(STAGE.ID.equal(QUESTION.STAGE_ID))
      .join(VIGNETTE).on(VIGNETTE.ID.equal(STAGE.VIGNETTE_ID))
      .where(USER_RESULTS.USERNAME.equal(username))
      .orderBy(VIGNETTE.ID, STAGE.SEQ, QUESTION.SEQ, USER_RESULTS.SUBMISSION_DATETIME)
      .fetch.asScala

    val vignetteToMaxIterationMaxQuestion: Map[Int, (Int, Int, Int)] = rawData.foldLeft(Map[Int, (Int, Int, Int)]()) {
      case (tot, rec) =>
        val vId = rec.getValue(VIGNETTE.ID).toInt
        val recStagePos = rec.getValue(STAGE.SEQ).toInt
        val recQuestionPos = rec.getValue(QUESTION.SEQ).toInt
        val recAnswerPos = rec.getValue(ANSWER.SEQ).toInt
        val iteration = rec.getValue(USER_RESULTS.ITERATION).toInt
        tot.get(vId) match {
          case Some((sPos, qPos, iter)) =>
            if (iteration > iter) {
              tot.updated(vId, (recStagePos, recQuestionPos, iteration))
            } else if (iteration == iter) {
              if (recStagePos > sPos) {
                tot.updated(vId, (recStagePos, recQuestionPos, iteration))
              } else if (recStagePos == sPos) {
                if (recQuestionPos > qPos) {
                  tot.updated(vId, (recStagePos, recQuestionPos, iteration))
                } else {
                  tot
                }
              } else {
                tot
              }
            } else {
              tot
            }
          case None => tot.updated(vId, (recStagePos, recQuestionPos, iteration))
        }
    }

    vignetteToMaxIterationMaxQuestion
  }
}

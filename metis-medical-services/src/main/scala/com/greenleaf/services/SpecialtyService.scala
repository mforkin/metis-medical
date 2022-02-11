package com.greenleaf.services

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._
import com.typesafe.config.ConfigFactory

import collection.JavaConverters._

case class Specialty (id: Int, name: String)
case class CandidateSpecialty (name: String)
case class SpecialtyAgg (numCorrect: Double, numQuestions: Double, numRespondents: Int)

object SpecialtyService {
  lazy val db = ConnectionManager.db
  val conf = ConfigFactory.load()
  val phase = conf.getInt("phase")

  def getSpecialities = {
    val specialties = db.selectFrom(SPECIALTY)
      .fetch
      .asScala
      .map(r => (r.getId, r.getName)).toMap
    if (phase == 2) {
      specialties.filter {
        case (_, v) => !v.equalsIgnoreCase("pre-quiz")
      }
    } else if (phase == 1) {
      specialties.filter {
        case (_, v) => !v.equalsIgnoreCase("post-quiz")
      }    }  else {
      specialties
    }
  }

  def getSpecialty (id: Int) = {
    val speciality = db.selectFrom(SPECIALTY)
      .where(SPECIALTY.ID.equal(id))
      .fetchOne
    Specialty(speciality.getId, speciality.getName)
  }

  def create (specialty: CandidateSpecialty): Unit = {
    db.insertInto(SPECIALTY, SPECIALTY.NAME)
      .values(specialty.name)
      .execute()
  }

  def edit (specialty: Specialty) = {
    db.update(SPECIALTY)
      .set(SPECIALTY.NAME, specialty.name)
      .where(SPECIALTY.ID.equal(specialty.id))
      .execute()
  }

  def getResults = {
    val res = UserService.getAllAnswers().groupBy(r => (r.specialtyId, r.userId, r.vignetteId))

    val specs = getSpecialities

    val vigs = VignetteService.getAllVignettes.toMap

    val mostRecent: Map[(Int, String, Int), Iterable[UserService.UserResultAnswers]] = res.map {
      case (key, results) =>
        val maxIteration = results.foldLeft(0) {
          case (t, r) => math.max(t, r.iterationId)
        }
        val numQ = db.select(QUESTION.ID).from(QUESTION)
          .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
          .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))
          .where(VIGNETTE.ID.equal(Int.box(key._3)))
          .fetch().asScala.size
        val enough = results.count(_.iterationId == maxIteration) == numQ
        val trueIteration = if (enough) maxIteration else maxIteration - 1
        (key, if (trueIteration < 0) Seq() else results.filter(_.iterationId == trueIteration))
    }

    val mrScores = mostRecent.foldLeft(Map[(Int, Int), (Double, Double, Int)]()) {
      case (tot, ((specId, user, vId), recs)) =>
        tot.get((specId, vId)) match {
          case Some((score, questions, n)) =>
            tot.updated((specId, vId), (recs.count(_.isCorrect) + score, questions + recs.size,  n + 1))
          case None =>
            tot.updated((specId, vId), (recs.count(_.isCorrect), recs.size, 1))
        }
    }

    val totScores = mostRecent.foldLeft(Map[Int, SpecialtyAgg]()) {
      case (tot, ((specId, user, vId), recs)) =>
        tot.get(specId) match {
          case Some(agg) =>
            tot.updated(specId, SpecialtyAgg(recs.count(_.isCorrect) + agg.numCorrect, agg.numQuestions + recs.size, agg.numRespondents + 1))
          case None =>
            tot.updated(specId, SpecialtyAgg(recs.count(_.isCorrect), recs.size, 1))
        }
    }

    val best: Map[(Int, String, Int), Iterable[UserService.UserResultAnswers]] = res.map {
      case (key, results) =>
        val iterations = results.groupBy(_.iterationId)
        val (bestIteration, _) = iterations.foldLeft((-1, 0.0)) {
          case ((bestId, bestScore), (id, r)) =>
            val numQ = db.select(QUESTION.ID).from(QUESTION)
              .join(STAGE).on(QUESTION.STAGE_ID.equal(STAGE.ID))
              .join(VIGNETTE).on(STAGE.VIGNETTE_ID.equal(VIGNETTE.ID))
              .where(VIGNETTE.ID.equal(Int.box(key._3)))
              .fetch().asScala.size
            val enough = r.size == numQ
            val p = r.count(_.isCorrect).toDouble / r.size
            if (p > bestScore && enough) {
              (id, p)
            } else {
              (bestId, bestScore)
            }
        }
        (key, results.filter(_.iterationId == bestIteration))
    }

    val bestScores = best.foldLeft(Map[(Int, Int), (Double, Double, Int)]()) {
      case (tot, ((specId, user, vId), recs)) =>
        tot.get((specId, vId)) match {
          case Some((score, questions, n)) =>
            tot.updated((specId, vId), (recs.count(_.isCorrect) + score, questions + recs.size, n + 1))
          case None =>
            tot.updated((specId, vId), (recs.count(_.isCorrect), recs.size, 1))
        }
    }

    val bestTotScores = best.foldLeft(Map[Int, SpecialtyAgg]()) {
      case (tot, ((specId, user, vId), recs)) =>
        tot.get(specId) match {
          case Some(agg) =>
            tot.updated(specId, SpecialtyAgg(recs.count(_.isCorrect) + agg.numCorrect, agg.numQuestions + recs.size, agg.numRespondents + 1))
          case None =>
            tot.updated(specId, SpecialtyAgg(recs.count(_.isCorrect), recs.size, 1))
        }
    }

    Map(
      "bestByVignette" -> bestScores.foldLeft(Map[String, Map[String, SpecialtyAgg]]()) {
        case (tot, ((specId, vId), (score, questions, n))) =>
          val specName = specs(specId)
          val vname = vigs(vId).name
          tot.get(specName) match {
            case Some(vMap) =>
              tot.updated(specName, vMap ++ Map(vname -> SpecialtyAgg(score, questions, n)))
            case None =>
              tot.updated(specName, Map(vname -> SpecialtyAgg(score, questions, n)))
          }
      },
      "recentByVignette" -> mrScores.foldLeft(Map[String, Map[String, SpecialtyAgg]]()) {
        case (tot, ((specId, vId), (score, questions, n))) =>
          val specName = specs(specId)
          val vname = vigs(vId).name
          tot.get(specName) match {
            case Some(vMap) =>
              tot.updated(specName, vMap ++ Map(vname -> SpecialtyAgg(score, questions, n)))
            case None =>
              tot.updated(specName, Map(vname -> SpecialtyAgg(score, questions, n)))
          }
      },
      "bestTot" -> bestTotScores,
      "recentTot" -> totScores
    )
  }
}

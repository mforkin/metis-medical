package com.greenleaf.services

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._
import collection.JavaConverters._

case class Specialty (id: Int, name: String)
case class CandidateSpecialty (name: String)

object SpecialtyService {
  lazy val db = ConnectionManager.db

  def getSpecialities = {
    db.selectFrom(SPECIALTY)
      .fetch
      .asScala
      .map(r => (r.getId, r.getName)).toMap
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
}

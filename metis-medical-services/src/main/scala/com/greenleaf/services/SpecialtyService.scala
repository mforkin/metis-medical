package com.greenleaf.services

import com.greenleaf.database.ConnectionManager
import com.greenleaf.metis.medical.jooq.generated.Tables._
import collection.JavaConverters._

object SpecialtyService {
  val db = ConnectionManager.db

  def getSpecialities = {
    db.selectFrom(SPECIALTY).fetch.asScala.map(r => (r.getId, r.getName)).toMap
  }
}

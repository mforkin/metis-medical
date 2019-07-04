package com.greenleaf.services.api

import com.greenleaf.services.{CandidateSpecialty, Specialty, SpecialtyService}
import org.scalatra.Ok

class SpecialityAPI extends API {
  override val root = "api/specialty"

  get("/") {
    Ok(SpecialtyService.getSpecialities)
  }

  post("/") {
    val data = readJsonFromBody(request.body).extract[CandidateSpecialty]
    Ok(SpecialtyService.create(data))
  }

  put("/:id") {
    val data = readJsonFromBody(request.body).extract[Specialty]
    Ok(SpecialtyService.edit(data))
  }

  get("/:id") {
    Ok(SpecialtyService.getSpecialty(params.as[Int]("id")))
  }

  get("/results") {
    Ok(SpecialtyService.getResults)
  }
}

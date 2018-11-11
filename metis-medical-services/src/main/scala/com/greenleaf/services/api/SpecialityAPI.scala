package com.greenleaf.services.api

import com.greenleaf.services.{CandidateSpecialty, Specialty, SpecialtyService}

class SpecialityAPI extends API {
  override val root = "api/specialty"

  get("/") {
    SpecialtyService.getSpecialities
  }

  post("/") {
    val data = parsedBody.extract[CandidateSpecialty]
    SpecialtyService.create(data)
  }

  put("/:id") {
    val data = parsedBody.extract[Specialty]
    SpecialtyService.edit(data)
  }

  get("/:id") {
    SpecialtyService.getSpecialty(params.as[Int]("id"))
  }
}

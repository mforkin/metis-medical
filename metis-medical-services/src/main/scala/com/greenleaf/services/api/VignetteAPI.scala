package com.greenleaf.services.api

import com.greenleaf.services.{Vignette, VignetteService}

class VignetteAPI extends API {
  override val root = "api/vignette"

  get ("/specialty/:specialtyId") {
    VignetteService.getVignettesBySpecialty(params.as[Int]("specialtyId"))
  }

  post ("/") {
    VignetteService.create(
      readJsonFromBody(request.body).extract[Vignette]
    )
  }

  put ("/") {
    VignetteService.edit(
      readJsonFromBody(request.body).extract[Vignette]
    )
  }

  get ("/:id") {
    VignetteService.getVignetteById(params.as[Int]("id"))
  }
}

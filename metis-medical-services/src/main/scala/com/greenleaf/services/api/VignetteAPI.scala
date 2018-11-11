package com.greenleaf.services.api

import com.greenleaf.services.{Vignette, VignetteService}

class VignetteAPI extends API {
  override val root = "api/vignette"

  get ("/specialty/:specialtyId") {
    VignetteService.getVignettesBySpecialty(params.as[Int]("specialtyId"))
  }

  post ("/") {
    VignetteService.create(
      parsedBody.extract[Vignette]
    )
  }

  put ("/") {
    VignetteService.edit(
      parsedBody.extract[Vignette]
    )
  }

  get ("/:id") {
    VignetteService.getVignetteById(params.as[Int]("id"))
  }
}

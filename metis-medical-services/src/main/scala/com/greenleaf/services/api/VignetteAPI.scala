package com.greenleaf.services.api

import com.greenleaf.services.{Vignette, VignetteService}
import org.scalatra.Ok

class VignetteAPI extends API {
  override val root = "api/vignette"

  get ("/specialty/:specialtyId") {
    Ok(VignetteService.getVignettesBySpecialty(params.as[Int]("specialtyId")))
  }

  post ("/") {
    Ok(VignetteService.create(
      readJsonFromBody(request.body).extract[Vignette]
    ))
  }

  put ("/") {
    Ok(VignetteService.edit(
      readJsonFromBody(request.body).extract[Vignette]
    ))
  }

  get ("/:id") {
    Ok(VignetteService.getVignetteById(params.as[Int]("id")))
  }
}

package com.greenleaf.services.api

import com.greenleaf.services.{UserService, Vignette, VignetteService}
import org.scalatra.Ok

class VignetteAPI extends API {
  override val root = "api/vignette"

  get ("/specialty/:specialtyId") {
    val username = UserService.getInfo.userName
    Ok(VignetteService.getVignettesBySpecialty(params.as[Int]("specialtyId"), username))
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
    val username = UserService.getInfo.userName
    Ok(VignetteService.getVignetteById(params.as[Int]("id"), username))
  }
}

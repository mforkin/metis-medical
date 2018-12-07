package com.greenleaf.services.api

import com.greenleaf.services.UserService
import org.scalatra.Ok

class UserAPI extends API {
  override val root = "api/user"
  get("/") {
    Ok(UserService.getInfo)
  }

  get("/:vignetteId") {
    Ok(UserService.getInfoForVignette(params.as[Int]("vignetteId")))
  }
}

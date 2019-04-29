package com.greenleaf.services.api

import com.greenleaf.services.{User, UserService}
import org.scalatra.Ok

class UserAPI extends API {
  override val root = "api/user"
  get("/") {
    Ok(UserService.getInfo)
  }

  get("/:vignetteId") {
    Ok(UserService.getInfoForVignette(params.as[Int]("vignetteId")))
  }

  post("/") {
    val b = readJsonFromBody(request.body)
    UserService.createUser(b.extract[User], "admin")
  }

  get("/results") {
    Ok(UserService.getResults)
  }

  get("/latestCompleted/:vignetteId") {
    Ok(UserService.getLatestCompletedResult(params.as[Int]("vignetteId")))
  }
}

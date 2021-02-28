package com.greenleaf.services.api

import java.util.UUID

import com.greenleaf.services.{OnlyUser, User, UserPassword, UserService}
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
    val password = b.extract[UserPassword].password
    UserService.createUser(b.extract[User], password)
  }

  post("/reset/") {
    val b = readJsonFromBody(request.body)
    val userName = b.extract[OnlyUser].userName
    UserService.generateResetRequest(userName, base + root + "/reset/")
  }

  put("/reset/:resetHash") {
    val b = readJsonFromBody(request.body)
    val password = b.extract[UserPassword].password
    UserService.updateUser(password, params.as[String]("resetHash"))
  }

  get("/results") {
    Ok(UserService.getResults)
  }

  get("/results/raw") {
    Ok(UserService.getAllAnswers())
  }

  get("/latestCompleted/:vignetteId") {
    Ok(UserService.getLatestCompletedResult(params.as[Int]("vignetteId")))
  }
}

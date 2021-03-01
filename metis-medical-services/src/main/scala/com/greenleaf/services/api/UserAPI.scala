package com.greenleaf.services.api

import java.util.UUID

import com.greenleaf.services.{OnlyUser, User, UserPassword, UserService}
import org.scalatra.{BadRequest, Ok}

import scala.util.{Failure, Success, Try}

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
    Try(UserService.createUser(b.extract[User], password)) match {
      case Success(response) => Ok(response)
      case Failure(ex) =>
        BadRequest(Map("error" -> ex.getMessage))
    }
  }

  post("/reset") {
    val b = readJsonFromBody(request.body)
    val userName = b.extract[OnlyUser].userName
    Try(UserService.generateResetRequest(userName, base + "reset.html?hash=")) match {
      case Success(_) => Ok("Password Reset Email Sent Successfully.")
      case Failure(ex) =>
        BadRequest(Map("error" -> ex.getMessage))
    }
  }

  put("/reset/:resetHash") {
    val b = readJsonFromBody(request.body)
    val password = b.extract[UserPassword].password
    Try(UserService.updateUser(password, params.as[String]("resetHash"))) match {
      case Success(_) => Ok("Password Reset Successful")
      case Failure(ex) =>
        BadRequest(Map("error" -> ex.getMessage))
    }
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

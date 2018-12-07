package com.greenleaf.services.api

import com.greenleaf.services.{SurveyAnswer, SurveyService}
import org.scalatra.Ok

class SurveyAPI extends API {
  override val root = "api/survey"

  post("/answer") {
    val data = readJsonFromBody(request.body).extract[SurveyAnswer]
    Ok(SurveyService.submitAnswer(data))
  }
}

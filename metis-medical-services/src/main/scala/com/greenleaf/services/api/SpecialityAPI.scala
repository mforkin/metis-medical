package com.greenleaf.services.api

import com.greenleaf.services.SpecialtyService

class SpecialityAPI extends API {
  override val root = "specialty"

  get("/") {
    SpecialtyService.getSpecialities
  }
}

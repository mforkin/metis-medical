package com.greenleaf.services

import org.json4s.DefaultFormats
import org.scalatra.json.JacksonJsonSupport

trait JsonSerialization extends JacksonJsonSupport {
  before () {
    contentType = formats("json")
  }

  protected implicit lazy val jsonFormats = DefaultFormats
}

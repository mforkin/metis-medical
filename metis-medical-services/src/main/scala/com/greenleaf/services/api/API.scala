package com.greenleaf.services.api

import com.greenleaf.services.JsonSerialization
import org.scalatra.ScalatraServlet

trait API extends ScalatraServlet with JsonSerialization {
  val root: String
  lazy val base = s"https://$serverHost:$serverPort/"

  before() {
    response.setHeader("X-Content-Type-Options", "nosniff")
    response.setHeader("X-UA-Compatible", "IE=edge")
    response.setHeader("X-Frame-Options", "SAMEORIGIN")
    response.setHeader("X-XSS-Protection", "1; mode=block")
    response.setHeader("X-Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src https: 'self' 'unsafe-eval' cdn.polyfill.io; img-src 'self'")
    response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src https: 'self' 'unsafe-eval' cdn.polyfill.io; img-src 'self'")
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

}

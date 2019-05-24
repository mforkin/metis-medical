package com.greenleaf.servlet

import org.scalatra.ScalatraServlet
import org.scalatra.scalate.ScalateSupport

class DefaultServlet extends ScalatraServlet with ScalateSupport {
  val root = ""
  //sys.props(EnvironmentKey) = "production"

  get("/") {
    contentType = "text/html; charset=UTF-8"
//    response.setHeader("X-Content-Type-Options", "nosniff")
//    response.setHeader("X-UA-Compatible", "IE=edge")
//    response.setHeader("X-Frame-Options", "SAMEORIGIN")
//    response.setHeader("X-XSS-Protection", "1; mode=block")
//    response.setHeader("X-Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src https: 'self' 'unsafe-eval' cdn.polyfill.io; img-src 'self'")
//    response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src https: 'self' 'unsafe-eval' cdn.polyfill.io; img-src 'self'")
//    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
    ssp(
      "index",
      "username" -> "Test Username"
    )

  }

  get("/results") {
    redirect("/")
  }

//  notFound {
//    serveStaticResource().getOrElse {
//      response.setStatus(404)
//      <h1> 404 Not Found</h1>
//    }
//  }

  def onStartUp: Unit = {
    System.out.print("----- Starting up -----")
  }
  
}

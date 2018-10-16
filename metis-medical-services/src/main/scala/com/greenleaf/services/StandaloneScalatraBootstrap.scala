package com.greenleaf.services

import java.util.ServiceLoader
import collection.JavaConverters._

import javax.servlet.ServletContext
import org.scalatra.{LifeCycle, ScalatraServlet}
import org.scalatra.servlet.RichServletContext

class StandaloneScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext): Unit = {
    val richCtx = RichServletContext(context)
    val servlets = ServiceLoader.load(classOf[ScalatraServlet]).asScala
    for (servlet <- servlets) {
      richCtx.mount(servlet, "/")
    }
  }
}

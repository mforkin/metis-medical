import java.util.ServiceLoader

import com.greenleaf.database.ConnectionManager
import com.greenleaf.services.api.API
import com.greenleaf.servlet.DefaultServlet
import com.typesafe.config.ConfigFactory
import javax.servlet.ServletContext
import org.scalatra.servlet.RichServletContext
import org.springframework.context.{ApplicationContext, ApplicationContextAware}
import org.springframework.web.context.ServletContextAware

import scala.beans.BeanProperty
import collection.JavaConverters._

class ScalatraBootstrap extends ApplicationContextAware with ServletContextAware {
  val conf = ConfigFactory.load()
  ConnectionManager.buildJndiDBPool(conf.getConfig("db"))

  @BeanProperty var applicationContext: ApplicationContext = _
  @BeanProperty var servletContext: ServletContext  = _
  @BeanProperty var rootPath: String = _

  def init(): Unit = {
    val richCtx = RichServletContext(servletContext)
    val servlets = ServiceLoader.load(classOf[API]).asScala
    rootPath = Option(rootPath).getOrElse("")
    for (servlet <- servlets) {
      richCtx.mount(servlet, s"$rootPath/${servlet.root}")
    }

    val springServlets = applicationContext.getBeansOfType(classOf[DefaultServlet]).asScala
    for ((_, servlet) <- springServlets) {
      richCtx.mount(servlet, s"$rootPath/${servlet.root}")
    }
  }
}

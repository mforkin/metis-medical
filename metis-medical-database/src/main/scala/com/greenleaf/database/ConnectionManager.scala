package com.greenleaf.database

import com.typesafe.config.Config
import com.zaxxer.hikari.{HikariConfig, HikariDataSource}
import javax.naming.InitialContext
import javax.sql.DataSource
import org.jooq.conf.Settings
import org.jooq.{DSLContext, SQLDialect}
import org.jooq.impl.DSL

object ConnectionManager {
  var db: DSLContext = _
  val settings = new Settings()
      .withRenderFormatted(true)
      .withReflectionCaching(false)

  def buildDBPool(dbConfig: Config) = {
    val config = new HikariConfig()
    config.setJdbcUrl(dbConfig.getString("jdbcUrl"))
    config.setUsername(dbConfig.getString("username"))
    config.setPassword(dbConfig.getString("password"))
    config.setMaximumPoolSize(dbConfig.getInt("maximumPoolSize"))

    val ds = new HikariDataSource(config)
    DSL.using(ds, SQLDialect.POSTGRES, settings)
  }

  def getJndiDBPool(dbConfig: Config) = {
    val jndiLookup = dbConfig.getString("jndiLookupName")
    val ic = new InitialContext()
    val ds = ic.lookup(jndiLookup).asInstanceOf[DataSource]

    DSL.using(ds, SQLDialect.POSTGRES, settings)
  }
}

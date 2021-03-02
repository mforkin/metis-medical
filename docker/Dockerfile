FROM jetty:9.4-jre8

RUN java -jar "$JETTY_HOME/start.jar" --add-to-start=https,ssl,logging-slf4j,slf4j-simple-impl --approve-all-licenses

COPY var/lib/jetty/etc/keystore /var/lib/jetty/etc/keystore
COPY var/lib/jetty/etc/truststore /var/lib/jetty/etc/truststore

COPY var/lib/jetty/webapps/metis-medical.war /var/lib/jetty/webapps/metis-medical.war
COPY tmp/jetty/application.conf /tmp/jetty/application.conf

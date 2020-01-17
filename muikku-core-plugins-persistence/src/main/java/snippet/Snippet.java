package snippet;

public class Snippet {
	14:50:48,486 ERROR [org.jboss.as.controller.management-operation] (Controller Boot Thread) WFLYCTL0013: Operation ("deploy") failed - address: ([("deployment" => "muikku-1.1.124-SNAPSHOT.war")]) - failure description: {
	    "WFLYCTL0080: Failed services" => {"jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".INSTALL" => "org.jboss.msc.service.StartException in service jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".INSTALL: WFLYSRV0153: Failed to process phase INSTALL of deployment \"muikku-1.1.124-SNAPSHOT.war\"
	    Caused by: org.jboss.msc.service.DuplicateServiceException: Service jboss.undertow.deployment.default-server.muikku./.session is already registered"},
	    "WFLYCTL0412: Required services that are not installed:" => [
	        "jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".beanmanager",
	        "jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".INSTALL"
	    ],
	    "WFLYCTL0180: Services with missing/unavailable dependencies" => [
	        "jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".batch.environment is missing [jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".beanmanager]",
	        "jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".weld.weldClassIntrospector is missing [jboss.deployment.unit.\"muikku-1.1.124-SNAPSHOT.war\".beanmanager]"
	    ]
	}
	14:50:48,499 INFO  [org.jboss.as.server] (ServerService Thread Pool -- 34) WFLYSRV0010: Deployed "muikku-1.1.124-SNAPSHOT.war" (runtime-name : "muikku-1.1.124-SNAPSHOT.war")
	14:50:48,499 INFO  [org.jboss.as.server] (ServerService Thread Pool -- 34) WFLYSRV0010: Deployed "muikku-1.1.125-SNAPSHOT.war" (runtime-name : "muikku-1.1.125-SNAPSHOT.war")
	14:50:48,499 INFO  [org.jboss.as.server] (ServerService Thread Pool -- 34) WFLYSRV0010: Deployed "pyramus-0.7.123-SNAPSHOT.war" (runtime-name : "pyramus-0.7.123-SNAPSHOT.war")
	14:50:48,500 INFO  [org.jboss.as.controller] (Controller Boot Thread) WFLYCTL0183: Service status report
	WFLYCTL0184:    New missing/unsatisfied dependencies:
	      service jboss.deployment.unit."muikku-1.1.124-SNAPSHOT.war".beanmanager (missing) dependents: [service jboss.deployment.unit."muikku-1.1.124-SNAPSHOT.war".weld.weldClassIntrospector, service jboss.deployment.unit."muikku-1.1.124-SNAPSHOT.war".batch.environment] 
	WFLYCTL0186:   Services which failed to start:      service jboss.deployment.unit."muikku-1.1.124-SNAPSHOT.war".INSTALL: org.jboss.msc.service.StartException in service jboss.deployment.unit."muikku-1.1.124-SNAPSHOT.war".INSTALL: WFLYSRV0153: Failed to process phase INSTALL of deployment "muikku-1.1.124-SNAPSHOT.war"
	
}


package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

@Startup
@Singleton
@ApplicationScoped
public class AssessmentRequestNotificationStrategy extends AbstractTimedNotificationStrategy {
  
  private static final int firstResult = 0;
  private static final int maxResults = 10;
  
  @Inject
  private AssesmentRequestNotificationController assesmentRequestNotificationController;
  
  @Inject
  private Logger logger;
  
  @Override
  public long getDuration() {
    return 10000l;
  }
  
  @Override
  public void sendNotifications() {
    Collection<Long> groups = Collections.singleton(1l);
    int days = 180;
    List<SchoolDataIdentifier> studentIdentifiers = assesmentRequestNotificationController.listStudentsWithoutAssessmentRequestsIn(groups, days, firstResult, maxResults);
    for (SchoolDataIdentifier studentIdentifier : studentIdentifiers) {
      logger.log(Level.SEVERE, String.format("Sent notification to %s", studentIdentifier.toId()));
    }
  }

}

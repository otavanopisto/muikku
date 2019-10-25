package fi.otavanopisto.muikku.plugins.forgotpassword;

import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;

@Startup
@Singleton
public class ExpiredPasswordResetRequestCleanupScheduler {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO;

  @Schedule(dayOfWeek = "*", hour="9", persistent = false)
  public void cleanup() {
    long total = userPendingPasswordChangeDAO.count();
    int countExpired = userPendingPasswordChangeDAO.deleteExpired();
    
    logger.info(String.format("Removed %d/%d expired pending password change requests.", countExpired, total));
  }
  
}

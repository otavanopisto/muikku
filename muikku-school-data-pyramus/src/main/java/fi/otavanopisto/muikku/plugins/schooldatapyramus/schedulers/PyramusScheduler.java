package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.enterprise.concurrent.ManagedScheduledExecutorService;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.transaction.UserTransaction;

import org.apache.commons.collections.IteratorUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

@Startup
@Singleton
@ApplicationScoped
@TransactionManagement(value=TransactionManagementType.BEAN)
public class PyramusScheduler {

  private static final int INITIAL_TIMEOUT = 300; // 5 minutes
  private static final int TIMEOUT = 60; // 1 minute

  @Any
  @Inject
  private Instance<PyramusUpdateScheduler> updateSchedulers;

  @Inject
  private Logger logger;
  
  @Resource
  private ManagedScheduledExecutorService scheduledExecutorService;
  
  @Resource
  private UserTransaction userTransaction;
  
  @PostConstruct
  public void init() {
    if (!SchoolDataPyramusPluginDescriptor.SCHEDULERS_ACTIVE || "true".equals(System.getProperty("tests.running"))) {
      return;
    }
    logger.info(String.format("Launching PyramusScheduler in %ds", INITIAL_TIMEOUT));
    schedulerIndex = 0;
    scheduledExecutorService.scheduleWithFixedDelay(this::synchronizePyramusData, INITIAL_TIMEOUT, TIMEOUT, TimeUnit.SECONDS);
  }

  private void synchronizePyramusData() {

    // Sort schedulers in priority order
    
    @SuppressWarnings("unchecked")
    List<PyramusUpdateScheduler> schedulers = IteratorUtils.toList(updateSchedulers.iterator());
    Collections.sort(schedulers, new Comparator<PyramusUpdateScheduler>() {
      @Override
      public int compare(PyramusUpdateScheduler o1, PyramusUpdateScheduler o2) {
        return o1.getPriority() - o2.getPriority();
      }
    });

    // Select scheduler for this run
    
    PyramusUpdateScheduler updateScheduler = schedulers.get(schedulerIndex);
    schedulerIndex = (schedulerIndex + 1) % schedulers.size();
    
    try {
      userTransaction.begin();

      // #3849: Skip synchronization if the scheduler has been disabled
      if (updateScheduler.isEnabled()) {
        String schedulerName = StringUtils.substringBefore(updateScheduler.getClass().getSimpleName(), "$");
        logger.info(String.format("Running %s", schedulerName));
        updateScheduler.synchronize();
      }
      
      userTransaction.commit();
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Pyramus synchronization failed", e);
      try {
        userTransaction.rollback();
      }
      catch (Exception rbe) {
        logger.log(Level.WARNING, "Pyramus synchronization rollback failed", e);
      }      
    }
    
  }
  
  private int schedulerIndex;

}
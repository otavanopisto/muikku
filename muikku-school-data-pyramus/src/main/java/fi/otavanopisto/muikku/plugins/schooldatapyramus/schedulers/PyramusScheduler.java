package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.IteratorUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

@Startup
@Singleton
@ApplicationScoped
public class PyramusScheduler {

  private static final int INITIAL_TIMEOUT = 1000 * 600; // 10 minutes
  private static final int TIMEOUT = 1000 * 15; // 15 sec
  private static final int ERROR_TIMEOUT = 1000 * 60; // 60 sec

  @Any
  @Inject
  private Instance<PyramusUpdateScheduler> updateSchedulers;

  @Resource
  private TimerService timerService;

  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    logger.info("initial PyramusScheduler timeout");
    if (!SchoolDataPyramusPluginDescriptor.SCHEDULERS_ACTIVE || "true".equals(System.getProperty("tests.running"))) {
      return;
    }
    schedulerIndex = 0;
    startTimer(INITIAL_TIMEOUT);
  }

  @Timeout
  public void syncTimeout(Timer timer) {
    try {
      synchronizePyramusData();
      startTimer(TIMEOUT);
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Synchronization failed.", ex);
      startTimer(ERROR_TIMEOUT);
    }
  }

  public void synchronizePyramusData() {
    @SuppressWarnings("unchecked")
    List<PyramusUpdateScheduler> schedulers = IteratorUtils.toList(updateSchedulers.iterator());
    Collections.sort(schedulers, new Comparator<PyramusUpdateScheduler>() {
      @Override
      public int compare(PyramusUpdateScheduler o1, PyramusUpdateScheduler o2) {
        return o1.getPriority() - o2.getPriority();
      }
    });

    PyramusUpdateScheduler updateScheduler = schedulers.get(schedulerIndex);

    try {
      updateScheduler.synchronize();
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, String.format("Scheduler %s failed", StringUtils.substringBefore(updateScheduler.getClass().getSimpleName(), "$")), ex);
    }

    schedulerIndex = (schedulerIndex + 1) % schedulers.size();
  }

  private void startTimer(int duration) {
    TimerConfig timerConfig = new TimerConfig();
    timerConfig.setPersistent(false);
    timerService.createSingleActionTimer(duration, timerConfig);
  }

  private int schedulerIndex;

}
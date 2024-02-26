package fi.otavanopisto.muikku.plugins.search;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.search.SearchReindexEvent;
import fi.otavanopisto.muikku.search.SearchReindexEvent.Task;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

@ApplicationScoped
@Singleton
public class SchoolDataSearchReindexListener {

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private CommunicatorController communicatorController;

  @Inject
  private UserIndexer userIndexer;

  @Inject
  private UserGroupIndexer userGroupIndexer;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Inject
  private PyramusUpdater pyramusUpdater;

  @Inject
  private CommunicatorMessageIndexer communicatorMessageIndexer;
  
  @Resource
  private TimerService timerService;

  private static final int DEFAULT_TIMEOUT_SECONDS = 5;
  private static final int DEFAULT_BATCH_SIZE = 50;

  @PostConstruct
  public void init() {
    active = false;
  }

  public void onReindexEvent(@Observes SearchReindexEvent event) {
    if (active) {
      logger.log(Level.INFO, "Already reindexing, refused to start another reindexing task");
      return;
    }

    active = true;
    tasks = event.getTasks();

    if (!event.isResume()) {
      if (tasks.contains(Task.ALL) || tasks.contains(Task.USERS)) {
        setOffset("userIndex", 0);
      }

      if (tasks.contains(Task.ALL) || tasks.contains(Task.WORKSPACES)) {
        setOffset("workspaceIndex", 0);
      }

      if (tasks.contains(Task.ALL) || tasks.contains(Task.USERGROUPS)) {
        setOffset("groupIndex", 0);
      }

      if (tasks.contains(Task.ALL) || tasks.contains(Task.COMMUNICATORMESSAGES)) {
        // CommunicatorMessages are reindexed in reverse order so we start from the highest id
        Long maximumCommunicatorMessageId = communicatorController.getMaximumCommunicatorMessageId();
        setOffset("communicatorIndex", maximumCommunicatorMessageId != null ? maximumCommunicatorMessageId.intValue() : 0);
      }
    }

    logger.log(Level.INFO, "Reindex initiated");

    startTimer(getTimeout());
  }

  @Timeout
  private void onTimeOut(Timer timer) {
    logger.log(Level.INFO, "Commencing Reindex task");
    try {
      boolean allDone = true;

      if (tasks.contains(Task.ALL) || tasks.contains(Task.WORKSPACES)) {
        allDone = reindexWorkspaceEntities();
      }

      if (allDone && (tasks.contains(Task.ALL) || tasks.contains(Task.USERS))) {
        allDone = reindexUsers();
      }

      if (allDone && (tasks.contains(Task.ALL) || tasks.contains(Task.STUDYPROGRAMMES))) {
        allDone = reindexStudyProgrammes();
      }

      if (allDone && (tasks.contains(Task.ALL) || tasks.contains(Task.USERGROUPS))) {
        allDone = reindexUserGroups();
      }

      if (allDone && (tasks.contains(Task.ALL) || tasks.contains(Task.COMMUNICATORMESSAGES))) {
        allDone = reindexCommunicatorMessages();
      }

      if (!allDone) {
        startTimer(getTimeout());
      }
      else {
        logger.log(Level.INFO, "Reindexing complete");
        active = false;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Reindexing of entities failed", ex);
    }
  }

  private boolean reindexWorkspaceEntities() {
    try {
      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
      int workspaceIndex = getOffset("workspaceIndex");

      if (workspaceIndex < workspaceEntities.size()) {
        int last = Math.min(workspaceEntities.size(), workspaceIndex + getBatchSize());

        for (int i = workspaceIndex; i < last; i++) {
          WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
          workspaceIndexer.indexWorkspace(workspaceEntity);
        }

        logger.log(Level.INFO, "Reindexed batch of workspaces (" + workspaceIndex + "-" + last + ")");

        setOffset("workspaceIndex", workspaceIndex + getBatchSize());
        return false;
      }
      else {
        return true;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing workspace entities", ex);
      return true;
    }
  }

  private boolean reindexUsers() {
    try {
      List<UserEntity> users = userEntityController.listUserEntities();
      int userIndex = getOffset("userIndex");

      if (userIndex < users.size()) {
        int last = Math.min(users.size(), userIndex + getBatchSize());

        for (int i = userIndex; i < last; i++) {
          try {
            UserEntity userEntity = users.get(i);

            userIndexer.indexUser(userEntity);
          }
          catch (Exception uex) {
            logger.log(Level.SEVERE, "Failed indexing userentity", uex);
          }
        }

        logger.log(Level.INFO, "Reindexed batch of users (" + userIndex + "-" + last + ")");

        setOffset("userIndex", userIndex + getBatchSize());
        return false;
      }
      else {
        return true;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing user entities", ex);
      return true;
    }
  }
  
  private boolean reindexStudyProgrammes() {
    try {
      pyramusUpdater.updateStudyProgrammes();
      logger.log(Level.INFO, "Reindexed study programmes");
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing study programmes", ex);
    }
    return true;
  }

  private boolean reindexUserGroups() {
    try {
      List<UserGroupEntity> userGroups = userGroupEntityController.listAllUserGroupEntities();
      int groupIndex = getOffset("groupIndex");

      if (groupIndex < userGroups.size()) {
        int last = Math.min(userGroups.size(), groupIndex + getBatchSize());

        for (int i = groupIndex; i < last; i++) {
          UserGroupEntity groupEntity = userGroups.get(i);
          try {
            userGroupIndexer.indexUserGroup(groupEntity);
          }
          catch (Exception e) {
            logger.log(Level.WARNING, "could not index UserGroup " + groupEntity.schoolDataIdentifier().toString(), e);
          }
        }

        logger.log(Level.INFO, "Reindexed batch of usergroups (" + groupIndex + "-" + last + ")");

        setOffset("groupIndex", groupIndex + getBatchSize());
        return false;
      }
      else {
        return true;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing usergroup entities", ex);
      return true;
    }
  }

  private boolean reindexCommunicatorMessages() {
    try {
      final int batchStartCommunicatorIndex = getOffset("communicatorIndex");
      final int batchSize = getBatchSize();

      if (batchStartCommunicatorIndex > 0) {
        int communicatorIndex = batchStartCommunicatorIndex;
        
        List<CommunicatorMessage> batch = communicatorController.listAllMessagesInReverseFromId((long) communicatorIndex, batchSize);

        for (CommunicatorMessage message : batch) {
          try {
            communicatorMessageIndexer.indexMessage(message);

            // Move index towards the smallest index in the list
            communicatorIndex = Math.min(communicatorIndex, message.getId().intValue());
          }
          catch (Exception e) {
            logger.log(Level.WARNING, "could not index Communicator message #" + message.getId(), e);
          }
        }

        logger.log(Level.INFO, String.format("Reindexed %d communicator messages from index %d.", batch.size(), batchStartCommunicatorIndex));

        // Index at this point should be the smallest index found in the batch and is already handled so decrement one for next batch
        communicatorIndex = Math.max(0, communicatorIndex - 1);
        setOffset("communicatorIndex", communicatorIndex);
        
        return communicatorIndex == 0;
      }
      else {
        return true;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing communicator messages", ex);
      return true;
    }
  }

  private int getBatchSize() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", "school-data.reindexer.batch"), DEFAULT_BATCH_SIZE);
  }

  private int getTimeout() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", "school-data.reindexer.timeout"), DEFAULT_TIMEOUT_SECONDS) * 1000;
  }

  private int getOffset(String var) {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", "school-data.reindexer." + var + ".offset"));
  }

  private void setOffset(String var, int offset) {
    pluginSettingsController.setPluginSetting("school-data", "school-data.reindexer." + var + ".offset", String.valueOf(offset));
  }

  private void startTimer(int duration) {
    if (this.timer != null) {
      try {
        this.timer.cancel();
      }
      catch (Exception e) {
      }

      this.timer = null;
    }

    TimerConfig timerConfig = new TimerConfig();
    timerConfig.setPersistent(false);

    this.timer = timerService.createSingleActionTimer(duration, timerConfig);
  }

  private Timer timer;
  private boolean active;
  private List<Task> tasks;
}

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
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.search.SearchReindexEvent;
import fi.otavanopisto.muikku.search.SearchReindexEvent.Task;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupController;
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
  private UserGroupController userGroupController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private CommunicatorController communicatorController;

  @Inject
  private SearchIndexer indexer;

  @Inject
  private UserIndexer userIndexer;

  @Inject
  private WorkspaceIndexer workspaceIndexer;

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
      logger.log(Level.INFO, "Already reindexing, refused to start another reindexing task.");
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
        setOffset("communicatorIndex", 0);
      }
    }

    logger.log(Level.INFO, "Reindex initiated.");

    startTimer(getTimeout());
  }

  @Timeout
  private void onTimeOut(Timer timer) {
    logger.log(Level.INFO, "Commencing Reindex task.");
    try {
      boolean allDone = true;

      if (tasks.contains(Task.ALL) || tasks.contains(Task.WORKSPACES)) {
        allDone = reindexWorkspaceEntities();
      }

      if (allDone && (tasks.contains(Task.ALL) || tasks.contains(Task.USERS))) {
        allDone = reindexUsers();
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
        logger.log(Level.INFO, "Reindexing complete.");
        active = false;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Reindexing of entities failed.", ex);
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
      logger.log(Level.SEVERE, "Could not finish indexing workspace entities.", ex);
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
      logger.log(Level.SEVERE, "Could not finish indexing user entities.", ex);
      return true;
    }
  }

  private boolean reindexUserGroups() {
    try {
      List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupEntities();
      int groupIndex = getOffset("groupIndex");

      if (groupIndex < userGroups.size()) {
        int last = Math.min(userGroups.size(), groupIndex + getBatchSize());

        for (int i = groupIndex; i < last; i++) {
          UserGroupEntity groupEntity = userGroups.get(i);

          UserGroup userGroup = userGroupController.findUserGroup(groupEntity.getSchoolDataSource(), groupEntity.getIdentifier());

          try {
            indexer.index(UserGroup.class.getSimpleName(), userGroup);
          }
          catch (Exception e) {
            logger.log(Level.WARNING, "could not index UserGroup #" + groupEntity.getSchoolDataSource() + '/' + groupEntity.getIdentifier(), e);
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
      logger.log(Level.SEVERE, "Could not finish indexing usergroup entities.", ex);
      return true;
    }
  }

  private boolean reindexCommunicatorMessages() {
    try {
      Long totalMessagesCount = communicatorController.countTotalMessages();

      int communicatorIndex = getOffset("communicatorIndex");

      if (communicatorIndex < totalMessagesCount) {
        List<CommunicatorMessage> batch = communicatorController.listAllMessages(communicatorIndex, getBatchSize());

        for (CommunicatorMessage message : batch) {
          try {
            communicatorMessageIndexer.indexMessage(message);
            communicatorIndex++;
          }
          catch (Exception e) {
            logger.log(Level.WARNING, "could not index Communicator message #" + message.getId(), e);
          }
        }

        if (communicatorIndex < (totalMessagesCount + 1)) {
          logger.log(Level.INFO, "Reindexed batch of communicator messages (" + getOffset("communicatorIndex") + "-" + communicatorIndex + ")");
        }

        setOffset("communicatorIndex", communicatorIndex);
        return false;
      }
      else {
        return true;
      }
    }
    catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing communicator messages.", ex);
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

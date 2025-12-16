package fi.otavanopisto.muikku.plugins.forum;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Safelist;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.controller.ResourceRightsController;
import fi.otavanopisto.muikku.model.forum.LockForumThread;
import fi.otavanopisto.muikku.model.security.ResourceRights;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumAreaGroupDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumMessageDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public class ForumController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private EnvironmentForumAreaDAO environmentForumAreaDAO;

  @Inject
  private WorkspaceForumAreaDAO workspaceForumAreaDAO;

  @Inject
  private ForumAreaDAO forumAreaDAO;

  @Inject
  private ForumThreadDAO forumThreadDAO;
  
  @Inject
  private ForumMessageDAO forumMessageDAO;
  
  @Inject
  private ForumAreaGroupDAO forumAreaGroupDAO;
  
  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;
  
  @Inject
  private ResourceRightsController resourceRightsController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private ActivityLogController activityLogController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  public boolean isEnvironmentForumActive() {
    if (sessionController.isLoggedIn()) {
      String enabledOrganizationsStr = pluginSettingsController.getPluginSetting("forum", "environmentForumOrganizations");
      if (StringUtils.isNotBlank(enabledOrganizationsStr)) {
        Set<SchoolDataIdentifier> organizationIdentifiers = Arrays.stream(StringUtils.split(enabledOrganizationsStr, ','))
            .map(identifier -> SchoolDataIdentifier.fromId(identifier))
            .collect(Collectors.toSet());

        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
        if (userSchoolDataIdentifier != null) {
          OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
          if (organization != null) {
            SchoolDataIdentifier userOrganizationIdentifier = organization.schoolDataIdentifier();
            return organizationIdentifiers.contains(userOrganizationIdentifier);
          }
        }
      }
    }
    return false;
  }
  
  private String clean(String html) {
    Document doc = Jsoup.parse(html);
    doc = new Cleaner(Safelist.relaxed()
      .addTags("s")
      .addAttributes("a", "target")
      .addAttributes("img", "width", "height", "style")
      .addAttributes("i", "class")
      .addAttributes("span", "style")).clean(doc);
    doc.select("a[target]").attr("rel", "noopener noreferer");
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

  public ForumArea getForumArea(Long forumAreaId) {
    return forumAreaDAO.findById(forumAreaId);
  }
  
  public ForumThread getForumThread(Long threadId) {
    return forumThreadDAO.findById(threadId);
  }
  
  public ForumThreadReply getForumThreadReply(Long threadReplyId) {
    return forumThreadReplyDAO.findById(threadReplyId);
  }

  public EnvironmentForumArea createEnvironmentForumArea(String name, String description, Long groupId) {
    UserEntity owner = sessionController.getLoggedUserEntity();
    ResourceRights rights = resourceRightsController.create();
    ForumAreaGroup group = groupId != null ? findForumAreaGroup(groupId) : null;
    EnvironmentForumArea forumArea = environmentForumAreaDAO.create(name, description, group, false, owner, rights);
    return forumArea;
  }
  
  public WorkspaceForumArea createWorkspaceForumArea(WorkspaceEntity workspace, String name, String description, Long groupId) {
    UserEntity owner = sessionController.getLoggedUserEntity();
    ResourceRights rights = resourceRightsController.create();
    ForumAreaGroup group = groupId != null ? findForumAreaGroup(groupId) : null;
    WorkspaceForumArea forumArea = workspaceForumAreaDAO.create(workspace, name, description, group, false, owner, rights);
    return forumArea;
  }
  
  public void copyWorkspaceForumAreas(WorkspaceEntity sourceWorkspace, WorkspaceEntity targetWorkspace) {
    List<WorkspaceForumArea> forumAreas = listWorkspaceForumAreas(sourceWorkspace);
    for (WorkspaceForumArea forumArea : forumAreas) {
      createWorkspaceForumArea(targetWorkspace, forumArea.getName(), forumArea.getDescription(), forumArea.getGroup() == null ? null : forumArea.getGroup().getId());
    }
  }

  public ForumArea updateForumAreaName(ForumArea forumArea, String name) {
    return forumAreaDAO.updateForumArea(forumArea, name);
  }

  public ForumArea updateForumAreaDescription(ForumArea forumArea, String description) {
    return forumAreaDAO.updateDescription(forumArea, description);
  }

  public void archiveArea(ForumArea forumArea) {
    forumAreaDAO.updateArchived(forumArea, true);
  }
  
  public void deleteArea(ForumArea forumArea) {
    forumAreaDAO.delete(forumArea);
  }
  
  public ForumArea findForumAreaById(Long forumAreaId) {
    return forumAreaDAO.findById(forumAreaId);
  }

  public ForumAreaGroup findForumAreaGroup(Long groupId) {
    return forumAreaGroupDAO.findById(groupId);
  }

  public ForumThread createForumThread(ForumArea forumArea, String title, String message, Boolean sticky, LockForumThread lock) {
    activityLogController.createActivityLog(sessionController.getLoggedUserEntity().getId(), ActivityLogType.FORUM_NEWTHREAD);
    Date lockDate = null;
    Long lockBy = null;
    if (lock != null) {
      lockDate = new Date();
      lockBy = sessionController.getLoggedUserEntity().getId();
    }
    return forumThreadDAO.create(forumArea, title, clean(message), sessionController.getLoggedUserEntity(), sticky, lock, lockDate, lockBy);
  }

  public void archiveThread(ForumThread thread) {
    List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(thread);
    for (ForumThreadReply reply : replies) {
      forumThreadReplyDAO.updateArchived(reply, true, sessionController.getLoggedUserEntity());
    }
    
    forumThreadDAO.updateArchived(thread, true);
  }
  
  public void deleteThread(ForumThread thread) {
    List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(thread);
    
    for (ForumThreadReply reply : replies) {
      forumThreadReplyDAO.updateParentReply(reply, null);
    }  
    
    for (ForumThreadReply reply : replies) {
      forumThreadReplyDAO.delete(reply);
    }
    
    forumThreadDAO.delete(thread);
  }

  public ForumThreadReply createForumThreadReply(ForumThread thread, String message, ForumThreadReply parentReply) {
    if (thread.getLocked() != null) {
      if (thread.getLocked() == LockForumThread.ALL || (thread.getLocked() == LockForumThread.STUDENTS && userEntityController.isStudent(sessionController.getLoggedUserEntity()))) {
        logger.severe("Tried to create a forum thread reply for locked thread");
        return null;
      }
    } 
      
    ForumThreadReply reply = forumThreadReplyDAO.create(thread.getForumArea(), thread, clean(message), sessionController.getLoggedUserEntity(), parentReply);
    forumThreadDAO.updateThreadUpdated(thread, reply.getCreated());
    activityLogController.createActivityLog(sessionController.getLoggedUserEntity().getId(), ActivityLogType.FORUM_NEWMESSAGE);
    return reply;
    
  }

  public void archiveReply(ForumThreadReply reply) {
    forumThreadReplyDAO.updateArchived(reply, true, sessionController.getLoggedUserEntity());
  }
  
  public void updateReplyDeleted(ForumThreadReply reply, boolean deleted) {
    forumThreadReplyDAO.updateDeleted(reply, deleted, sessionController.getLoggedUserEntity());
  }
  
  public void deleteReply(ForumThreadReply reply) {
    forumThreadReplyDAO.delete(reply);
  }
  
  public List<EnvironmentForumArea> listEnvironmentForums() {
    return sessionController.filterResources(
        environmentForumAreaDAO.listAllNonArchived(), ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM);
  }
  
  public List<WorkspaceForumArea> listWorkspaceForumAreas(WorkspaceEntity workspaceEntity) {
    return workspaceForumAreaDAO.listByWorkspaceEntity(workspaceEntity);
  }
  
  public WorkspaceForumArea findByAreaId(Long areaId) {
    return workspaceForumAreaDAO.findByAreaId(areaId);
  }

  public List<ForumThread> listForumThreads(ForumArea forumArea, int firstResult, int maxResults) {
    return listForumThreads(forumArea, firstResult, maxResults, false);
  }

  public List<ForumThread> listForumThreads(ForumArea forumArea, int firstResult, int maxResults, boolean includeArchived) {
    return forumThreadDAO.listByForumAreaOrdered(forumArea, firstResult, maxResults, includeArchived);
  }
  
  public List<ForumThreadReply> listForumThreadReplies(ForumThread forumThread, Integer firstResult, Integer maxResults) {
    return listForumThreadReplies(forumThread, firstResult, maxResults, false);
  }
  
  public List<ForumThreadReply> listForumThreadReplies(ForumThread forumThread, Integer firstResult, Integer maxResults, boolean includeArchived) {
    return forumThreadReplyDAO.listByForumThread(forumThread, firstResult, maxResults, includeArchived);
  }
  
  public List<ForumThread> listLatestForumThreads(int firstResult, int maxResults) {
    List<EnvironmentForumArea> environmentForums = listEnvironmentForums();
//    List<WorkspaceForumArea> workspaceForums = listCourseForums();
    List<ForumArea> forumAreas = new ArrayList<ForumArea>();

    // TODO: This could use some optimization
    
    for (EnvironmentForumArea ef : environmentForums) {
      forumAreas.add(ef);
    }
    
//    for (WorkspaceForumArea wf : workspaceForums) {
//      forumAreas.add(wf);
//    }
    
    List<ForumThread> threads;
    
    if (!forumAreas.isEmpty())
      threads = forumThreadDAO.listLatestOrdered(forumAreas, firstResult, maxResults);
    else
      threads = new ArrayList<ForumThread>();
    
    return threads;
  }
  
  public List<ForumThread> listLatestForumThreadsFromWorkspace(WorkspaceEntity workspaceEntity, Integer firstResult,
      Integer maxResults) {
    List<WorkspaceForumArea> workspaceForums = listWorkspaceForumAreas(workspaceEntity);
    List<ForumArea> forumAreas = new ArrayList<ForumArea>();

    // TODO: This could use some optimization
    for (WorkspaceForumArea wf : workspaceForums) {
      forumAreas.add(wf);
    }
    
    List<ForumThread> threads;

    if (!forumAreas.isEmpty())
      threads = forumThreadDAO.listLatestOrdered(forumAreas, firstResult, maxResults);
    else
      threads = new ArrayList<ForumThread>();

    return threads;
  }

  public UserEntity findUserEntity(Long userEntityId) {
    return userEntityController.findUserEntityById(userEntityId);
  }
  
  public User findUser(UserEntity userEntity) {
    return userController.findUserByUserEntityDefaults(userEntity);
  }
  
  public boolean getUserHasPicture(UserEntity userEntity) {
    return false; // TODO
  }
  
  public ForumThreadReply getLatestReply(ForumThread thread) {
    return forumThreadReplyDAO.findLatestReplyByThread(thread);
  }
  
  public ForumMessage getLatestMessage(ForumArea area) {
    return forumMessageDAO.findLatestMessageByArea(area);
  }
  
  public Long getThreadReplyCount(ForumThread thread) {
    return forumThreadReplyDAO.countByThread(thread);
  }

  public Long getThreadCount(ForumArea area) {
    return forumThreadDAO.countByArea(area);
  }

  public Long getMessageCount(ForumArea area) {
    return forumMessageDAO.countByArea(area);
  }
  
  public void archiveMessage(ForumMessage message) {
    forumMessageDAO.archive(message, sessionController.getLoggedUserEntity());
    
    if (message instanceof ForumThreadReply) {
      ForumThreadReply reply = (ForumThreadReply) message;
      
      ForumThreadReply latestReply = getLatestReply(reply.getThread());
      
      if (latestReply != null)
        forumThreadDAO.updateThreadUpdated(reply.getThread(), latestReply.getCreated());
      else
        forumThreadDAO.updateThreadUpdated(reply.getThread(), reply.getThread().getCreated());
    }
  }
  
  public void updateForumThread(ForumThread thread, String title, String message, Boolean sticky, LockForumThread lock) {
    UserEntity user = sessionController.getLoggedUserEntity();
    Date lockDate = new Date();
    Long lockBy = sessionController.getLoggedUserEntity().getId();
    if (thread.getLocked() == lock) {
      lockDate = thread.getLockDate();
      lockBy = thread.getLockBy();
    }
    
    forumThreadDAO.update(thread, title, clean(message), sticky, lock, new Date(), user, lockDate, lockBy);
  }

  public void updateForumThreadReply(ForumThreadReply reply, String message) {
    UserEntity user = sessionController.getLoggedUserEntity();
    forumThreadReplyDAO.update(reply, clean(message), new Date(), user);
  }

  public List<ForumAreaGroup> listForumAreaGroups() {
    return forumAreaGroupDAO.listUnArchived();
  }

  public ForumAreaGroup createForumAreaGroup(String name) {
    return forumAreaGroupDAO.create(name, Boolean.FALSE);
  }

  public void archiveAreaGroup(ForumAreaGroup forumAreaGroup) {
    forumAreaGroupDAO.updateArchived(forumAreaGroup, true);
  }
  
  public void deleteAreaGroup(ForumAreaGroup forumAreaGroup) {
    forumAreaGroupDAO.delete(forumAreaGroup);
  }
  
  public List<ForumMessage> listMessagesByWorkspace(WorkspaceEntity workspace) {
    return forumMessageDAO.listByWorkspace(workspace);
  }

  public List<ForumMessage> listByContributingUser(UserEntity userEntity) {
    return forumMessageDAO.listByContributingUser(userEntity);
  }
  
  public Long countUserEntityWorkspaceMessages(WorkspaceEntity workspaceEntity, UserEntity creator) {
    if (workspaceEntity == null) {
      logger.severe("Attempt to call countUserEntityWorkspaceMessages with null workspaceEntity");
      return 0l;
    }
    
    if (creator == null) {
      logger.severe("Attempt to call countUserEntityWorkspaceMessages with null creator");
      return 0l;
    }
    
    return forumMessageDAO.countByWorkspaceEntityAndCreator(workspaceEntity.getId(), creator.getId());
  }
  
  public ForumMessage findUserEntitysLatestWorkspaceMessage(WorkspaceEntity workspaceEntity, UserEntity creator) {
    if (workspaceEntity == null) {
      logger.severe("Attempt to call countUserEntityWorkspaceMessages with null workspaceEntity");
      return null;
    }
    
    if (creator == null) {
      logger.severe("Attempt to call countUserEntityWorkspaceMessages with null creator");
      return null;
    }
    
    List<ForumMessage> messages = forumMessageDAO.listByWorkspaceEntityAndCreatorOrderByCreated(workspaceEntity.getId(), creator.getId(), 0, 1);
    if (messages.size() == 1) {
      return messages.get(0);
    }
    
    return null;
  }
  
  public ForumThread toggleLock(ForumThread thread, LockForumThread lock, Long userEntityId) {
    return forumThreadDAO.toggleLock(thread, lock, userEntityId);
  }
}

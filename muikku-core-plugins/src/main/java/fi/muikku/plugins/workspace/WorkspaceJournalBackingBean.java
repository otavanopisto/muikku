package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/journal", to = "/jsf/workspace/journal.jsf")
@LoggedIn
public class WorkspaceJournalBackingBean {
  
  public static final class UserWithUserEntity {
    private final User user;
    private final UserEntity userEntity;
    
    public UserWithUserEntity(User user, UserEntity entity) {
      this.user = user;
      this.userEntity = entity;
    }
    
    public User getUser() {
      return user;
    }
    
    public UserEntity getUserEntity() {
      return userEntity;
    }
    
  }

  @Parameter
  private String workspaceUrlName;

  @Parameter
  @Matches("\\d+")
  private Long studentId;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceJournalController workspaceJournalController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);

    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceEntityId = workspaceEntity.getId();
    
    if (studentId != null && !sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)){
      return NavigationRules.ACCESS_DENIED;
    }

    return null;
  }

  public String posterOf(WorkspaceJournalEntry entry) {
    UserEntity userEntity = userEntityController.findUserEntityById(entry.getUserEntityId());
    User user = userController.findUserByUserEntityDefaults(userEntity);
    return user.getFirstName() + " " + user.getLastName();
  }

  public void addWorkspaceJournalEntry() {
    workspaceJournalController.createJournalEntry(workspaceController.findWorkspaceEntityById(workspaceEntityId),
        sessionController.getLoggedUserEntity(), workspaceJournalEntryHtml, workspaceJournalEntryTitle);
    workspaceJournalEntryTitle = "";
    workspaceJournalEntryHtml = "";
  }

  public void editWorkspaceJournalEntry(Long workspaceJournalEntryId) {
    workspaceJournalController.updateJournalEntry(workspaceJournalEntryId, workspaceJournalEntryTitle,
        workspaceJournalEntryHtml);
    workspaceJournalEntryTitle = "";
    workspaceJournalEntryHtml = "";
  }

  public void deleteWorkspaceJournalEntry(Long workspaceJournalEntryId) {
    workspaceJournalController.deleteJournalEntry(workspaceJournalEntryId);
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public String getWorkspaceJournalEntryTitle() {
    return workspaceJournalEntryTitle;
  }

  public void setWorkspaceJournalEntryTitle(String workspaceJournalEntryTitle) {
    this.workspaceJournalEntryTitle = workspaceJournalEntryTitle;
  }

  public String getWorkspaceJournalEntryHtml() {
    return workspaceJournalEntryHtml;
  }

  public void setWorkspaceJournalEntryHtml(String workspaceJournalEntryHtml) {
    this.workspaceJournalEntryHtml = workspaceJournalEntryHtml;
  }

  public Long getWorkspaceJournalEntryId() {
    return workspaceJournalEntryId;
  }

  public void setWorkspaceJournalEntryId(Long workspaceJournalEntryId) {
    this.workspaceJournalEntryId = workspaceJournalEntryId;
  }
  
  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }
  
  public Long getStudentId() {
    return studentId;
  }
  
  public boolean isMyJournal() {
    return studentId == null;
  }
  
  public boolean isCanListAllEntries() {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    return sessionController.hasCoursePermission(
        MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity);
  }
  
  public List<UserWithUserEntity> getWorkspaceStudents() {
    ArrayList<UserWithUserEntity> result = new ArrayList<>();
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    List<User> userList = workspaceController.listUsersByWorkspaceEntityAndRoleArchetype(
        workspaceEntity,
        WorkspaceRoleArchetype.STUDENT);
    
    for (User user : userList) {
      UserEntity userEntity =
          userEntityController.findUserEntityByDataSourceAndIdentifier(
              user.getSchoolDataSource(),
              user.getIdentifier());
      result.add(
          new UserWithUserEntity(user, userEntity)
      );
    }
    
    return result;
  }

  public List<WorkspaceJournalEntry> getJournalEntries() {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (studentId == null) {
      if (sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)) {
        return workspaceJournalController.listEntries(workspaceController.findWorkspaceEntityById(workspaceEntityId));
      } else {
        return workspaceJournalController.listEntriesByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
      }
    } else {
      if (sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)) {
        UserEntity studentEntity = userEntityController.findUserEntityById(studentId);
        return workspaceJournalController.listEntriesByWorkspaceEntityAndUserEntity(workspaceEntity, studentEntity);
      } else {
        return Arrays.asList();
      }
    }

  }

  private Long workspaceEntityId;
  private String workspaceJournalEntryTitle;
  private String workspaceJournalEntryHtml;
  private Long workspaceJournalEntryId;
}

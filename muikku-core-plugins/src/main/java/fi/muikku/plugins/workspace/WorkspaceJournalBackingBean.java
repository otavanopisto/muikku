package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
  
  public static final class UserView {
    private final User user;
    private final UserEntity userEntity;
    private final boolean selected;
    
    public UserView(User user, UserEntity entity, boolean selected) {
      this.user = user;
      this.userEntity = entity;
      this.selected = selected;
    }
    
    public User getUser() {
      return user;
    }
    
    public UserEntity getUserEntity() {
      return userEntity;
    }
    
    public boolean isSelected() {
      return selected;
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

    if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_WORKSPACE_JOURNAL, workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }

    if (studentId != null && !sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)){
      return NavigationRules.ACCESS_DENIED;
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceEntityId = workspaceEntity.getId();
    posterCache = new HashMap<Long, String>();
    canListAllEntries = sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity);
    workspaceStudents = prepareWorkspaceStudents();
    journalEntries = prepareJournalEntries();

    return null;
  }

  public String posterOf(WorkspaceJournalEntry entry) {
    if (posterCache.containsKey(entry.getUserEntityId())) {
      return posterCache.get(entry.getUserEntityId());
    } else {
      UserEntity userEntity = userEntityController.findUserEntityById(entry.getUserEntityId());
      User user = userController.findUserByUserEntityDefaults(userEntity);
      String fullName = user.getFirstName() + " " + user.getLastName();
      posterCache.put(entry.getUserEntityId(), fullName);
      return fullName;
    }
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
    return canListAllEntries;
  }
  
  public List<UserView> getWorkspaceStudents() {
    return workspaceStudents;
  }
  
  public List<WorkspaceJournalEntry> getJournalEntries() {
    return journalEntries;
  }
    
  private List<UserView> prepareWorkspaceStudents() {
    if (!canListAllEntries) {
      return Collections.emptyList();
    }
    
    ArrayList<UserView> result = new ArrayList<>();
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
          new UserView(user, userEntity, userEntity.getId().equals(studentId))
      );
    }
    
    Collections.sort(result, new Comparator<UserView>() {
      @Override
      public int compare(UserView o1, UserView o2) {
        String s1 = o1.getUser().getLastName();
        String s2 = o2.getUser().getLastName();
        s1 = s1 == null ? "" : s1;
        s2 = s2 == null ? "" : s2;
        int result = s1.compareTo(s2);
        if (result == 0) {
          s1 = o1.getUser().getFirstName();
          s2 = o2.getUser().getFirstName();
          result = s1.compareTo(s2);
        }
        return result;
      }
    });
    
    return result;
  }

  private List<WorkspaceJournalEntry> prepareJournalEntries() {
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
  private boolean canListAllEntries;
  private List<UserView> workspaceStudents;
  private List<WorkspaceJournalEntry> journalEntries;
  private Map<Long, String> posterCache;
}

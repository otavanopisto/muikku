package fi.otavanopisto.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/journal", to = "/jsf/workspace/journal.jsf")
@LoggedIn
public class WorkspaceJournalBackingBean extends AbstractWorkspaceBackingBean {

  public static int PAGE_SIZE = 25;
  
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

  @Parameter
  @Matches("\\d+")
  private Long page;
  
  @Inject
  private SessionController sessionController;

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

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_WORKSPACE_JOURNAL, workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }

    if (studentId != null && !sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)){
      return NavigationRules.ACCESS_DENIED;
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceEntityId = workspaceEntity.getId();
    canListAllEntries = sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity);
    
    return null;
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
  
  public Long getPage() {
    return page == null ? 1l : page;
  }

  public void setPage(Long page) {
    this.page = page;
  }
  
  public boolean isMyJournal() {
    return studentId == null;
  }
  
  public boolean isCanListAllEntries() {
    return canListAllEntries;
  }
  
  private Long workspaceEntityId;
  private String workspaceJournalEntryTitle;
  private String workspaceJournalEntryHtml;
  private Long workspaceJournalEntryId;
  private boolean canListAllEntries;
}

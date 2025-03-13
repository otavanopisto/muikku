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
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/workspace/{workspaceUrlName}/journal", to = "/jsf/workspace/journal.jsf")
@LoggedIn
public class WorkspaceJournalBackingBean extends AbstractWorkspaceBackingBean {

  public static int PAGE_SIZE = 25;
  
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

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
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
  private boolean canListAllEntries;
}

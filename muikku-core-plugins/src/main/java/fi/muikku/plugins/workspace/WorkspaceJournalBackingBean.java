package fi.muikku.plugins.workspace;

import java.util.HashMap;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/journal", to = "/jsf/workspace/journal.jsf")
@LoggedIn
public class WorkspaceJournalBackingBean {
  
  @Parameter
  private String workspaceUrlName;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceJournalController workspaceJournalController;

  @Inject
  private ForumController forumController;

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
    
    return null;
  }
  
  public void addWorkspaceJournalEntry(){
    workspaceJournalController.createJournalEntry(workspaceController.findWorkspaceEntityById(workspaceEntityId), workspaceJournalEntryHtml, workspaceJournalEntryTitle);
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

  private Long workspaceEntityId;
  private String workspaceJournalEntryTitle;
  private String workspaceJournalEntryHtml;
}
package fi.muikku.plugins.workspace.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

@DAO
public class WorkspaceMaterialFieldAnswerDAO extends PluginDAO<WorkspaceMaterialFieldAnswer> {

  private static final long serialVersionUID = 8806661057816838846L;
  
  public WorkspaceMaterialFieldAnswer create(WorkspaceMaterialReply reply, String value, WorkspaceMaterialField workspaceMaterialField){
    WorkspaceMaterialFieldAnswer workspaceMaterialFieldAnswer = new WorkspaceMaterialFieldAnswer();
    workspaceMaterialFieldAnswer.setReply(reply);
    workspaceMaterialFieldAnswer.setValue(value);
    workspaceMaterialFieldAnswer.setWorkspaceMaterialField(workspaceMaterialField);
    
    return persist(workspaceMaterialFieldAnswer);
  }

}

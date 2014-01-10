package fi.muikku.plugins.workspace;

import javax.inject.Inject;

import fi.muikku.plugins.materialfields.model.QueryTextField;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialTextFieldAnswerDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

public class WorkspaceMaterialFieldAnswerController {

  @Inject
  private WorkspaceMaterialTextFieldAnswerDAO workspaceMaterialTextFieldAnswerDAO;
  
  public WorkspaceMaterialTextFieldAnswer createWorkspaceMaterialTextFieldAnswer(QueryTextField queryField, WorkspaceMaterialReply reply, String value) {
    return workspaceMaterialTextFieldAnswerDAO.create(queryField, reply, value);
  }

  public WorkspaceMaterialTextFieldAnswer findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(QueryTextField queryField, WorkspaceMaterialReply reply) {
    return workspaceMaterialTextFieldAnswerDAO.findByQueryFieldAndReply(queryField, reply);
  }
  
  public WorkspaceMaterialTextFieldAnswer updateWorkspaceMaterialTextFieldAnswerValue(WorkspaceMaterialTextFieldAnswer workspaceMaterialTextFieldAnswer, String value) {
    return workspaceMaterialTextFieldAnswerDAO.updateValue(workspaceMaterialTextFieldAnswer, value);
  }

}

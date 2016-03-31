package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import fi.otavanopisto.muikku.plugins.material.QueryConnectFieldController;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceConnectFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  @Inject
  private QueryConnectFieldController queryConnectFieldController;
  
  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    Map<String, String> valueMap = null;
    try {
      valueMap = new ObjectMapper().readValue(value, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      throw new WorkspaceFieldIOException("Could not unmarshal field response", e);
    }
    
    QueryConnectField queryConnectField = (QueryConnectField) field.getQueryField();
    if (queryConnectField != null) {
      List<QueryConnectFieldTerm> terms = queryConnectFieldController.listConnectFieldTermsByField(queryConnectField);
      for (QueryConnectFieldTerm term : terms) {
        String parameterValue = valueMap.get(term.getName());
        QueryConnectFieldCounterpart counterpart = StringUtils.isNotEmpty(parameterValue) ? queryConnectFieldController.findQueryConnectFieldCounterpartByFieldAndName(queryConnectField, parameterValue) : null;
        WorkspaceMaterialConnectFieldAnswer connectFieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialConnectFieldAnswerByFieldAndReplyAndTerm(field, reply, term);
        if (connectFieldAnswer != null) {
          workspaceMaterialFieldAnswerController.updateWorkspaceMaterialConnectFieldAnswerCounterpart(connectFieldAnswer, counterpart);
        } else {
          if (counterpart != null) {
            workspaceMaterialFieldAnswerController.createWorkspaceMaterialConnectFieldAnswer(field, reply, term, counterpart);
          }
        }
      }
    } else {
      throw new WorkspaceFieldIOException("Workspace material connect field #" + field.getId() + " points to non-existing field ");
    }
   }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException {
    Map<String, String> answers = new HashMap<>();
    
    QueryConnectField queryConnectField = (QueryConnectField) field.getQueryField();
    
    List<QueryConnectFieldTerm> terms = queryConnectFieldController.listConnectFieldTermsByField(queryConnectField);
    for (QueryConnectFieldTerm term : terms) {
      WorkspaceMaterialConnectFieldAnswer connectFieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialConnectFieldAnswerByFieldAndReplyAndTerm(field, reply, term);
      if ((connectFieldAnswer != null) && (connectFieldAnswer.getCounterpart() != null)) {
        answers.put(term.getName(), connectFieldAnswer.getCounterpart().getName());
      }
    }

    try {
      return new ObjectMapper().writeValueAsString(answers);
    } catch (IOException e) {
      throw new WorkspaceFieldIOException("Could not marshal field response", e);
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

}

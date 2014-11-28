package fi.muikku.plugins.workspace.fieldio;

import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceCheckboxFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
    String[] postedValues = new String[0];
    WorkspaceMaterialChecklistFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialChecklistFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer == null && StringUtils.isNotBlank(value)) {
      fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialChecklistFieldAnswer(field, reply);
    }
    if (StringUtils.isNotBlank(value)) {
      ObjectMapper objectMapper = new ObjectMapper();
      try {
        postedValues = objectMapper.readValue(value, String[].class);
      }
      catch (Exception e) {
      }
    }
    List<QueryChecklistFieldOption> options = workspaceMaterialFieldAnswerController.listChecklistFieldOptions((QueryChecklistField) field.getQueryField());
    List<WorkspaceMaterialChecklistFieldAnswerOption> currentAnswers = workspaceMaterialFieldAnswerController.listWorkspaceMaterialChecklistFieldAnswerOptions(fieldAnswer);
    for (String postedValue : postedValues) {
      WorkspaceMaterialChecklistFieldAnswerOption answerOption = getAnswerOption(currentAnswers, postedValue);
      if (answerOption == null) {
        // From unchecked to checked
        QueryChecklistFieldOption fieldOption = getFieldOption(options, postedValue);
        workspaceMaterialFieldAnswerController.createWorkspaceMaterialChecklistFieldAnswerOption(fieldAnswer, fieldOption);
      }
      else {
        // From checked to checked
        currentAnswers.remove(answerOption);
      }
    }
    // From checked to unchecked
    for (WorkspaceMaterialChecklistFieldAnswerOption currentAnswer : currentAnswers) {
      workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialChecklistFieldAnswerOption(currentAnswer);
    }
  }
  
  private QueryChecklistFieldOption getFieldOption(List<QueryChecklistFieldOption> options, String name) {
    for (QueryChecklistFieldOption option : options) {
      if (option.getName().equals(name)) {
        return option;
      }
    }
    return null;
  }
  
  private WorkspaceMaterialChecklistFieldAnswerOption getAnswerOption(List<WorkspaceMaterialChecklistFieldAnswerOption> options, String name) {
    for (WorkspaceMaterialChecklistFieldAnswerOption option : options) {
      if (option.getOption().getName().equals(name)) {
        return option;
      }
    }
    return null;
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    String answer = "[]";
    WorkspaceMaterialChecklistFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialChecklistFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer != null) {
      List<WorkspaceMaterialChecklistFieldAnswerOption> options = workspaceMaterialFieldAnswerController.listWorkspaceMaterialChecklistFieldAnswerOptions(fieldAnswer);
      int i = 0;
      String[] values = new String[options.size()];
      for (WorkspaceMaterialChecklistFieldAnswerOption option : options) {
        values[i++] = option.getOption().getName();
      }
      ObjectMapper objectMapper = new ObjectMapper();
      try {
        answer = objectMapper.writeValueAsString(values);
      }
      catch (Exception e) {
      }
    }
    return answer;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.checklist";
  }

}

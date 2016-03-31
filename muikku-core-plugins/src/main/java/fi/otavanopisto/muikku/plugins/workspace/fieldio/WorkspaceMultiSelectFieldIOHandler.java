package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectFieldOption;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceMultiSelectFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    String[] postedValues = new String[0];
    WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialMultiSelectFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer == null && StringUtils.isNotBlank(value)) {
      fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialMultiSelectFieldAnswer(field, reply);
    }
    if (StringUtils.isNotBlank(value)) {
      ObjectMapper objectMapper = new ObjectMapper();
      try {
        postedValues = objectMapper.readValue(value, String[].class);
      }
      catch (Exception e) {
        throw new WorkspaceFieldIOException("Could not marshal field response", e);
      }
    }
    List<QueryMultiSelectFieldOption> options = workspaceMaterialFieldAnswerController.listMultiSelectFieldOptions((QueryMultiSelectField) field.getQueryField());
    List<WorkspaceMaterialMultiSelectFieldAnswerOption> currentAnswers = workspaceMaterialFieldAnswerController.listWorkspaceMaterialMultiSelectFieldAnswerOptions(fieldAnswer);
    for (String postedValue : postedValues) {
      WorkspaceMaterialMultiSelectFieldAnswerOption answerOption = getAnswerOption(currentAnswers, postedValue);
      if (answerOption == null) {
        // From unchecked to checked
        QueryMultiSelectFieldOption fieldOption = getFieldOption(options, postedValue);
        if (fieldOption == null) {
          throw new WorkspaceFieldIOException("Multiselect lacks posted option " + postedValue);
        }
        workspaceMaterialFieldAnswerController.createWorkspaceMaterialMultiSelectFieldAnswerOption(fieldAnswer, fieldOption);
      }
      else {
        // From checked to checked
        currentAnswers.remove(answerOption);
      }
    }
    // From checked to unchecked
    for (WorkspaceMaterialMultiSelectFieldAnswerOption currentAnswer : currentAnswers) {
      workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialMultiSelectFieldAnswerOption(currentAnswer);
    }
  }
  
  private QueryMultiSelectFieldOption getFieldOption(List<QueryMultiSelectFieldOption> options, String name) {
    for (QueryMultiSelectFieldOption option : options) {
      if (option.getName().equals(name)) {
        return option;
      }
    }
    return null;
  }
  
  private WorkspaceMaterialMultiSelectFieldAnswerOption getAnswerOption(List<WorkspaceMaterialMultiSelectFieldAnswerOption> options, String name) {
    for (WorkspaceMaterialMultiSelectFieldAnswerOption option : options) {
      if (option.getOption().getName().equals(name)) {
        return option;
      }
    }
    return null;
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException {
    String answer = "[]";
    WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialMultiSelectFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer != null) {
      List<WorkspaceMaterialMultiSelectFieldAnswerOption> options = workspaceMaterialFieldAnswerController.listWorkspaceMaterialMultiSelectFieldAnswerOptions(fieldAnswer);
      int i = 0;
      String[] values = new String[options.size()];
      for (WorkspaceMaterialMultiSelectFieldAnswerOption option : options) {
        values[i++] = option.getOption().getName();
      }
      ObjectMapper objectMapper = new ObjectMapper();
      try {
        answer = objectMapper.writeValueAsString(values);
      }
      catch (Exception e) {
        throw new WorkspaceFieldIOException("Could not marshal field response", e);
      }
    }
    return answer;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.multiselect";
  }

}

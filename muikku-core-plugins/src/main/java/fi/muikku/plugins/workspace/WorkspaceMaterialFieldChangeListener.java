package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldMetaParsingExeption;
import fi.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialSelectFieldAnswerDAO;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldDeleteEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldUpdateEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;

public class WorkspaceMaterialFieldChangeListener {
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;
  
  @Inject
  private WorkspaceMaterialSelectFieldAnswerDAO workspaceMaterialSelectFieldAnswerDAO;
  
  // Create
  
  // Update
  
  public void onWorkspaceMaterialSelectFieldUpdate(@Observes WorkspaceMaterialFieldUpdateEvent event) throws MaterialFieldMetaParsingExeption, WorkspaceMaterialContainsAnswersExeption {

    // Field JSON to metadata object
    
    ObjectMapper objectMapper = new ObjectMapper();
    SelectFieldMeta selectFieldMeta;
    try {
      selectFieldMeta = objectMapper.readValue(event.getMaterialField().getContent(), SelectFieldMeta.class);
    } catch (IOException e) {
      throw new MaterialFieldMetaParsingExeption("Could not parse file field meta", e);
    }
    QuerySelectField queryField = (QuerySelectField) event.getWorkspaceMaterialField().getQueryField();
    
    // Ensure that if there are options being removed, they haven't been used as answers
    
    List<WorkspaceMaterialSelectFieldAnswer> deprecatedAnswers = new ArrayList<WorkspaceMaterialSelectFieldAnswer>(); 
    List<QuerySelectFieldOption> oldOptions = querySelectFieldOptionDAO.listByField(queryField);
    List<SelectFieldOptionMeta> newOptions = selectFieldMeta.getOptions();
    for (SelectFieldOptionMeta newOption : newOptions) {
      QuerySelectFieldOption correspondingOption = findOptionByName(oldOptions, newOption.getName());
      if (correspondingOption != null) {
        oldOptions.remove(correspondingOption);
      }
    }
    for (QuerySelectFieldOption removedOption : oldOptions) {
      List<WorkspaceMaterialSelectFieldAnswer> answers = workspaceMaterialSelectFieldAnswerDAO.listByQuerySelectFieldOption(removedOption);
      deprecatedAnswers.addAll(answers);
    }
    
    // Either delete the answers of now-removed options or keel over gracefully 
    
    if (!deprecatedAnswers.isEmpty() && !event.getRemoveAnswers()) {
      throw new WorkspaceMaterialContainsAnswersExeption("Could not remove workspace material field because it contains answers");
    }
    else if (!deprecatedAnswers.isEmpty()) {
      for (WorkspaceMaterialSelectFieldAnswer deprecatedAnswer : deprecatedAnswers) {
        deleteFieldAnswer(deprecatedAnswer);
      }
    }
  }

  private QuerySelectFieldOption findOptionByName(List<QuerySelectFieldOption> options, String name) {
    for (QuerySelectFieldOption option : options) {
      if (StringUtils.equals(option.getName(), name)) {
        return option;
      }
    }
    return null;
  }

  // Delete
  
  public void onWorkspaceMaterialFieldDelete(@Observes WorkspaceMaterialFieldDeleteEvent event) throws WorkspaceMaterialContainsAnswersExeption {
    WorkspaceMaterialField materialField = event.getWorkspaceMaterialField();
    
    List<WorkspaceMaterialFieldAnswer> answers = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFieldAnswersByField(materialField);
    if (event.getRemoveAnswers()) {
      for (WorkspaceMaterialFieldAnswer answer : answers) {
        deleteFieldAnswer(answer); 
      }
    } else {
      if (!answers.isEmpty()) {
        throw new WorkspaceMaterialContainsAnswersExeption("Could not remove workspace material field because it contains answers");
      }
    }
  }

  private void deleteFieldAnswer(WorkspaceMaterialFieldAnswer answer) {
    if (answer instanceof WorkspaceMaterialFileFieldAnswer) {
      List<WorkspaceMaterialFileFieldAnswerFile> fileAnswerFiles = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer((WorkspaceMaterialFileFieldAnswer) answer);
      for (WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile : fileAnswerFiles) {
        workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFileFieldAnswerFile(fieldAnswerFile);
      }
    }
    else if (answer instanceof WorkspaceMaterialMultiSelectFieldAnswer) {
      List<WorkspaceMaterialMultiSelectFieldAnswerOption> options = workspaceMaterialFieldAnswerController.listWorkspaceMaterialMultiSelectFieldAnswerOptions((WorkspaceMaterialMultiSelectFieldAnswer) answer); 
      for (WorkspaceMaterialMultiSelectFieldAnswerOption option : options) {
        workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialMultiSelectFieldAnswerOption(option);
      }
    }
    workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFieldAnswer(answer);
  }
  
}

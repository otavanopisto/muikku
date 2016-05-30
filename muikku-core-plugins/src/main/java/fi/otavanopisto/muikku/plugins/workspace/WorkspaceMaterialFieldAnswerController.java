package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryMultiSelectFieldOptionDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QuerySelectFieldOptionDAO;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectFieldOption;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectField;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialConnectFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerFileDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialMultiSelectFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialMultiSelectFieldAnswerOptionDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialOrganizerFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialSelectFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialSorterFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialTextFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialOrganizerFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSorterFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

public class WorkspaceMaterialFieldAnswerController {

  @Inject
  private WorkspaceMaterialFieldAnswerDAO workspaceMaterialFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialTextFieldAnswerDAO workspaceMaterialTextFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialOrganizerFieldAnswerDAO workspaceMaterialOrganizerFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialSorterFieldAnswerDAO workspaceMaterialSorterFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialSelectFieldAnswerDAO workspaceMaterialSelectFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialConnectFieldAnswerDAO workspaceMaterialConnectFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialMultiSelectFieldAnswerDAO workspaceMaterialMultiSelectFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialMultiSelectFieldAnswerOptionDAO workspaceMaterialMultiSelectFieldAnswerOptionDAO;

  @Inject
  private WorkspaceMaterialFileFieldAnswerDAO workspaceMaterialFileFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialFileFieldAnswerFileDAO workspaceMaterialFileFieldAnswerFileDAO;
  
  @Inject
  private QuerySelectFieldOptionDAO querySelectFieldOptionDAO;
  
  @Inject
  private QueryMultiSelectFieldOptionDAO queryMultiSelectFieldOptionDAO;
  
  /* Generic */

  public List<WorkspaceMaterialFieldAnswer> listWorkspaceMaterialFieldAnswersByField(WorkspaceMaterialField field) {
    return workspaceMaterialFieldAnswerDAO.listByField(field);
  }
  
  public void deleteWorkspaceMaterialFieldAnswer(WorkspaceMaterialFieldAnswer answer) {
    workspaceMaterialFieldAnswerDAO.delete(answer);
  }

  /* TextField */

  public WorkspaceMaterialTextFieldAnswer createWorkspaceMaterialTextFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
    return workspaceMaterialTextFieldAnswerDAO.create(field, reply, value);
  }

  public WorkspaceMaterialTextFieldAnswer findWorkspaceMaterialTextFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialTextFieldAnswerDAO.findByFieldAndReply(field, reply);
  }

  public WorkspaceMaterialTextFieldAnswer updateWorkspaceMaterialTextFieldAnswerValue(WorkspaceMaterialTextFieldAnswer workspaceMaterialTextFieldAnswer,
      String value) {
    return workspaceMaterialTextFieldAnswerDAO.updateValue(workspaceMaterialTextFieldAnswer, value);
  }
  
  /* Organizer field */

  public WorkspaceMaterialOrganizerFieldAnswer createWorkspaceMaterialOrganizerFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
    return workspaceMaterialOrganizerFieldAnswerDAO.create(field, reply, value);
  }

  public WorkspaceMaterialOrganizerFieldAnswer findWorkspaceMaterialOrganizerFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialOrganizerFieldAnswerDAO.findByFieldAndReply(field, reply);
  }

  public WorkspaceMaterialOrganizerFieldAnswer updateWorkspaceMaterialOrganizerFieldAnswerValue(WorkspaceMaterialOrganizerFieldAnswer workspaceMaterialOrganizerFieldAnswer,
      String value) {
    return workspaceMaterialOrganizerFieldAnswerDAO.updateValue(workspaceMaterialOrganizerFieldAnswer, value);
  }

  /* Sorter field */

  public WorkspaceMaterialSorterFieldAnswer createWorkspaceMaterialSorterFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
    return workspaceMaterialSorterFieldAnswerDAO.create(field, reply, value);
  }

  public WorkspaceMaterialSorterFieldAnswer findWorkspaceMaterialSorterFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialSorterFieldAnswerDAO.findByFieldAndReply(field, reply);
  }

  public WorkspaceMaterialSorterFieldAnswer updateWorkspaceMaterialSorterFieldAnswerValue(WorkspaceMaterialSorterFieldAnswer workspaceMaterialSorterFieldAnswer,
      String value) {
    return workspaceMaterialSorterFieldAnswerDAO.updateValue(workspaceMaterialSorterFieldAnswer, value);
  }

  /* SelectField */

  public WorkspaceMaterialSelectFieldAnswer createWorkspaceMaterialSelectFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply,
      QuerySelectFieldOption value) {
    return workspaceMaterialSelectFieldAnswerDAO.create(field, reply, value);
  }

  public WorkspaceMaterialSelectFieldAnswer findWorkspaceMaterialSelectFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialSelectFieldAnswerDAO.findByQueryFieldAndReply(field, reply);
  }

  public WorkspaceMaterialSelectFieldAnswer updateWorkspaceMaterialSelectFieldAnswerValue(
      WorkspaceMaterialSelectFieldAnswer workspaceMaterialSelectFieldAnswer, QuerySelectFieldOption value) {
    return workspaceMaterialSelectFieldAnswerDAO.updateValue(workspaceMaterialSelectFieldAnswer, value);
  }
  
  public QuerySelectFieldOption findSelectFieldOptionByName(QuerySelectField selectField, String name) {
    return querySelectFieldOptionDAO.findBySelectFieldAndName(selectField, name);
  }
  
  public List<QueryMultiSelectFieldOption> listMultiSelectFieldOptions(QueryMultiSelectField multiSelectField) {
    return queryMultiSelectFieldOptionDAO.listByField(multiSelectField);
  }

  /* ConnectField */
  
  public WorkspaceMaterialConnectFieldAnswer createWorkspaceMaterialConnectFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply, QueryConnectFieldTerm term, QueryConnectFieldCounterpart counterpart) {
    return workspaceMaterialConnectFieldAnswerDAO.create(field, reply, term, counterpart);
  }
  
  public WorkspaceMaterialConnectFieldAnswer findWorkspaceMaterialConnectFieldAnswerByFieldAndReplyAndTerm(WorkspaceMaterialField field, WorkspaceMaterialReply reply, QueryConnectFieldTerm term) {
    return workspaceMaterialConnectFieldAnswerDAO.findByQueryFieldAndReplyAndTerm(field, reply, term);
  }
  
  public WorkspaceMaterialConnectFieldAnswer updateWorkspaceMaterialConnectFieldAnswerCounterpart(WorkspaceMaterialConnectFieldAnswer workspaceMaterialConnectFieldAnswer, QueryConnectFieldCounterpart counterpart) {
    return workspaceMaterialConnectFieldAnswerDAO.updateCounterpart(workspaceMaterialConnectFieldAnswer, counterpart);
  }
  
  /* MultiSelectField */
  
  public WorkspaceMaterialMultiSelectFieldAnswer createWorkspaceMaterialMultiSelectFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialMultiSelectFieldAnswerDAO.create(field, reply);
  }

  public WorkspaceMaterialMultiSelectFieldAnswer findWorkspaceMaterialMultiSelectFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialMultiSelectFieldAnswerDAO.findByQueryFieldAndReply(field, reply);
  }
  
  /* MultiSelectFieldOption */

  public WorkspaceMaterialMultiSelectFieldAnswerOption createWorkspaceMaterialMultiSelectFieldAnswerOption(WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer,
      QueryMultiSelectFieldOption option) {
    return workspaceMaterialMultiSelectFieldAnswerOptionDAO.create(fieldAnswer, option);
  }
  
  public WorkspaceMaterialMultiSelectFieldAnswerOption findWorkspaceMaterialMultiSelectFieldAnswerOptionByFieldAnswerAndOption(
      WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer, QueryMultiSelectFieldOption option) {
    return workspaceMaterialMultiSelectFieldAnswerOptionDAO.findByFieldAnswerAndOption(fieldAnswer, option);
  }

  public List<WorkspaceMaterialMultiSelectFieldAnswerOption> listWorkspaceMaterialMultiSelectFieldAnswerOptions(WorkspaceMaterialMultiSelectFieldAnswer fieldAnsewr) {
    return workspaceMaterialMultiSelectFieldAnswerOptionDAO.listByFieldAnswer(fieldAnsewr);
  }

  public void deleteWorkspaceMaterialMultiSelectFieldAnswerOption(WorkspaceMaterialMultiSelectFieldAnswerOption answerOption) {
    workspaceMaterialMultiSelectFieldAnswerOptionDAO.delete(answerOption);
  }
  
  /* FileField */
  
  public WorkspaceMaterialFileFieldAnswer createWorkspaceMaterialFileFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialFileFieldAnswerDAO.create(field, reply);
  }

  public WorkspaceMaterialFileFieldAnswer findWorkspaceMaterialFileFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialFileFieldAnswerDAO.findByQueryFieldAndReply(field, reply);
  }
  
  /* FileFieldFile */

  public WorkspaceMaterialFileFieldAnswerFile createWorkspaceMaterialFileFieldAnswerFile(WorkspaceMaterialFileFieldAnswer fieldAnswer, byte[] content, String contentType, String fileId, String fileName) {
    return workspaceMaterialFileFieldAnswerFileDAO.create(fieldAnswer, content, contentType, fileId, fileName);
  }

  public WorkspaceMaterialFileFieldAnswerFile findWorkspaceMaterialFileFieldAnswerFileByFileId(String fileId) {
    return workspaceMaterialFileFieldAnswerFileDAO.findByFileId(fileId);
  }
  
  public List<WorkspaceMaterialFileFieldAnswerFile> listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer(WorkspaceMaterialFileFieldAnswer fieldAnswer) {
    return workspaceMaterialFileFieldAnswerFileDAO.listByFieldAnswer(fieldAnswer);
  }
  
  public void deleteWorkspaceMaterialFileFieldAnswerFile(WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile) {
    workspaceMaterialFileFieldAnswerFileDAO.delete(fieldAnswerFile);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateWorkspaceMaterialFileFieldAnswerFileFileId(WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile, String fileId) {
    return workspaceMaterialFileFieldAnswerFileDAO.updateFileId(fieldAnswerFile, fileId);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateWorkspaceMaterialFileFieldAnswerFileContentType(WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile, String contentType) {
    return workspaceMaterialFileFieldAnswerFileDAO.updateContentType(fieldAnswerFile, contentType);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateWorkspaceMaterialFileFieldAnswerFileFileName(WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile, String fileName) {
    return workspaceMaterialFileFieldAnswerFileDAO.updateFileName(fieldAnswerFile, fileName);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateWorkspaceMaterialFileFieldAnswerFileContent(WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile, byte[] content) {
    return workspaceMaterialFileFieldAnswerFileDAO.updateContent(fieldAnswerFile, content);
  }
  
}

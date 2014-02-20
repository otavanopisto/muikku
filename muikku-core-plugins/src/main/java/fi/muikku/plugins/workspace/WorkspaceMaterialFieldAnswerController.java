package fi.muikku.plugins.workspace;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialChecklistFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialChecklistFieldAnswerOptionDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialConnectFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerFileDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialSelectFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialTextFieldAnswerDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

public class WorkspaceMaterialFieldAnswerController {

  @Inject
  private WorkspaceMaterialFieldAnswerDAO workspaceMaterialFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialTextFieldAnswerDAO workspaceMaterialTextFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialSelectFieldAnswerDAO workspaceMaterialSelectFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialConnectFieldAnswerDAO workspaceMaterialConnectFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialChecklistFieldAnswerDAO workspaceMaterialChecklistFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialChecklistFieldAnswerOptionDAO workspaceMaterialChecklistFieldAnswerOptionDAO;

  @Inject
  private WorkspaceMaterialFileFieldAnswerDAO workspaceMaterialFileFieldAnswerDAO;

  @Inject
  private WorkspaceMaterialFileFieldAnswerFileDAO workspaceMaterialFileFieldAnswerFileDAO;
  
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
  
  /* ChecklistField */
  
  public WorkspaceMaterialChecklistFieldAnswer createWorkspaceMaterialChecklistFieldAnswer(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialChecklistFieldAnswerDAO.create(field, reply);
  }

  public WorkspaceMaterialChecklistFieldAnswer findWorkspaceMaterialChecklistFieldAnswerByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    return workspaceMaterialChecklistFieldAnswerDAO.findByQueryFieldAndReply(field, reply);
  }
  
  /* ChecklistFieldOption */

  public WorkspaceMaterialChecklistFieldAnswerOption createWorkspaceMaterialChecklistFieldAnswerOption(WorkspaceMaterialChecklistFieldAnswer fieldAnswer,
      QueryChecklistFieldOption option) {
    return workspaceMaterialChecklistFieldAnswerOptionDAO.create(fieldAnswer, option);
  }
  
  public WorkspaceMaterialChecklistFieldAnswerOption findWorkspaceMaterialChecklistFieldAnswerOptionByFieldAnswerAndOption(
      WorkspaceMaterialChecklistFieldAnswer fieldAnswer, QueryChecklistFieldOption option) {
    return workspaceMaterialChecklistFieldAnswerOptionDAO.findByFieldAnswerAndOption(fieldAnswer, option);
  }

  public List<WorkspaceMaterialChecklistFieldAnswerOption> listWorkspaceMaterialChecklistFieldAnswerOptions(WorkspaceMaterialChecklistFieldAnswer fieldAnsewr) {
    return workspaceMaterialChecklistFieldAnswerOptionDAO.listByFieldAnswer(fieldAnsewr);
  }

  public void deleteWorkspaceMaterialChecklistFieldAnswerOption(WorkspaceMaterialChecklistFieldAnswerOption answerOption) {
    workspaceMaterialChecklistFieldAnswerOptionDAO.delete(answerOption);
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

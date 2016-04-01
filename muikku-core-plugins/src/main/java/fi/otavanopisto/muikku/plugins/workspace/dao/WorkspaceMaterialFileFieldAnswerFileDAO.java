package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;

public class WorkspaceMaterialFileFieldAnswerFileDAO extends CorePluginsDAO<WorkspaceMaterialFileFieldAnswerFile> {
	
  private static final long serialVersionUID = -5555402145066804591L;

  public WorkspaceMaterialFileFieldAnswerFile create(WorkspaceMaterialFileFieldAnswer fieldAnswer, byte[] content, String contentType, String fileId, String fileName) {
    WorkspaceMaterialFileFieldAnswerFile workspaceMaterialFileFieldAnswerFile = new WorkspaceMaterialFileFieldAnswerFile();
		
		workspaceMaterialFileFieldAnswerFile.setFieldAnswer(fieldAnswer);
		workspaceMaterialFileFieldAnswerFile.setContent(content);
		workspaceMaterialFileFieldAnswerFile.setContentType(contentType);
		workspaceMaterialFileFieldAnswerFile.setFileId(fileId);
		workspaceMaterialFileFieldAnswerFile.setFileName(fileName);
		
		return persist(workspaceMaterialFileFieldAnswerFile);
	}
  
  public WorkspaceMaterialFileFieldAnswerFile findByFileId(String fileId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialFileFieldAnswerFile> criteria = criteriaBuilder.createQuery(WorkspaceMaterialFileFieldAnswerFile.class);
    Root<WorkspaceMaterialFileFieldAnswerFile> root = criteria.from(WorkspaceMaterialFileFieldAnswerFile.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialFileFieldAnswerFile_.fileId), fileId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceMaterialFileFieldAnswerFile> listByFieldAnswer(WorkspaceMaterialFileFieldAnswer fieldAnswer) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialFileFieldAnswerFile> criteria = criteriaBuilder.createQuery(WorkspaceMaterialFileFieldAnswerFile.class);
    Root<WorkspaceMaterialFileFieldAnswerFile> root = criteria.from(WorkspaceMaterialFileFieldAnswerFile.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialFileFieldAnswerFile_.fieldAnswer), fieldAnswer)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterialFileFieldAnswerFile updateFileId(WorkspaceMaterialFileFieldAnswerFile workspaceMaterialFileFieldAnswerFile, String fileId) {
    workspaceMaterialFileFieldAnswerFile.setFileId(fileId);
    return persist(workspaceMaterialFileFieldAnswerFile);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateFileName(WorkspaceMaterialFileFieldAnswerFile workspaceMaterialFileFieldAnswerFile, String fileName) {
    workspaceMaterialFileFieldAnswerFile.setFileName(fileName);
    return persist(workspaceMaterialFileFieldAnswerFile);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateContentType(WorkspaceMaterialFileFieldAnswerFile workspaceMaterialFileFieldAnswerFile, String contentType) {
    workspaceMaterialFileFieldAnswerFile.setContentType(contentType);
    return persist(workspaceMaterialFileFieldAnswerFile);
  }

  public WorkspaceMaterialFileFieldAnswerFile updateContent(WorkspaceMaterialFileFieldAnswerFile workspaceMaterialFileFieldAnswerFile, byte[] content) {
    workspaceMaterialFileFieldAnswerFile.setContent(content);
    return persist(workspaceMaterialFileFieldAnswerFile);
  }
  
  @Override
  public void delete(WorkspaceMaterialFileFieldAnswerFile workspaceMaterialFileFieldAnswerFile) {
    super.delete(workspaceMaterialFileFieldAnswerFile);
  }
  
}

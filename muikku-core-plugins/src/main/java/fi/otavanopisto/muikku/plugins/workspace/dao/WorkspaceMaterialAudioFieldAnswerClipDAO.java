package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip;

public class WorkspaceMaterialAudioFieldAnswerClipDAO extends CorePluginsDAO<WorkspaceMaterialAudioFieldAnswerClip> {
	
  private static final long serialVersionUID = 301699581963302519L;

  public WorkspaceMaterialAudioFieldAnswerClip create(WorkspaceMaterialAudioFieldAnswer fieldAnswer, byte[] content, String contentType, String clipId, String fileName) {
    WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip = new WorkspaceMaterialAudioFieldAnswerClip();
		
		workspaceMaterialAudioFieldAnswerClip.setFieldAnswer(fieldAnswer);
		workspaceMaterialAudioFieldAnswerClip.setContent(content);
		workspaceMaterialAudioFieldAnswerClip.setContentType(contentType);
		workspaceMaterialAudioFieldAnswerClip.setClipId(clipId);
		workspaceMaterialAudioFieldAnswerClip.setFileName(fileName);
		
		return persist(workspaceMaterialAudioFieldAnswerClip);
	}
  
  public WorkspaceMaterialAudioFieldAnswerClip findByClipId(String clipId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialAudioFieldAnswerClip> criteria = criteriaBuilder.createQuery(WorkspaceMaterialAudioFieldAnswerClip.class);
    Root<WorkspaceMaterialAudioFieldAnswerClip> root = criteria.from(WorkspaceMaterialAudioFieldAnswerClip.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialAudioFieldAnswerClip_.clipId), clipId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceMaterialAudioFieldAnswerClip> listByFieldAnswer(WorkspaceMaterialAudioFieldAnswer fieldAnswer) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialAudioFieldAnswerClip> criteria = criteriaBuilder.createQuery(WorkspaceMaterialAudioFieldAnswerClip.class);
    Root<WorkspaceMaterialAudioFieldAnswerClip> root = criteria.from(WorkspaceMaterialAudioFieldAnswerClip.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialAudioFieldAnswerClip_.fieldAnswer), fieldAnswer)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterialAudioFieldAnswerClip updateClipId(WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip, String clipId) {
    workspaceMaterialAudioFieldAnswerClip.setClipId(clipId);
    return persist(workspaceMaterialAudioFieldAnswerClip);
  }

  public WorkspaceMaterialAudioFieldAnswerClip updateFileName(WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip, String fileName) {
    workspaceMaterialAudioFieldAnswerClip.setFileName(fileName);
    return persist(workspaceMaterialAudioFieldAnswerClip);
  }

  public WorkspaceMaterialAudioFieldAnswerClip updateContentType(WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip, String contentType) {
    workspaceMaterialAudioFieldAnswerClip.setContentType(contentType);
    return persist(workspaceMaterialAudioFieldAnswerClip);
  }

  public WorkspaceMaterialAudioFieldAnswerClip updateContent(WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip, byte[] content) {
    workspaceMaterialAudioFieldAnswerClip.setContent(content);
    return persist(workspaceMaterialAudioFieldAnswerClip);
  }
  
  @Override
  public void delete(WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip) {
    super.delete(workspaceMaterialAudioFieldAnswerClip);
  }
  
}

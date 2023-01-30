package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceJournalFeedback;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceJournalFeedback_;

public class WorkspaceJournalFeedbackDAO extends CorePluginsDAO<WorkspaceJournalFeedback> {


  private static final long serialVersionUID = -7709755324421536373L;

  public WorkspaceJournalFeedback create(Long studentEntityId, String feedback, Long workspaceEntityId, Long creator) {
    WorkspaceJournalFeedback journalFeedback = new WorkspaceJournalFeedback();
    
    journalFeedback.setStudent(studentEntityId);
    journalFeedback.setCreator(creator);
    journalFeedback.setCreated(new Date());
    journalFeedback.setWorkspaceEntityId(workspaceEntityId);
    journalFeedback.setFeedback(feedback);
    return persist(journalFeedback);
  }
  
  public WorkspaceJournalFeedback updateFeedback(WorkspaceJournalFeedback journalFeedback, String feedback) {
    journalFeedback.setFeedback(feedback);
    return persist(journalFeedback);
  }

  public WorkspaceJournalFeedback findByStudentAndWorkspace(Long studentEntityId, Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalFeedback> criteria = criteriaBuilder.createQuery(WorkspaceJournalFeedback.class);
    Root<WorkspaceJournalFeedback> root = criteria.from(WorkspaceJournalFeedback.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceJournalFeedback_.student), studentEntityId),
            criteriaBuilder.equal(root.get(WorkspaceJournalFeedback_.workspaceEntityId), workspaceEntityId)
          )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(WorkspaceJournalFeedback e) {
    super.delete(e);
  }
}
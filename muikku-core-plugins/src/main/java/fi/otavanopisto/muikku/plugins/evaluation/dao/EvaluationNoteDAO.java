package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.EvaluationNote;
import fi.otavanopisto.muikku.plugins.evaluation.model.EvaluationNote_;

public class EvaluationNoteDAO extends CorePluginsDAO<EvaluationNote> {
  
  private static final long serialVersionUID = 6908820355669025446L;

  public EvaluationNote create(Long student, Long creator, Long workspaceEntityId, String note, Date created){
    EvaluationNote evaluationNote = new EvaluationNote();
    evaluationNote.setCreator(creator);
    evaluationNote.setUserEntityId(student);
    evaluationNote.setNote(note);
    evaluationNote.setWorkspaceEntityId(workspaceEntityId);
    evaluationNote.setCreated(created);
    evaluationNote.setArchived(Boolean.FALSE);
    return persist(evaluationNote);
  }
  
  public EvaluationNote update(EvaluationNote evaluationNote, String note, Long lastModifier, Date lastModified){
    evaluationNote.setNote(note);
    evaluationNote.setLastModifier(lastModifier);
    evaluationNote.setLastModified(lastModified);
    return persist(evaluationNote);
  }
  
  public List<EvaluationNote> listByStudentAndWorkspaceAndArchived(Long student, Long workspaceEntityId, Boolean archived){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EvaluationNote> criteria = criteriaBuilder.createQuery(EvaluationNote.class);
    
    Root<EvaluationNote> root = criteria.from(EvaluationNote.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(EvaluationNote_.userEntityId), student),
      criteriaBuilder.equal(root.get(EvaluationNote_.workspaceEntityId), workspaceEntityId),
      criteriaBuilder.equal(root.get(EvaluationNote_.archived), archived)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public Long countByStudentAndWorkspace(Long student, Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<EvaluationNote> root = criteria.from(EvaluationNote.class);
    
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(EvaluationNote_.userEntityId), student),
            criteriaBuilder.equal(root.get(EvaluationNote_.workspaceEntityId), workspaceEntityId),
            criteriaBuilder.equal(root.get(EvaluationNote_.archived), false)
        )
    );
   
    return entityManager.createQuery(criteria).getSingleResult();
}
  
  
  public EvaluationNote setArchived(EvaluationNote evaluationNote, Boolean archived) {
    evaluationNote.setArchived(archived);
    getEntityManager().persist(evaluationNote);
    return evaluationNote;
  }
}

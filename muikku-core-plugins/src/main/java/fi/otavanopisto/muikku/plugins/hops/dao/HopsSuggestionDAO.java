package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion_;

public class HopsSuggestionDAO  extends CorePluginsDAO<HopsSuggestion>{

  private static final long serialVersionUID = 5746392088055973392L;
  
  public HopsSuggestion create(String studentIdentifier, String subject, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = new HopsSuggestion();

    hopsSuggestion.setStudentIdentifier(studentIdentifier);
    hopsSuggestion.setSubject(subject);
    hopsSuggestion.setCourseNumber(courseNumber);
    hopsSuggestion.setWorkspaceEntityId(workspaceEntityId);
    hopsSuggestion.setCreated(new Date());
    
    return persist(hopsSuggestion);
  }
  
  public HopsSuggestion update(HopsSuggestion hopsSuggestion, String studentIdentifier, String subject, Integer courseNumber, Long workspaceEntityId) {
    hopsSuggestion.setStudentIdentifier(studentIdentifier);
    hopsSuggestion.setSubject(subject);
    hopsSuggestion.setCourseNumber(courseNumber);
    hopsSuggestion.setWorkspaceEntityId(workspaceEntityId);
    hopsSuggestion.setCreated(new Date());
    
    return persist(hopsSuggestion);
  }
  
  public List<HopsSuggestion> listByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsSuggestion> criteria = criteriaBuilder.createQuery(HopsSuggestion.class);
    Root<HopsSuggestion> root = criteria.from(HopsSuggestion.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsSuggestion_.studentIdentifier), studentIdentifier)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public HopsSuggestion findByStudentIdentifierAndSubjectAndCourseNumber(String studentIdentifier, String subject, Integer courseNumber) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsSuggestion> criteria = criteriaBuilder.createQuery(HopsSuggestion.class);
    Root<HopsSuggestion> root = criteria.from(HopsSuggestion.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsSuggestion_.studentIdentifier), studentIdentifier),
        criteriaBuilder.equal(root.get(HopsSuggestion_.subject), subject),
        criteriaBuilder.equal(root.get(HopsSuggestion_.courseNumber), courseNumber)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(HopsSuggestion hopsSuggestion) {
    super.delete(hopsSuggestion);
  }

}

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

public class HopsSuggestionDAO extends CorePluginsDAO<HopsSuggestion> {

  private static final long serialVersionUID = 5746392088055973392L;
  
  public HopsSuggestion create(Long userEntityId, String category, String subject, String type, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = new HopsSuggestion();

    hopsSuggestion.setUserEntityId(userEntityId);
    hopsSuggestion.setCategory(category);
    hopsSuggestion.setSubject(subject);
    hopsSuggestion.setCourseNumber(courseNumber);
    hopsSuggestion.setType(type);
    hopsSuggestion.setWorkspaceEntityId(workspaceEntityId);
    hopsSuggestion.setCreated(new Date());
    
    return persist(hopsSuggestion);
  }
  
  public HopsSuggestion update(HopsSuggestion hopsSuggestion, String subject, String type, Integer courseNumber, Long workspaceEntityId) {
    hopsSuggestion.setSubject(subject);
    hopsSuggestion.setType(type);
    hopsSuggestion.setCourseNumber(courseNumber);
    hopsSuggestion.setWorkspaceEntityId(workspaceEntityId);
    hopsSuggestion.setCreated(new Date());
    
    return persist(hopsSuggestion);
  }
  
  public List<HopsSuggestion> listByUserEntityIdAndCategory(Long userEntityId, String category) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsSuggestion> criteria = criteriaBuilder.createQuery(HopsSuggestion.class);
    Root<HopsSuggestion> root = criteria.from(HopsSuggestion.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsSuggestion_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(HopsSuggestion_.category), category)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public HopsSuggestion findByUserEntityIdAndCategoryAndSubjectAndCourseNumberAndWorkspaceEntityId(Long userEntityId, String category,
      String subject, Integer courseNumber, Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsSuggestion> criteria = criteriaBuilder.createQuery(HopsSuggestion.class);
    Root<HopsSuggestion> root = criteria.from(HopsSuggestion.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsSuggestion_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(HopsSuggestion_.category), category),
        criteriaBuilder.equal(root.get(HopsSuggestion_.subject), subject),
        criteriaBuilder.equal(root.get(HopsSuggestion_.courseNumber), courseNumber),
        criteriaBuilder.equal(root.get(HopsSuggestion_.workspaceEntityId), workspaceEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(HopsSuggestion hopsSuggestion) {
    super.delete(hopsSuggestion);
  }
  
  // TODO Remove after conversion
  public HopsSuggestion updateOwner(HopsSuggestion hopsSuggestion, Long userEntityId, String category) {
    hopsSuggestion.setUserEntityId(userEntityId);
    hopsSuggestion.setCategory(category);
    return persist(hopsSuggestion);
  }

}

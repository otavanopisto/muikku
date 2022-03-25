package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory_;

public class HopsHistoryDAO extends CorePluginsDAO<HopsHistory> {

  private static final long serialVersionUID = -6729260246394093969L;

  public HopsHistory create(String studentIdentifier, Date date, String lastModifier, String details) {
    EntityManager entityManager = getEntityManager();
    
    HopsHistory hopsHistory = new HopsHistory();
    hopsHistory.setStudentIdentifier(studentIdentifier);
    hopsHistory.setDate(date);
    hopsHistory.setModifier(lastModifier);
    hopsHistory.setDetails(details);
    
    entityManager.persist(hopsHistory);

    return hopsHistory;
  }
  
  public HopsHistory update(HopsHistory history, String details) {
    history.setDetails(details);
    return persist(history);
  }

  public List<HopsHistory> listByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsHistory> criteria = criteriaBuilder.createQuery(HopsHistory.class);
    Root<HopsHistory> root = criteria.from(HopsHistory.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsHistory_.studentIdentifier), studentIdentifier)
    );

    List<HopsHistory> hopsHistory = entityManager.createQuery(criteria).getResultList();
    
    // Sort latest to oldest
    hopsHistory.sort(Comparator.comparing(HopsHistory::getDate).reversed());

    return hopsHistory;
  }

}

package fi.otavanopisto.muikku.plugins.guidancerequest;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.guidancerequest.GuidanceRequest_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.guidancerequest.GuidanceRequest;



public class GuidanceRequestDAO extends CorePluginsDAO<GuidanceRequest> {

  private static final long serialVersionUID = 5884840541037285345L;

  public GuidanceRequest create(UserEntity student, Date date, String message) {
    GuidanceRequest assessmentRequest = new GuidanceRequest();
    
    assessmentRequest.setStudent(student.getId());
    assessmentRequest.setDate(date);
    assessmentRequest.setMessage(message);
    
    getEntityManager().persist(assessmentRequest);
    
    return assessmentRequest;
  }

  public List<GuidanceRequest> listByStudent(UserEntity student) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<GuidanceRequest> criteria = criteriaBuilder.createQuery(GuidanceRequest.class);
    Root<GuidanceRequest> root = criteria.from(GuidanceRequest.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(GuidanceRequest_.student), student.getId()));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  
}

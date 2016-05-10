package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagShare;
import fi.otavanopisto.muikku.model.users.FlagShare_;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;

public class FlagShareDAO extends CoreDAO<FlagShare> {

  private static final long serialVersionUID = 1350239315051902573L;

  public FlagShare create(Flag flag, UserSchoolDataIdentifier userIdentifier) {
    FlagShare flagShare = new FlagShare();
    flagShare.setFlag(flag);
    flagShare.setUserIdentifier(userIdentifier);
    
    return persist(flagShare);
  }

  public FlagShare findByFlagAndUserIdentifier(Flag flag, UserSchoolDataIdentifier userIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FlagShare> criteria = criteriaBuilder.createQuery(FlagShare.class);
    Root<FlagShare> root = criteria.from(FlagShare.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FlagShare_.flag), flag),
      criteriaBuilder.equal(root.get(FlagShare_.userIdentifier), userIdentifier)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<FlagShare> listByUserIdentifier(UserSchoolDataIdentifier userIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FlagShare> criteria = criteriaBuilder.createQuery(FlagShare.class);
    Root<FlagShare> root = criteria.from(FlagShare.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FlagShare_.userIdentifier), userIdentifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Flag> listFlagsByUserIdentifier(UserSchoolDataIdentifier userIdentifier) {
  EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Flag> criteria = criteriaBuilder.createQuery(Flag.class);
    Root<FlagShare> root = criteria.from(FlagShare.class);
    criteria.select(root.get(FlagShare_.flag));
    criteria.where(
      criteriaBuilder.equal(root.get(FlagShare_.userIdentifier), userIdentifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(FlagShare e) {
    super.delete(e);
  }
  
}

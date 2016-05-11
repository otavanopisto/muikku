package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.Flag_;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;

public class FlagDAO extends CoreDAO<Flag> {

  private static final long serialVersionUID = -7968339735790766659L;

  public Flag create(UserSchoolDataIdentifier ownerIdentifier, String name, String color, String description, Boolean archived) {
    Flag flag = new Flag();
    flag.setOwnerIdentifier(ownerIdentifier);
    flag.setArchived(archived);
    flag.setColor(color);
    flag.setDescription(description);
    flag.setName(name);
    
    return persist(flag);
  }

  public List<Flag> listByOwnerIdentifier(UserSchoolDataIdentifier ownerIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Flag> criteria = criteriaBuilder.createQuery(Flag.class);
    Root<Flag> root = criteria.from(Flag.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(Flag_.ownerIdentifier), ownerIdentifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public Flag updateName(Flag flag, String name) {
    flag.setName(name);
    return persist(flag);
  }

  public Flag updateDescription(Flag flag, String description) {
    flag.setDescription(description);
    return persist(flag);
  }

  public Flag updateColor(Flag flag, String color) {
    flag.setColor(color);
    return persist(flag);
  }

  @Override
  public void delete(Flag e) {
    super.delete(e);
  }
  
}

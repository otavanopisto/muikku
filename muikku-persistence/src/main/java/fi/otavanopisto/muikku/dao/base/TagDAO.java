package fi.otavanopisto.muikku.dao.base;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.base.Tag_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.Tag;

public class TagDAO extends CoreDAO<Tag> {

  private static final long serialVersionUID = -5007065411167102131L;

  public Tag create(String text) {
    Tag tag = new Tag();
    
    tag.setText(text);
    
    getEntityManager().persist(tag);
    return tag;
  }

  public Tag findByText(String text) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Tag> criteria = criteriaBuilder.createQuery(Tag.class);
    Root<Tag> root = criteria.from(Tag.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Tag_.text), text)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}

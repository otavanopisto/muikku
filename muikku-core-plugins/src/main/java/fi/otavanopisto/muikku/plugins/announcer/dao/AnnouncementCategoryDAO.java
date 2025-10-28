package fi.otavanopisto.muikku.plugins.announcer.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementCategory;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementCategory_;

public class AnnouncementCategoryDAO extends CorePluginsDAO<AnnouncementCategory> {
	
  private static final long serialVersionUID = -3741200400638046071L;

  public AnnouncementCategory create(String categoryName) {
    AnnouncementCategory announcementCategory = new AnnouncementCategory();
    announcementCategory.setCategoryName(categoryName);
    
    return persist(announcementCategory);
 }
  
  public AnnouncementCategory findByName(String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementCategory> criteria = criteriaBuilder.createQuery(AnnouncementCategory.class);
    Root<AnnouncementCategory> root = criteria.from(AnnouncementCategory.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AnnouncementCategory_.categoryName), name));

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public void delete(AnnouncementCategory announcementCategory){
    super.delete(announcementCategory);
  }
}

package fi.otavanopisto.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup_;

public class ForumAreaGroupDAO extends CorePluginsDAO<ForumAreaGroup> {

	private static final long serialVersionUID = -8797157252142681349L;

  public ForumAreaGroup create(String name, Boolean archived) {
	  ForumAreaGroup forumAreaGroup = new ForumAreaGroup();

	  forumAreaGroup.setName(name);
		forumAreaGroup.setArchived(archived);

		getEntityManager().persist(forumAreaGroup);

		return forumAreaGroup;
	}
  
  public List<ForumAreaGroup> listUnArchived() {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumAreaGroup> criteria = criteriaBuilder.createQuery(ForumAreaGroup.class);
    Root<ForumAreaGroup> root = criteria.from(ForumAreaGroup.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(ForumAreaGroup_.archived), Boolean.FALSE)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(ForumAreaGroup forumAreaGroup) {
    super.delete(forumAreaGroup);
  }

  public ForumAreaGroup updateArchived(ForumAreaGroup forumAreaGroup, Boolean archived) {
    forumAreaGroup.setArchived(archived);
    return persist(forumAreaGroup);
  }
  
}

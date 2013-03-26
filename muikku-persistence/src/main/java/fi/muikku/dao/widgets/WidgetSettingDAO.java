package fi.muikku.dao.widgets;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.widgets.WidgetSetting;
import fi.muikku.model.widgets.WidgetSetting_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class WidgetSettingDAO extends CoreDAO<WidgetSetting> {

	private static final long serialVersionUID = -4014980522728539961L;

	public WidgetSetting findByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WidgetSetting> criteria = criteriaBuilder.createQuery(WidgetSetting.class);
    Root<WidgetSetting> root = criteria.from(WidgetSetting.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WidgetSetting_.name), name)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
}

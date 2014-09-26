package fi.muikku.dao.widgets;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.widgets.LocatedWidgetSetting;
import fi.muikku.model.widgets.LocatedWidgetSetting_;
import fi.muikku.model.widgets.UserWidget;
import fi.muikku.model.widgets.WidgetSetting;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class LocatedWidgetSettingDAO extends CoreDAO<LocatedWidgetSetting> {

	private static final long serialVersionUID = -3901166698540069245L;

	public LocatedWidgetSetting findByUserWidgetAndWidgetSetting(UserWidget userWidget, WidgetSetting widgetSetting) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocatedWidgetSetting> criteria = criteriaBuilder.createQuery(LocatedWidgetSetting.class);
    Root<LocatedWidgetSetting> root = criteria.from(LocatedWidgetSetting.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(LocatedWidgetSetting_.locatedWidget), userWidget),
            criteriaBuilder.equal(root.get(LocatedWidgetSetting_.widgetSetting), widgetSetting)
        )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<LocatedWidgetSetting> listByUserWidget(UserWidget userWidget) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocatedWidgetSetting> criteria = criteriaBuilder.createQuery(LocatedWidgetSetting.class);
    Root<LocatedWidgetSetting> root = criteria.from(LocatedWidgetSetting.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(LocatedWidgetSetting_.locatedWidget), userWidget)
    );
   
    return entityManager.createQuery(criteria).getResultList();

  }
}

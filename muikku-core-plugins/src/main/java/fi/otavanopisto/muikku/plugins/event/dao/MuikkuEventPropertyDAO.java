package fi.otavanopisto.muikku.plugins.event.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventProperty;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventProperty_;

public class MuikkuEventPropertyDAO extends CorePluginsDAO<MuikkuEventProperty> {
  
  private static final long serialVersionUID = 4485591072319343411L;

  public MuikkuEventProperty create(MuikkuEvent event, String name, String value, Long userEntityId) {
    MuikkuEventProperty property = new MuikkuEventProperty();
    property.setDate(new Date());
    property.setEvent(event);
    property.setName(name);
    property.setValue(value);
    property.setUserEntityId(userEntityId);
    return persist(property);
  }

  public MuikkuEventProperty update(Date date, String name, String value) {
    MuikkuEventProperty property = new MuikkuEventProperty();
    property.setName(name);
    property.setValue(value);
    return persist(property);
  }
  
  public List<MuikkuEventProperty> listByEvent(MuikkuEvent event) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEventProperty> criteria = criteriaBuilder.createQuery(MuikkuEventProperty.class);
    Root<MuikkuEventProperty> root = criteria.from(MuikkuEventProperty.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(MuikkuEventProperty_.muikkuEvent), event)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(MuikkuEventProperty property) {
    super.delete(property);
  }
  
}

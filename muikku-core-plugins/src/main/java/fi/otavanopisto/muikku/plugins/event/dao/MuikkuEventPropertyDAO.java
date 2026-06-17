package fi.otavanopisto.muikku.plugins.event.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.event.MuikkuEvent;
import fi.otavanopisto.muikku.model.event.MuikkuEventProperty;
import fi.otavanopisto.muikku.model.event.MuikkuEventProperty_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;

public class MuikkuEventPropertyDAO extends CorePluginsDAO<MuikkuEventProperty> {
  
  private static final long serialVersionUID = 8030047653752297087L;

  public MuikkuEventProperty create(MuikkuEvent event, String name, String value, Long userEntityId, Date date) {
    MuikkuEventProperty property = new MuikkuEventProperty();
    property.setCreated(date);
    property.setEvent(event);
    property.setName(name);
    property.setValue(value);
    property.setUserEntityId(userEntityId);
    return persist(property);
  }

  public MuikkuEventProperty update(MuikkuEventProperty property, String value, Date updated) {
    property.setValue(value);
    property.setUpdated(updated);
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

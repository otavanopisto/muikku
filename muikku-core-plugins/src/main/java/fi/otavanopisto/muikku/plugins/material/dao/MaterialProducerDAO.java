package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.MaterialProducer;
import fi.otavanopisto.muikku.plugins.material.model.MaterialProducer_;

public class MaterialProducerDAO extends CorePluginsDAO<MaterialProducer> {

  private static final long serialVersionUID = -3784496090120517610L;

  public MaterialProducer create(Material material, String name) {
    MaterialProducer materialProducer = new MaterialProducer();
    
    materialProducer.setName(name);
    materialProducer.setMaterial(material);
    
    return persist(materialProducer);
  }

  public List<MaterialProducer> listByMaterial(Material material) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MaterialProducer> criteria = criteriaBuilder.createQuery(MaterialProducer.class);
    Root<MaterialProducer> root = criteria.from(MaterialProducer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(MaterialProducer_.material), material)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(MaterialProducer materialProducer) {
    super.delete(materialProducer);
  }
}
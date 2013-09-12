package fi.muikku.dao.material;

import java.util.Calendar;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.material.Material;
import fi.muikku.model.material.Material_;
import fi.muikku.model.users.UserEntity;

public class MaterialDAO extends CoreDAO<Material> {
  
  /**
   * 
   */
  private static final long serialVersionUID = -4182497624872407751L;
  
  public Material create(String type, String characterData, byte[] binaryData) {
    return create(type, "", null, characterData, binaryData);
  }

  public Material create(String type,
                         String title,
                         UserEntity creator,
                         String characterData,
                         byte[] binaryData) {
    Material material = new Material();
    material.setType(type);
    material.setCharacterData(characterData);
    material.setBinaryData(binaryData);
    material.setTitle(title);
    material.setCreated(Calendar.getInstance().getTime());
    material.setEdited(Calendar.getInstance().getTime());
    getEntityManager().persist(material);
    return material;
  }
  
  public void delete(Material material) {
    super.delete(material);
  }
  
  public Material findByUrlName(String urlName) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Material> criteria = criteriaBuilder.createQuery(Material.class);
    Root<Material> root = criteria.from(Material.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Material_.urlName), urlName)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public Material updateCharacterData(Material material, String characterData) {
    material.setCharacterData(characterData);
    getEntityManager().persist(material);
    return material;
  }
}
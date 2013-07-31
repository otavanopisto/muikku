package fi.muikku.dao.material;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.material.Material;

public class MaterialDAO extends CoreDAO<Material> {
  
  /**
   * 
   */
  private static final long serialVersionUID = -4182497624872407751L;

  public Material create(String type, String characterData, byte[] binaryData) {
    Material material = new Material();
    material.setType(type);
    material.setCharacterData(characterData);
    material.setBinaryData(binaryData);
    getEntityManager().persist(material);
    return material;
  }
  
  public void delete(Material material) {
    super.delete(material);
  }

}

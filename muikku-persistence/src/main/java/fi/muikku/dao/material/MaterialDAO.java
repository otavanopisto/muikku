package fi.muikku.dao.material;

import java.util.Calendar;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.material.Material;
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

}

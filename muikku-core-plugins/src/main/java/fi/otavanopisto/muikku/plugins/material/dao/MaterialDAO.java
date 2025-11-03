package fi.otavanopisto.muikku.plugins.material.dao;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class MaterialDAO extends CorePluginsDAO<Material> {

	private static final long serialVersionUID = 148925841493479490L;

  public Material updateLicense(Material material, String license) {
    material.setLicense(license);
    return persist(material);
  }

  public Material updateViewRestrict(Material material, MaterialViewRestrict viewRestrict) {
    material.setViewRestrict(viewRestrict);
    return persist(material);
  }

  public void delete(Material material) {
    super.delete(material);
  }
	
}
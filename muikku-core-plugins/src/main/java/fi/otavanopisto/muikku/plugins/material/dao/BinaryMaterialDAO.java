package fi.otavanopisto.muikku.plugins.material.dao;

import fi.otavanopisto.muikku.model.material.BinaryMaterial;
import fi.otavanopisto.muikku.model.material.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;

public class BinaryMaterialDAO extends CorePluginsDAO<BinaryMaterial> {

  private static final long serialVersionUID = -1938438840419871131L;

  public BinaryMaterial create(String title, String contentType, byte[] content, String license, MaterialViewRestrict viewRestrict) {
    BinaryMaterial binaryMaterial = new BinaryMaterial();
    binaryMaterial.setContent(content);
    binaryMaterial.setContentType(contentType);
    binaryMaterial.setTitle(title);
    binaryMaterial.setLicense(license);
    binaryMaterial.setViewRestrict(viewRestrict);
    return persist(binaryMaterial);
  }

	public BinaryMaterial updateContent(BinaryMaterial binaryMaterial, byte[] content) {
		binaryMaterial.setContent(content);
		return persist(binaryMaterial);
	}
	
	public void delete(BinaryMaterial binaryMaterial) {
	  super.delete(binaryMaterial);
	}
}

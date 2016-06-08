package fi.otavanopisto.muikku.plugins.material.dao;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class BinaryMaterialDAO extends CorePluginsDAO<BinaryMaterial> {

  private static final long serialVersionUID = -1938438840419871131L;

  public BinaryMaterial create(String title, String contentType, byte[] content, BinaryMaterial originMaterial, String license, MaterialViewRestrict viewRestrict) {
    BinaryMaterial binaryMaterial = new BinaryMaterial();
    binaryMaterial.setContent(content);
    binaryMaterial.setContentType(contentType);
    binaryMaterial.setTitle(title);
    binaryMaterial.setOriginMaterial(originMaterial);
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

package fi.otavanopisto.muikku.plugins.material.dao;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialDAO extends CorePluginsDAO<BinaryMaterial> {

  private static final long serialVersionUID = -1938438840419871131L;

  public BinaryMaterial create(String title, String contentType, byte[] content, BinaryMaterial originMaterial, String license) {
    BinaryMaterial binaryMaterial = new BinaryMaterial();
    binaryMaterial.setContent(content);
    binaryMaterial.setContentType(contentType);
    binaryMaterial.setTitle(title);
    binaryMaterial.setOriginMaterial(originMaterial);
    binaryMaterial.setLicense(license);
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

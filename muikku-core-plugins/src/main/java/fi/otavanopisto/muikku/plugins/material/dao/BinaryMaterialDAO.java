package fi.otavanopisto.muikku.plugins.material.dao;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialDAO extends CorePluginsDAO<BinaryMaterial> {

	private static final long serialVersionUID = 1L;

	public BinaryMaterial create(String title, String contentType, byte[] content) {
	  return create(title, contentType, content, null);
	}

	public BinaryMaterial create(String title, String contentType, byte[] content, BinaryMaterial originMaterial) {
    BinaryMaterial binaryMaterial = new BinaryMaterial();
    binaryMaterial.setContent(content);
    binaryMaterial.setContentType(contentType);
    binaryMaterial.setTitle(title);
    binaryMaterial.setOriginMaterial(originMaterial);
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

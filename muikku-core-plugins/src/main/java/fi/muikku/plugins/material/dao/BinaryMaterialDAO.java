package fi.muikku.plugins.material.dao;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialDAO extends PluginDAO<BinaryMaterial> {

	private static final long serialVersionUID = 1L;

	public BinaryMaterial create(String title, String urlName, String contentType, byte[] content) {
		BinaryMaterial binaryMaterial = new BinaryMaterial();
		binaryMaterial.setContent(content);
		binaryMaterial.setContentType(contentType);
		binaryMaterial.setTitle(title);
		binaryMaterial.setType("binary");
		binaryMaterial.setUrlName(urlName);
		
		return persist(binaryMaterial);
	}
	
}

package fi.muikku.plugins.material;

import javax.ejb.Stateless;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.BinaryMaterialDAO;
import fi.muikku.plugins.material.model.BinaryMaterial;

@Dependent
@Stateless
public class BinaryMaterialController {

	@Inject
	private BinaryMaterialDAO binaryMaterialDAO;

	public BinaryMaterial createBinaryMaterial(String title, String urlName, String contentType, byte[] content) {
		return binaryMaterialDAO.create(title, urlName, contentType, content);
	}
	
	public BinaryMaterial finBinaryMaterialById(Long id) {
		return binaryMaterialDAO.findById(id);
	}
	
}

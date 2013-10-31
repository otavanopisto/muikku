package fi.muikku.plugins.material;

import java.io.Serializable;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.binary.Base64;

import fi.muikku.plugins.material.model.BinaryMaterial;

@RequestScoped
@Named
public class BinaryMaterialBackingBean implements Serializable {

	private static final long serialVersionUID = 2036574682182652290L;
  
	@Inject
	private BinaryMaterialController binaryMaterialController;
	
	public String getMaterialContentUrl(Long materialId) {
		BinaryMaterial binaryMaterial = binaryMaterialController.finBinaryMaterialById(materialId);
		if (binaryMaterial != null) {
			return new StringBuilder()
			  .append("data:")
			  .append(binaryMaterial.getContentType())
			  .append(";base64,")
			  .append(Base64.encodeBase64String(binaryMaterial.getContent()))
			  .toString();
		}
		
		return null;
	}
	
}

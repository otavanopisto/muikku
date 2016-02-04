package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.BinaryMaterialDAO;
import fi.muikku.plugins.material.events.BinaryMaterialCreateEvent;
import fi.muikku.plugins.material.events.BinaryMaterialUpdateEvent;
import fi.muikku.plugins.material.model.BinaryMaterial;

@Dependent
@Stateless
public class BinaryMaterialController {

	@Inject
	private BinaryMaterialDAO binaryMaterialDAO;
  
  @Inject
  private Event<BinaryMaterialCreateEvent> materialCreateEvent;

  @Inject
  private Event<BinaryMaterialUpdateEvent> materialUpdateEvent;
  
	public BinaryMaterial createBinaryMaterial(String title, String contentType, byte[] content) {
	  return createBinaryMaterial(title, contentType, content,  null);
	}

	public BinaryMaterial createBinaryMaterial(String title, String contentType, byte[] content, BinaryMaterial originMaterial) {
    BinaryMaterial material = binaryMaterialDAO.create(title, contentType, content, originMaterial);
    materialCreateEvent.fire(new BinaryMaterialCreateEvent(material));
    return material;
  }
	
	public BinaryMaterial findBinaryMaterialById(Long id) {
		return binaryMaterialDAO.findById(id);
	}

	public BinaryMaterial updateBinaryMaterialContent(BinaryMaterial binaryMaterial, byte[] content) {
		BinaryMaterial material = binaryMaterialDAO.updateContent(binaryMaterial, content);
		materialUpdateEvent.fire(new BinaryMaterialUpdateEvent(material));
		return material;
	}
	
	public void deleteBinaryMaterial(BinaryMaterial binaryMaterial) {
	  binaryMaterialDAO.delete(binaryMaterial);
	}
	
}

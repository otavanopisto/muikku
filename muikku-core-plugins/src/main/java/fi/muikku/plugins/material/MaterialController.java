package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.MaterialDAO;
import fi.muikku.plugins.material.model.Material;

@Dependent
@Stateless
public class MaterialController {
  
	@Inject
	private MaterialDAO materialDAO;
	
	public Material findMaterialById(Long id) {
		return materialDAO.findById(id);
	}
	
}

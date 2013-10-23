package fi.muikku.plugins.material;

import javax.ejb.Stateless;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Dependent
@Stateless
public class HtmlMaterialController {

	@Inject
	private HtmlMaterialDAO htmlMaterialDAO;
	
	public HtmlMaterial createHtmlMaterial(String urlName, String title, String html) {
		return htmlMaterialDAO.create(urlName, title, html);
	}
	
	public HtmlMaterial findHtmlMaterialById(Long id) {
		return htmlMaterialDAO.findById(id);
	}
	
}

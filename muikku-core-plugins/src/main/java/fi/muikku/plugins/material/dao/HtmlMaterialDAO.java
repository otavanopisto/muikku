package fi.muikku.plugins.material.dao;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialDAO extends PluginDAO<HtmlMaterial> {
	
	private static final long serialVersionUID = 3344543661453014697L;

	public HtmlMaterial create(String urlName, String title, String html) {
		HtmlMaterial htmlMaterial = new HtmlMaterial();
		
		htmlMaterial.setHtml(html);
		htmlMaterial.setTitle(title);
		htmlMaterial.setUrlName(urlName);
		
		return persist(htmlMaterial);
	}
	
}

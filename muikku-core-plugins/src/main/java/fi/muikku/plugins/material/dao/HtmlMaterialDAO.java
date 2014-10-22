package fi.muikku.plugins.material.dao;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialDAO extends CorePluginsDAO<HtmlMaterial> {
	
	private static final long serialVersionUID = 3344543661453014697L;

	public HtmlMaterial create(String title, String html) {
		return create(title, html, null);
	}

  public HtmlMaterial create(String title, String html, HtmlMaterial originMaterial) {
    HtmlMaterial htmlMaterial = new HtmlMaterial();
    
    htmlMaterial.setHtml(html);
    htmlMaterial.setTitle(title);
    htmlMaterial.setOriginMaterial(originMaterial);
    
    return persist(htmlMaterial);
  }

	public void delete(HtmlMaterial htmlMaterial) {
	  super.delete(htmlMaterial);
	}
	
}

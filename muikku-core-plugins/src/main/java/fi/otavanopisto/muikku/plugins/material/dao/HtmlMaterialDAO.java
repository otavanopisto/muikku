package fi.otavanopisto.muikku.plugins.material.dao;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialDAO extends CorePluginsDAO<HtmlMaterial> {
	
	private static final long serialVersionUID = 3344543661453014697L;

	public HtmlMaterial create(String title, String html, String contentType, Long revisionNumber) {
		return create(title, html, contentType, revisionNumber, null);
	}

  public HtmlMaterial create(String title, String html, String contentType, Long revisionNumber, HtmlMaterial originMaterial) {
    HtmlMaterial htmlMaterial = new HtmlMaterial();
    
    htmlMaterial.setHtml(html);
    htmlMaterial.setTitle(title);
    htmlMaterial.setOriginMaterial(originMaterial);
    htmlMaterial.setContentType(contentType);
    htmlMaterial.setRevisionNumber(revisionNumber);
    
    return persist(htmlMaterial);
  }

	public void delete(HtmlMaterial htmlMaterial) {
	  super.delete(htmlMaterial);
	}

  public HtmlMaterial updateData(HtmlMaterial htmlMaterial, String html) {
    htmlMaterial.setHtml(html);
    return persist(htmlMaterial);
  }

  public HtmlMaterial updateRevisionNumber(HtmlMaterial htmlMaterial, Long revisionNumber) {
    htmlMaterial.setRevisionNumber(revisionNumber);
    return persist(htmlMaterial);
  }

  public HtmlMaterial updateTitle(HtmlMaterial htmlMaterial, String title) {
    htmlMaterial.setTitle(title);
    return persist(htmlMaterial);
  }
	
}

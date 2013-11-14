package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.StringReader;

import javax.ejb.Stateless;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Dependent
@Stateless
public class HtmlMaterialController {
  
  @Inject
  private Event<HtmlMaterialProcessEvent> processEvent;

	@Inject
	private HtmlMaterialDAO htmlMaterialDAO;
	
	public HtmlMaterial createHtmlMaterial(String urlName, String title, String html) {
		return htmlMaterialDAO.create(urlName, title, html);
	}
	
	public HtmlMaterial findHtmlMaterialById(Long id) {
		return htmlMaterialDAO.findById(id);
	}
	
	public Document getProcessedHtmlDocument(HtmlMaterial htmlMaterial) throws SAXException, IOException {
    return processHtml(htmlMaterial.getId(), htmlMaterial.getHtml());
	}
	
	private Document processHtml(Long materialId, String html) throws SAXException, IOException {
    if (StringUtils.isNotBlank(html)) {
      DOMParser parser = new DOMParser();
      StringReader htmlReader = new StringReader(html);
      try {
        InputSource inputSource = new InputSource(htmlReader);
        parser.parse(inputSource);

        Document document = parser.getDocument();
        
        HtmlMaterialProcessEvent event = new HtmlMaterialProcessEvent(materialId, document);
        processEvent.fire(event);
        return event.getDocument();
      } finally {
        htmlReader.close();
      }
    }
    
    return null;
  }
}

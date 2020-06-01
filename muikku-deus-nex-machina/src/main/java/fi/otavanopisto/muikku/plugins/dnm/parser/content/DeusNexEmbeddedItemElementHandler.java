package fi.otavanopisto.muikku.plugins.dnm.parser.content;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

public interface DeusNexEmbeddedItemElementHandler {

	public Node handleEmbeddedDocument(Document ownerDocument, String title, Integer queryType, Integer resourceNo, Integer embeddedResourceNo);
	
	public Node handleEmbeddedImage(Document ownerDocument, String title, String alt, Integer width, Integer height, Integer hspace, String align, Integer resourceno);

	public Node handleEmbeddedAudio(Document ownerDocument, Integer resourceNo, Boolean showAsLink, String fileName, String linkText, Boolean autoStart, Boolean loop);
	
	public Node handleEmbeddedHyperlink(Document ownerDocument, Integer resourceNo, String target, String fileName, String linkText);

  public Node handleEmbedded(Document ownerDocument, Integer resRef, Boolean functionalRef, Boolean visible, Boolean autoStart, Integer width, Integer height,
      Boolean showAsLink, Boolean showControls, Boolean loop, Integer queryType);
}
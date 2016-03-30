package fi.otavanopisto.muikku.plugins.dnm.parser.structure.model;

import org.w3c.dom.Element;

public class Document extends ResourceContainer {

	public Document() {
		setType(Type.DOCUMENT);
	}
	
	public Element getDocument() {
		return document;
	}
	
	public void setDocument(Element document) {
		this.document = document;
	}

	private Element document;
}

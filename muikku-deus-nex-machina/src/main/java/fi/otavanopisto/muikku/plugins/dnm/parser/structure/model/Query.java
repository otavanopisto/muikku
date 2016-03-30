package fi.otavanopisto.muikku.plugins.dnm.parser.structure.model;

import org.w3c.dom.Element;

public class Query extends ResourceContainer {

	public Query() {
		setType(Type.QUERY);
	}

	public Element getDocument() {
		return document;
	}

	public void setDocument(Element document) {
		this.document = document;
	}

	public String getQueryIdType() {
		return queryIdType;
	}

	public void setQueryIdType(String queryIdType) {
		this.queryIdType = queryIdType;
	}

	public String getQueryStorageType() {
		return queryStorageType;
	}

	public void setQueryStorageType(String queryStorageType) {
		this.queryStorageType = queryStorageType;
	}

	public String getQueryType() {
		return queryType;
	}

	public void setQueryType(String queryType) {
		this.queryType = queryType;
	}

	public String getQueryState() {
		return queryState;
	}

	public void setQueryState(String queryState) {
		this.queryState = queryState;
	}

	private Element document;
	private String queryIdType;
	private String queryStorageType;
	private String queryType;
	private String queryState;
}

package fi.otavanopisto.muikku.plugins.dnm.parser.structure.model;

public class Binary extends Resource {
	
	public Binary() {
	  setType(Type.BINARY);
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public byte[] getContent() {
		return content;
	}

	public void setContent(byte[] content) {
		this.content = content;
	}

	private String contentType;
	private byte[] content;
}

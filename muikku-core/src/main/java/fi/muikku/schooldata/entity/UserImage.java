package fi.muikku.schooldata.entity;

public interface UserImage {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getContentType();
	
	public void setContentType(String contentType);
	
	public byte[] getContent();

	public void setContent(byte[] content);
	
}

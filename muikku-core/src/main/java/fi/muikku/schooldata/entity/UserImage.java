package fi.muikku.schooldata.entity;

public interface UserImage {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getContentType();
	
	public byte[] getContent();
	
}

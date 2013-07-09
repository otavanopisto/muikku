package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.MockedUserSchoolDataBridge;
import fi.muikku.schooldata.entity.UserImage;

public class MockedUserImage implements UserImage {

	public MockedUserImage(String identifier, String userIdentifier, String contentType, byte[] content) {
		this.identifier = identifier;
		this.userIdentifier = userIdentifier;
		this.contentType = contentType;
		this.content = content;
	}
	
	@Override
	public String getSchoolDataSource() {
		return MockedUserSchoolDataBridge.SCHOOL_DATA_SOURCE;
	}

	@Override
	public String getIdentifier() {
		return identifier;
	}

	@Override
	public String getUserIdentifier() {
		return userIdentifier;
	}

	@Override
	public String getContentType() {
		return contentType;
	}
	
	@Override
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	@Override
	public byte[] getContent() {
		return content;
	}

	@Override
	public void setContent(byte[] content) {
		this.content = content;
	}

	private String identifier;
	private String userIdentifier;
	private String contentType;
	private byte[] content;
	
}

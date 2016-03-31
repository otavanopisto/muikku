package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.UserImage;

public class PyramusUserImage implements UserImage {

	public PyramusUserImage(String identifier, String userIdentifier, String contentType, byte[] content) {
		this.identifier = identifier;
		this.userIdentifier = userIdentifier;
		this.contentType = contentType;
		this.content = content;
	}
	
	@Override
	public String getSchoolDataSource() {
		return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
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

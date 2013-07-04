package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.MockedUserSchoolDataBridge;
import fi.muikku.schooldata.entity.UserProperty;

public class MockedUserProperty implements UserProperty {

	public MockedUserProperty(String identifier, String userIdentifier, String key, String value) {
		this.identifier = identifier;
		this.userIdentifier = userIdentifier;
		this.key = key;
		this.value = value;
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
	public String getKey() {
		return key;
	}

	@Override
	public String getValue() {
		return value;
	}

	@Override
	public void setValue(String value) {
		this.value = value;
	}

	private String identifier;

	private String userIdentifier;

	private String key;

	private String value;

}

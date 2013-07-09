package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.UserProperty;

public class MockedUserProperty implements UserProperty {

	public MockedUserProperty(String userIdentifier, String key, String value) {
		this.userIdentifier = userIdentifier;
		this.key = key;
		this.value = value;
	}
	
	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
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

	private String userIdentifier;

	private String key;

	private String value;

}

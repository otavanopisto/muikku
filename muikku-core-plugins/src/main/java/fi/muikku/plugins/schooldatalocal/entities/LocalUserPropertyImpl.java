package fi.muikku.plugins.schooldatalocal.entities;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.entity.UserProperty;

public class LocalUserPropertyImpl implements UserProperty {

	public LocalUserPropertyImpl(String identifier, String userIdentifier, String key, String value) {
		this.identifier = identifier;
		this.userIdentifier = userIdentifier;
		this.key = key;
		this.value = value;
	}
	
	@Override
	public String getSchoolDataSource() {
		return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
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

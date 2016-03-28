package fi.otavanopisto.muikku.plugins.schooldatalocal.entities;

import fi.otavanopisto.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

public class LocalUserPropertyImpl implements UserProperty {

	public LocalUserPropertyImpl(String userIdentifier, String key, String value) {
		this.userIdentifier = userIdentifier;
		this.key = key;
		this.value = value;
	}
	
	@Override
	public String getSchoolDataSource() {
		return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
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

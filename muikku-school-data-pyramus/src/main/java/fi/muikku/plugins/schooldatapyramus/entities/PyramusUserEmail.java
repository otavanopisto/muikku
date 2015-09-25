package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.UserEmail;

public class PyramusUserEmail implements UserEmail {

	public PyramusUserEmail(String identifier, String userIdentifier, String address) {
		this.identifier = identifier;
		this.userIdentifier = userIdentifier;
		this.address = address;
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
	public String getAddress() {
		return address;
	}
	
	@Override
	public void setAddress(String address) {
		this.address = address;
	}

	private String identifier;

	private String userIdentifier;

	private String address;

}

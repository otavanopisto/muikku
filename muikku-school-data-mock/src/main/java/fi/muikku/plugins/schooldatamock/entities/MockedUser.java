package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.schooldata.entity.User;

public class MockedUser implements User {

	public MockedUser(String identifier, String firstName, String lastName) {
		this.identifier = identifier;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	@Override
	public String getIdentifier() {
		return identifier;
	}

	@Override
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	@Override
	public String getFirstName() {
		return firstName;
	}

	@Override
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	@Override
	public String getLastName() {
		return lastName;
	}

	private String identifier;
	private String firstName;
	private String lastName;

}

package fi.muikku.schooldata.local;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.users.UserImplDAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.UserImpl;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;

@Dependent
@LocalSchoolDataController
public class LocalUserController implements UserSchoolDataController {

	@Inject
	private UserImplDAO userImplDAO;

	@Override
	public User findUser(UserEntity userEntity) {
		return UserIntfImpl.fromEntity(userImplDAO.findByUserEntity(userEntity));
	}

	@Override
	public User createUser(UserEntity userEntity, String firstName, String lastName, String email) {
		return UserIntfImpl.fromEntity(userImplDAO.create(userEntity, firstName, lastName, email));
	}

	private static class UserIntfImpl implements User {

		public UserIntfImpl(String firstName, String lastName, String email) {
			super();
			this.firstName = firstName;
			this.lastName = lastName;
			this.email = email;
		}
		
		@Override
		public String getFirstName() {
			return firstName;
		}

		@Override
		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		@Override
		public String getLastName() {
			return lastName;
		}

		@Override
		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		@Override
		public String getEmail() {
			return email;
		}

		@Override
		public void setEmail(String email) {
			this.email = email;
		}
		
		public static User fromEntity(UserImpl userImpl) {
			return new UserIntfImpl(userImpl.getFirstName(), userImpl.getLastName(), userImpl.getEmail());
		}

		private String firstName;
		private String lastName;
		private String email;

	}
}

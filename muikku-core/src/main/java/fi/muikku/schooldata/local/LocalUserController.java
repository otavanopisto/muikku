package fi.muikku.schooldata.local;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.dao.users.UserImplDAO;
import fi.muikku.events.Created;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.UserImpl;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.events.UserEvent;

@Dependent
@LocalSchoolDataController
public class LocalUserController implements UserSchoolDataController {

	@Inject
	private UserImplDAO userImplDAO;
	
	@Inject
	@Created
	private Event<UserEvent> userCreatedEvent;

	@Override
	public User findUser(UserEntity userEntity) {
		return UserIntfImpl.fromEntity(userImplDAO.findByUserEntity(userEntity));
	}

	@Override
	public User createUser(UserEntity userEntity, String firstName, String lastName, String email) {
	  UserImpl userImpl = userImplDAO.create(userEntity, firstName, lastName, email);
	  
	  fireUserCreatedEvent(userEntity);
	  
		return UserIntfImpl.fromEntity(userImpl);
	}

  private void fireUserCreatedEvent(UserEntity userEntity) {
    UserEvent userEvent = new UserEvent();
    userEvent.setUserEntityId(userEntity.getId());
    userCreatedEvent.fire(userEvent);
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

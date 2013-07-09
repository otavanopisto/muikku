package fi.muikku.plugins.schooldatalocal;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.schooldatalocal.entities.LocalUserEmailImpl;
import fi.muikku.plugins.schooldatalocal.entities.LocalUserImageImpl;
import fi.muikku.plugins.schooldatalocal.entities.LocalUserImpl;
import fi.muikku.plugins.schooldatalocal.entities.LocalUserPropertyImpl;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.schooldatalocal.model.LocalUserEmail;
import fi.muikku.plugins.schooldatalocal.model.LocalUserImage;
import fi.muikku.plugins.schooldatalocal.model.LocalUserProperty;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserSchoolDataBridge;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;

@Dependent
@Stateful
public class LocalUserSchoolDataBridge implements UserSchoolDataBridge {
	
	@Inject
	private LocalUserSchoolDataController localUserSchoolDataController;
	
	@Override
	public String getSchoolDataSource() {
		return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public User createUser(String firstName, String lastName) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (StringUtils.isNotBlank(firstName)) {
			throw new SchoolDataBridgeRequestException("firstName is required");
		}
		
		if (StringUtils.isNotBlank(lastName)) {
			throw new SchoolDataBridgeRequestException("lastName is required");
		}
		
		User userImpl = toLocalUserImpl(localUserSchoolDataController.createUser(firstName, lastName));
		if (userImpl == null) {
			throw new UnexpectedSchoolDataBridgeException("Failed to create local user");
		}
		
		return userImpl;
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public User findUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("identifier is invalid");
		}
		
		return toLocalUserImpl(localUserSchoolDataController.findUser(identifier));
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public User findUserByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		return toLocalUserImpl(localUserSchoolDataController.findUserByEmail(email));
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<User> listUsers() throws UnexpectedSchoolDataBridgeException {
		List<User> result = new ArrayList<>();
		
		for (LocalUser localUser : localUserSchoolDataController.listUsers()) {
			User user = toLocalUserImpl(localUser);
			if (user != null) {
			  result.add(user);
			} else {
				throw new UnexpectedSchoolDataBridgeException("Unexpected error occured while creating LocalUserImpl");
			}
		}
		
		return result;
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public User updateUser(User user) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (StringUtils.isNotBlank(user.getFirstName())) {
			throw new SchoolDataBridgeRequestException("firstName is required");
		}
		
		if (StringUtils.isNotBlank(user.getLastName())) {
			throw new SchoolDataBridgeRequestException("lastName is required");
		}
		
		LocalUser localUser = localUserSchoolDataController.findUser(user.getIdentifier());
		if (localUser != null) {
  		localUserSchoolDataController.updateUserFirstName(localUser, user.getFirstName());
  		localUserSchoolDataController.updateUserLastName(localUser, user.getLastName());
  		return toLocalUserImpl(localUser);
		}
		
		throw new UnexpectedSchoolDataBridgeException("Unexpected error occured while creating LocalUserImpl");
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public void removeUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		LocalUser localUser = localUserSchoolDataController.findUser(identifier);
		if (localUser != null) {
			localUserSchoolDataController.removeUser(localUser);
		} else {
			throw new SchoolDataBridgeRequestException("Failed to remove user because it does not exist");
		}
	}

	@Override
	public UserEmail createUserEmail(String userIdentifier, String address) {
		// TODO: Proper Error Handling
		return toLocalUserEmailImpl(localUserSchoolDataController.createUserEmail(userIdentifier, address));
	}

	@Override
	public UserEmail findUserEmail(String identifier) {
		// TODO: Proper Error Handling
		return toLocalUserEmailImpl(localUserSchoolDataController.findUserEmail(identifier));
	}

	@Override
	public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) {
		// TODO: Proper Error Handling
		List<UserEmail> result = new ArrayList<>();
		
		List<LocalUserEmail> emails = localUserSchoolDataController.listUserEmailsByUserIdentifier(userIdentifier);
		for (LocalUserEmail email : emails) {
			UserEmail emailImpl = toLocalUserEmailImpl(email);
			if (emailImpl != null) {
				result.add(emailImpl);
			}
		}
		
		return result;
	}

	@Override
	public UserEmail updateUserEmail(UserEmail userEmail) {
		// TODO: Proper Error Handling
		return toLocalUserEmailImpl(localUserSchoolDataController.updateUserEmail(userEmail.getIdentifier(), userEmail.getAddress()));
	}

	@Override
	public void removeUserEmail(String identifier) {
		// TODO: Proper Error Handling
		localUserSchoolDataController.removeUserEmail(identifier);
	}

	@Override
	public UserImage createUserImage(String userIdentifier, String contentType, byte[] content) {
		// TODO: Proper Error Handling
		return toLocalUserImageImpl(localUserSchoolDataController.createUserImage(userIdentifier, contentType, content));
	}

	@Override
	public UserImage findUserImage(String identifier) {
		// TODO: Proper Error Handling
		return toLocalUserImageImpl(localUserSchoolDataController.findUserImage(identifier));
	}

	@Override
	public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) {
		// TODO: Proper Error Handling
		List<UserImage> result = new ArrayList<>();
		
		List<LocalUserImage> images = localUserSchoolDataController.listUserImagesByUserIdentifier(userIdentifier);
		for (LocalUserImage image : images) {
			UserImage userImage = toLocalUserImageImpl(image);
			if (userImage != null) {
			  result.add(userImage);
			}
		}
		
		return result;
	}

	@Override
	public UserImage updateUserImage(UserImage userImage) {
		// TODO: Proper Error Handling
		return toLocalUserImageImpl(localUserSchoolDataController.updateUserImage(userImage.getIdentifier(), userImage.getContentType(), userImage.getContent()));
	}

	@Override
	public void removeUserImage(String identifier) {
		// TODO: Proper Error Handling
		localUserSchoolDataController.removeUserImage(identifier);
	}

	@Override
	public UserProperty createUserProperty(String userIdentifier, String key, String value) {
		// TODO: Proper Error Handling
		return toLocalUserPropertyImpl(localUserSchoolDataController.createUserProperty(userIdentifier, key, value));
	}

	@Override
	public UserProperty findUserProperty(String identifier) {
		// TODO: Proper Error Handling
		return toLocalUserPropertyImpl(localUserSchoolDataController.findUserProperty(identifier));
	}

	@Override
	public UserProperty findUserPropertyByUserAndKey(String userIdentifier, String key) {
		// TODO: Proper Error Handling
		return toLocalUserPropertyImpl(localUserSchoolDataController.findUserPropertyByUserAndKey(userIdentifier, key));
	}

	@Override
	public List<UserProperty> listUserPropertiesByUser(String userIdentifier) {
		// TODO: Proper Error Handling
		List<UserProperty> result = new ArrayList<>();
		
		for (LocalUserProperty property : localUserSchoolDataController.listUserPropertiesByUser(userIdentifier)) {
			UserProperty propertyImpl = toLocalUserPropertyImpl(property);
			if (propertyImpl != null) {
				result.add(propertyImpl);
			}
		}
		
		return result;
	}

	@Override
	public UserProperty updateUserProperty(UserProperty userProperty) {
		// TODO: Proper Error Handling
		return toLocalUserPropertyImpl(localUserSchoolDataController.updateUserProperty(userProperty.getIdentifier(), userProperty.getKey(), userProperty.getValue()));
	}

	@Override
	public void removeUserProperty(String identifier) {
		// TODO: Proper Error Handling
		localUserSchoolDataController.removeUserProperty(identifier);
	}

	private User toLocalUserImpl(LocalUser localUser) {
		if (localUser != null) {
			return new LocalUserImpl(localUser.getId().toString(), localUser.getFirstName(), localUser.getLastName());
		}
		
		return null;
	}

	private UserEmail toLocalUserEmailImpl(LocalUserEmail localUserEmail) {
		if (localUserEmail != null) {
		  return new LocalUserEmailImpl(localUserEmail.getId().toString(), localUserEmail.getUser().getId().toString(), localUserEmail.getAddress());
		}
		
		return null;
	}

	private UserImage toLocalUserImageImpl(LocalUserImage localUserImage) {
		if (localUserImage != null) {
			return new LocalUserImageImpl(localUserImage.getId().toString(), localUserImage.getUser().getId().toString(), localUserImage.getContentType(), localUserImage.getContent());
		}
		
		return null;
	}

	private UserProperty toLocalUserPropertyImpl(LocalUserProperty localUserProperty) {
		if (localUserProperty != null) {
			return new LocalUserPropertyImpl(localUserProperty.getId().toString(), localUserProperty.getUser().getId().toString(), localUserProperty.getKey().getName(), localUserProperty.getValue());
		}
		
		return null;
	}

}

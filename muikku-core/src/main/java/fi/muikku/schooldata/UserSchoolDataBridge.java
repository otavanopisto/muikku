package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;

public interface UserSchoolDataBridge {
	
	public String getSchoolDataSource();
	
	// TODO: Error handling...
	
	/* User */
	
	/**
	 * Creates new user
	 * 
	 * @param firstName new user's first name
	 * @param lastName new user's last name
	 * @return created user
	 * @throws SchoolDataBridgeRequestException when given parameters are not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public User createUser(String firstName, String lastName) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Finds a user by it's identifier. If user cannot be found null is returned.
	 * 
	 * @param identifier user's identifier
	 * @return user or null if user does not exist
	 * @throws SchoolDataBridgeRequestException when given identifier is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public User findUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	/**
	 * Finds user by email. If user cannot be found null is returned.
	 * 
	 * @param email email address
	 * @return user or null if user with given email cannot be found
	 * @throws SchoolDataBridgeRequestException when given email is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public User findUserByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	// TODO: Search / findUsers

	/**
	 * Lists all users
	 * 
	 * @return list of all users managed by school data bridge.
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */	
	public List<User> listUsers() throws UnexpectedSchoolDataBridgeException;
	
	/**
	 * Updates user
	 * 
	 * @param user
	 * @return updated user
	 * @throws SchoolDataBridgeRequestException when given user contains invalid data
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public User updateUser(User user) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Removes a user
	 * 
	 * @param identifier user's identifier to be removed
	 * @throws SchoolDataBridgeRequestException when given identifier is invalid or user does not exist
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public void removeUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* User Email */
	
	public UserEmail createUserEmail(String userIdentifier, String address);
	
	public UserEmail findUserEmail(String identifier);
	
	public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier);
	
	public UserEmail updateUserEmail(UserEmail userEmail);
	
	public void removeUserEmail(String identifier);
	
	/* User Image */
	
	public UserImage createUserImage(String userIdentifier, String contentType, byte[] content);
	
	public UserImage findUserImage(String identifier);
	
	public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier);
	
	public UserImage updateUserImage(UserImage userImage);
	
	public void removeUserImage(String identifier);
	
	/* User Properties */
	
	public UserProperty createUserProperty(String userIdentifier, String key, String value);
	
	public UserProperty findUserProperty(String identifier);

	public UserProperty findUserPropertyByUserAndKey(String userIdentifier, String key);

	public List<UserProperty> listUserPropertiesByUser(String userIdentifier);
	
	public UserProperty updateUserProperty(UserProperty userProperty);
	
	public void removeUserProperty(String identifier);
	
}
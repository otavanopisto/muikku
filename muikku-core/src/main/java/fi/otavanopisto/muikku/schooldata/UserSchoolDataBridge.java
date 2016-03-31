package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserImage;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

public interface UserSchoolDataBridge {
	
	/**
	 * Returns school data source identifier
	 * 
	 * @return school data source identifier
	 */
	public String getSchoolDataSource();
	
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
	 * Finds an user by it's identifier. If user cannot be found null is returned.
	 * 
	 * @param identifier user's identifier
	 * @return user or null if user does not exist
	 * @throws SchoolDataBridgeRequestException when given identifier is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public User findUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	/**
   * Finds an active user by it's identifier. If user cannot be found null is returned.
   * 
   * @param identifier user's identifier
   * @return user or null if user does not exist
   * @throws SchoolDataBridgeRequestException when given identifier is not valid
   * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
   */
  public User findActiveUser(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	/**
	 * Lists users by email.
	 * 
	 * @param email email address
	 * @return user or null if user with given email cannot be found
	 * @throws SchoolDataBridgeRequestException when given email is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
  public List<User> listUsersByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

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

	/**
	 * Creates new email address for user
	 * 
	 * @param userIdentifier user's identifier
	 * @param address email address
	 * @return created UserEmail
	 * @throws SchoolDataBridgeRequestException when given some of given parameters are invalid or user does not exist
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserEmail createUserEmail(String userIdentifier, String address) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Finds user email by identifier
	 * 
	 * @param identifier user email identifier
	 * @return user email or null if does not exist
	 * @throws SchoolDataBridgeRequestException when identifier is invalid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserEmail findUserEmail(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Lists user's email addresses
	 * 
	 * @param userIdentifier user's identififer
	 * @return list of user's emails
	 * @throws SchoolDataBridgeRequestException when user identifier is invalid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Updates user email
	 * 
	 * @param userEmail new user email object
	 * @return updated user email object
	 * @throws SchoolDataBridgeRequestException when object contains invalid data
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserEmail updateUserEmail(UserEmail userEmail) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Removes user email
	 * 
	 * @param identifier identifier of user email
	 * @throws SchoolDataBridgeRequestException when identifier is invalid or email does not exist
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public void removeUserEmail(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* User Image */
	
	/**
	 * Creates a user image
	 * 
	 * @param userIdentifier identifier of user
	 * @param contentType content type of image
	 * @param content image data
	 * @return created image
	 * @throws SchoolDataBridgeRequestException when given parameters are not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserImage createUserImage(String userIdentifier, String contentType, byte[] content) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Finds a user image by identifier
	 * 
	 * @param identifier identifier of image
	 * @return user image or null if image does not exist
	 * @throws SchoolDataBridgeRequestException when given identifier is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserImage findUserImage(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Lists all user images 
	 * 
	 * @param userIdentifier identifier of user
	 * @return list of user's images
	 * @throws SchoolDataBridgeRequestException when given user identifier is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Updates user image
	 * 
	 * @param userImage image update object 
	 * @return updated image object
	 * @throws SchoolDataBridgeRequestException when given object contains invalid values
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserImage updateUserImage(UserImage userImage) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/**
	 * Removes user's image by identifier
	 * 
	 * @param identifier identifier of image to be removed
	 * @throws SchoolDataBridgeRequestException when given identifier is invalid or image does not exist
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public void removeUserImage(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* User Properties */
	
	/**
	 * Sets a property for the user. 
	 * 
	 * If property does not exist new property is automatically created
	 * 
	 * @param userIdentifier identifier of user
	 * @param key property key
	 * @param value property value
	 * @return created / updated user property
	 * @throws SchoolDataBridgeRequestException when given parameters are not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserProperty setUserProperty(String userIdentifier, String key, String value) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	/**
	 * Returns property for the user
	 * 
	 * @param userIdentifier identifier of user
	 * @param key property key
	 * @return
	 * @throws SchoolDataBridgeRequestException when given parameters are not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public UserProperty getUserProperty(String userIdentifier, String key) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	/**
	 * Returns list of properties for user
	 * 
	 * @param userIdentifier identifier of user
	 * @return list of user property objects
	 * @throws SchoolDataBridgeRequestException when given user identifier is not valid
	 * @throws UnexpectedSchoolDataBridgeException when unexpected error occurs
	 */
	public List<UserProperty> listUserPropertiesByUser(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* Roles */
	
	public Role findRole(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<Role> listRoles() throws UnexpectedSchoolDataBridgeException;
	
	public Role findUserEnvironmentRole(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	/* UserGroups */
	
	public UserGroup findUserGroup(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;;
	
	public List<UserGroup> listUserGroups() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;;
	
	/* GroupUsers */
	
	public GroupUser findGroupUser(String groupIdentifier, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;;
	
	public List<GroupUser> listGroupUsersByGroup(String groupIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;;

  public void updateUserCredentials(String userIdentifier, String oldPassword, String newUsername, String newPassword) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public String requestPasswordResetByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public boolean confirmResetPassword(String resetCode, String newPassword) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public String findUsername(String userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
  
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
}
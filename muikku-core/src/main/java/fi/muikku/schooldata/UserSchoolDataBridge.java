package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;

public interface UserSchoolDataBridge {
	
	// TODO: Error handling...
	
	/* User */
	
	public User createUser(String firstName, String lastName);
	
	public User findUser(String identifier);
	
	// TODO: Search / findUsers
	
	public User updateUser(User user);
	
	public void removeUser(User user);
	
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
	
	public List<UserProperty> listUserPropertiesByKey(String key);
	
	public UserProperty updateUserProperty(UserProperty userProperty);
	
	public void removeUserProperty(String identifier);
	
}
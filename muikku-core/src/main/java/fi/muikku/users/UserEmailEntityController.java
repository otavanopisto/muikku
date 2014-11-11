package fi.muikku.users;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEmailEntityDAO;
import fi.muikku.dao.users.UserEmailSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEmailSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.UserEmail;

public class UserEmailEntityController {
  
  @Inject
  private Logger logger;

  @Inject
  private UserEmailEntityDAO userEmailEntityDAO;
  
  @Inject
  private UserEmailSchoolDataIdentifierDAO userEmailSchoolDataIdentifierDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public UserEmailEntity findUserEmailEntityById(Long id) {
    return userEmailEntityDAO.findById(id);
  }
  
  public UserEmailEntity findUserEmailEntityByAddress(String address) {
    return userEmailEntityDAO.findByAddress(address);
  }
  
  public UserEmailEntity findUserEmailEntityByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    UserEmailSchoolDataIdentifier schoolDataIdentifier = userEmailSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, identifier);
    if (schoolDataIdentifier != null) {
      return schoolDataIdentifier.getUserEmailEntity();
    }
    
    return null;
  }
  
  public UserEmailEntity findUserEmailEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findUserEmailEntityByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  public UserEmailEntity findUserEmailEntityByUserEmail(UserEmail userEmail) {
    return findUserEmailEntityByDataSourceAndIdentifier(userEmail.getSchoolDataSource(), userEmail.getIdentifier());
  }
  
  /**
   * Returns a list of all email addresses belonging to the given user.
   * 
   * @param user The user whose email addresses are to be returned
   * 
   * @return A list of all email addresses belonging to the given user
   */
  public List<UserEmailEntity> listUserEmailEntitiessByUserEntity(UserEntity user) {
    return userEmailEntityDAO.listByUser(user);
  }

  public List<String> listAddressesByUserEntity(UserEntity user) {
    List<String> result = new ArrayList<>();
    
    List<UserEmailEntity> userEmailEntities = listUserEmailEntitiessByUserEntity(user);
    for (UserEmailEntity userEmailEntity : userEmailEntities) {
      result.add(userEmailEntity.getAddress());
    }
    
    return result;
  }

  /**
   * Modifies the email address of the given email address entity.
   * 
   * @param userEmail
   *          The user email entity to be modified
   * @param address
   *          The new email address for the entity
   * 
   * @return The updated user email entity
   */
  public UserEmailEntity updateUserEmailEntity(UserEmailEntity userEmail, String address) {
    // TODO is address a valid email?
    UserEmailEntity dbEmail = userEmailEntityDAO.findByAddress(address);
    if (dbEmail != null && !dbEmail.getId().equals(userEmail.getId())) {
      // TODO error handling; address is already in use
      return userEmail;
    }
    return userEmailEntityDAO.updateAddress(userEmail, address);
  }

  /**
   * Permanently removes the given user email from the database.
   * 
   * @param userEmail
   *          The user email to be removed
   */
  public void removeUserEmailEntity(UserEmailEntity userEmail) {
    userEmailEntityDAO.delete(userEmail);
  }

  /**
   * Adds a new email address to the given user.
   * 
   * @param user The user
   * @param address The email address
   * 
   * @return The created email address
   */
  public synchronized UserEmailEntity addUserEmail(UserEntity user, String address) {
    // TODO is address a valid email?
    UserEmailEntity userEmail = userEmailEntityDAO.findByAddress(address);
    if (userEmail != null) {
      if (userEmail.getUser().getId() == user.getId()) {
        return userEmail;
      }
      else {
        // TODO error handling, e.g. address is already in use
        return null;
      }
    }
    
    return userEmailEntityDAO.create(user, address);
  }

}

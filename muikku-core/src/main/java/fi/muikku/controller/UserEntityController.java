package fi.muikku.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.users.UserEmailEntityDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEntity;

@Dependent
@Stateless
// TODO Rename to UserController after GenericUserController is gone and fi.muikku.schooldata.UserController becomes SchoolDataUserController
public class UserEntityController {

  @Inject
  private UserEntityDAO userEntityDAO;
  
  @Inject
  private UserEmailEntityDAO userEmailEntityDAO;

  /**
   * Adds a new email address to the given user.
   * 
   * @param user The user
   * @param address The email address
   * 
   * @return The created email address
   */
  public UserEmailEntity addUserEmail(UserEntity user, String address) {
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
  
  /**
   * Modifies the email address of the given email address entity.
   * 
   * @param userEmail The user email entity to be modified
   * @param address The new email address for the entity
   * 
   * @return The updated user email entity
   */
  public UserEmailEntity updateUserEmail(UserEmailEntity userEmail, String address) {
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
   * @param userEmail The user email to be removed
   */
  public void removeUserEmail(UserEmailEntity userEmail) {
    userEmailEntityDAO.delete(userEmail);
  }
  
  /**
   * Returns the user corresponding to the given email address. If the email address does not belong to any user, returns <code>null</code>.
   * 
   * @param address Email address
   * 
   * @return The user corresponding to the given email address, or <code>null</code> if not found 
   */
  public UserEntity findUserByEmailAddress(String address) {
    UserEmailEntity userEmail = userEmailEntityDAO.findByAddress(address);
    return userEmail == null ? null : userEmail.getUser();
  }

  /**
   * Returns a list of all users.
   * 
   * @return a list of all users
   */
  public List<UserEntity> listUsers() {
    return userEntityDAO.listAll();
  }
  
  /**
   * Returns a list of all email addresses belonging to the given user.
   * 
   * @param user The user whose email addresses are to be returned
   * 
   * @return A list of all email addresses belonging to the given user
   */
  public List<UserEmailEntity> listEmailsByUser(UserEntity user) {
    return userEmailEntityDAO.listByUser(user);
  }

  public List<String> listUserEmailAddresses(UserEntity user) {
    List<String> result = new ArrayList<>();
    
    List<UserEmailEntity> userEmailEntities = listEmailsByUser(user);
    for (UserEmailEntity userEmailEntity : userEmailEntities) {
      result.add(userEmailEntity.getAddress());
    }
    
    return result;
  }

  public List<UserEntity> listUsersByEmails(List<String> addresses) {
    if (addresses.isEmpty()) {
      return Collections.emptyList();
    }
    
    return userEmailEntityDAO.listUsersByAddresses(addresses);
  }

  public UserEmailEntity findUserEmailEntityById(Long id) {
    return userEmailEntityDAO.findById(id);
  }

}

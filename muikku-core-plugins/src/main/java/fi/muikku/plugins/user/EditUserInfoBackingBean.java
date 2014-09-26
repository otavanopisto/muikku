package fi.muikku.plugins.user;

import java.io.FileNotFoundException;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.controller.UserEntityController;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.session.SessionController;


@Named
@Stateful
@RequestScoped
@Join (path = "/user-edit", to = "/user/edituserinfo.jsf")
public class EditUserInfoBackingBean {
  
  @Inject
  private UserInfoController userInfoController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @RequestAction
  public void init() throws FileNotFoundException {
  }

  public List<UserEmailEntity> listUserEmails() {
    UserEntity user = sessionController.getUser();
    return userEntityController.listEmailsByUser(user);
  }
  
  public void changeEmail(UserEmailEntity changedEmail) {
    userInfoController.createEmailChange(changedEmail, newEmail);
  }
  
  public String getNewEmail() {
    return newEmail;
  }

  public void setNewEmail(String newEmail) {
    this.newEmail = newEmail;
  }

  private String newEmail;
}

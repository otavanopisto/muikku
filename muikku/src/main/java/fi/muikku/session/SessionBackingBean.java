package fi.muikku.session;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.UserController;

@RequestScoped
@Named
@Stateful
public class SessionBackingBean {

  @Inject
  private UserController userController;
  
	@Inject
	private SessionController sessionController;
	
	@PostConstruct
	public void init() {
	  loggedUserRoleArchetype = null;

    if (sessionController.isLoggedIn()) {
	    UserEntity loggedUser = sessionController.getUser();
	    if (loggedUser != null) {
	      EnvironmentUser environmentUser = userController.findEnvironmentUserByUserEntity(loggedUser);
	      if (environmentUser != null) {
	        loggedUserRoleArchetype = environmentUser.getRole().getArchetype();
	      }
	    }
	  }
	}
	
	public boolean getLoggedIn() {
		return sessionController.isLoggedIn();
	}
	
	public Long getLoggedUserId() {
	  return sessionController.isLoggedIn() ? sessionController.getUser().getId() : null;
	}

	public String getResourceLibrary() {
		return "theme-muikku";
	}
	
	public boolean getTeacherLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.TEACHER;
  }
	
	public boolean getManagerLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.MANAGER;
  }
	
	public boolean getAdministratorLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.ADMINISTRATOR;
  }
	
	public boolean getStudentLoggedIn() {
	  return loggedUserRoleArchetype == EnvironmentRoleArchetype.STUDENT;
	}
	
	private EnvironmentRoleArchetype loggedUserRoleArchetype;
}

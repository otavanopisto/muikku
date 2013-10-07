package fi.muikku.session;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

@RequestScoped
@Named
@Stateful
public class SessionBackingBean {

	@Inject
	private SessionController sessionController;
	
	public boolean getLoggedIn() {
		return sessionController.isLoggedIn();
	}
	
}

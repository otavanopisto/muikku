package fi.otavanopisto.muikku.servlet;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.otavanopisto.muikku.plugins.online.OnlineUsersController;
import fi.otavanopisto.muikku.session.SessionController;

@WebServlet("/heartbeat")
public class HeartbeatServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Inject OnlineUsersController ouc;
	@Inject SessionController sc;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	  if (sc.isLoggedIn())
	    ouc.checkin(sc.getLoggedUserEntity());
	  
	  
	  request.getSession(false); // keep session alive
	  
	  response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}

}

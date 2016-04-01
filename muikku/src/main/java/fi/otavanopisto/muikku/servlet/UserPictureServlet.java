package fi.otavanopisto.muikku.servlet;

import java.io.IOException;
import java.util.Date;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.otavanopisto.muikku.dao.users.UserPictureDAO;
import fi.otavanopisto.muikku.model.users.UserPicture;

@WebServlet (
    name = "UserPictureServlet",
    urlPatterns = "/picture"    
)
public class UserPictureServlet extends HttpServlet {

  private static final long serialVersionUID = 5873268027916522922L;

  @Inject
  private UserPictureDAO userPictureDAO;
  
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    // TODO: rights
    Long userId = Long.parseLong(req.getParameter("userId"));
    
    UserPicture userPicture = userPictureDAO.findById(userId);

    if (userPicture != null) {
      resp.setDateHeader("Expires", new Date().getTime() + 1000 * 60 * 15); // 15min
      resp.setDateHeader("Last-modified", userPicture.getLastModified().getTime());
      resp.setContentType(userPicture.getContentType());
      resp.getOutputStream().write(userPicture.getData());
    }
    else
      resp.setStatus(404);
  }
}

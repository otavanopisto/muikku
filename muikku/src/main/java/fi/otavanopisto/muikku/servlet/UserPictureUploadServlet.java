package fi.otavanopisto.muikku.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.transaction.NotSupportedException;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;

import org.apache.commons.io.IOUtils;

import fi.otavanopisto.muikku.dao.users.UserEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserPictureDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserPicture;
import fi.otavanopisto.muikku.session.SessionController;

@WebServlet (
    name = "UserPictureUploadServlet",
    urlPatterns = "/pictureupload"    
)
@MultipartConfig
public class UserPictureUploadServlet extends HttpServlet {

  private static final long serialVersionUID = 5873268027916522922L;

  @Inject
  private UserTransaction tx;
  
  @Inject
  private UserEntityDAO userEntityDAO;
  
  @Inject
  private UserPictureDAO userPictureDAO;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    // TODO: rights, transaction handling
    
    try {
      tx.begin();

      try {
        Long userId = Long.parseLong(req.getParameter("userId"));
        Part filePart = req.getPart("pictureFile");
        String contentType = filePart.getContentType();
    
        InputStream filecontent = filePart.getInputStream();
        byte[] data = IOUtils.toByteArray(filecontent);
        
        UserEntity user = userEntityDAO.findById(userId);
        
        UserPicture userPicture = userPictureDAO.findByUser(user);
        if (userPicture != null)
          userPictureDAO.updateData(userPicture, contentType, data, new Date());
        else
          userPictureDAO.create(user, contentType, data, new Date());
        
        resp.setStatus(200);
        
        tx.commit();
      } catch (Exception ex) {
        tx.rollback();
        resp.setStatus(500);
      }
    } catch (NotSupportedException | SystemException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
}

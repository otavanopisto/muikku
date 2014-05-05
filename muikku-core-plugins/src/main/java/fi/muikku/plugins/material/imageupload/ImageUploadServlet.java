package fi.muikku.plugins.material.imageupload;

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

import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserPictureDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserPicture;
import fi.muikku.session.SessionController;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet (
    name = "UserPictureUploadServlet",
    urlPatterns = "/imageupload/upload"
)
@MultipartConfig
public class ImageUploadServlet extends HttpServlet {

  private static final long serialVersionUID = 5873268027916522922L;

  @Override
  public void init() throws ServletException {
    super.init();

    System.out.println("init() called");
  }

  @Inject
  private UserTransaction tx;

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

        Logger.getLogger(getClass().getName()).log(Level.INFO, data.toString());

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

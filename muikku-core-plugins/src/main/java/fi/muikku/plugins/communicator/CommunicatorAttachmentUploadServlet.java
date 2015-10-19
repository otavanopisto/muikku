package fi.muikku.plugins.communicator;

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

import fi.muikku.plugins.communicator.dao.CommunicatorMessageAttachmentDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;

@WebServlet (
    name = "CommunicatorAttachmentUploadServlet",
    urlPatterns = "/communicator/uploadattachment"    
)
@MultipartConfig
public class CommunicatorAttachmentUploadServlet extends HttpServlet {

  private static final long serialVersionUID = 5873268027916522922L;

  @Inject
  private UserTransaction tx;
  
  @Inject
  private CommunicatorMessageDAO communicatorMessageDAO;

  @Inject
  private CommunicatorMessageAttachmentDAO communicatorMessageAttachmentDAO;
  
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    // TODO: rights, transaction handling
    
    try {
      tx.begin();

      try {
        Long communicatorMessageId = Long.parseLong(req.getParameter("communicatorMessageId"));
        Part filePart = req.getPart("attachmentFile");
        String contentType = filePart.getContentType();
    
        InputStream filecontent = filePart.getInputStream();
        byte[] data = IOUtils.toByteArray(filecontent);
        
        CommunicatorMessage message = communicatorMessageDAO.findById(communicatorMessageId);
        
        communicatorMessageAttachmentDAO.create(message, contentType, data, new Date());
        resp.setStatus(200);
        
        tx.commit();
      } catch (Exception ex) {
        ex.printStackTrace();
        tx.rollback();
        resp.setStatus(500);
      }
    } catch (NotSupportedException | SystemException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
}

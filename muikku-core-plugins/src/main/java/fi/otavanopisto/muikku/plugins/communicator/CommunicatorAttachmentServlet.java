package fi.otavanopisto.muikku.plugins.communicator;

import java.io.IOException;
import java.util.Date;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageAttachmentDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment;

@WebServlet (
    name = "CommunicatorAttachmentServlet",
    urlPatterns = "/communicator/attachment"    
)
public class CommunicatorAttachmentServlet extends HttpServlet {

  private static final long serialVersionUID = -2698231295928909486L;

  @Inject
  private CommunicatorMessageAttachmentDAO communicatorMessageAttachmentDAO;
  
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    // TODO: rights
    Long attachmentId = Long.parseLong(req.getParameter("att"));
    
    CommunicatorMessageAttachment attachment = communicatorMessageAttachmentDAO.findById(attachmentId);

    if (attachment != null) {
      resp.setDateHeader("Expires", new Date().getTime() + 1000 * 60 * 1500); // 1500min
      resp.setDateHeader("Last-modified", attachment.getCreated().getTime());
      resp.setContentType(attachment.getContentType());
      resp.getOutputStream().write(attachment.getData());
    }
    else
      resp.setStatus(404);
  }
}

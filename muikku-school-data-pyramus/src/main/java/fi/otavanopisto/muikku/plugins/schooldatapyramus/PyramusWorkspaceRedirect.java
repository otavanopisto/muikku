package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.servlet.BaseUrl;

@Transactional
@WebServlet (urlPatterns = "/pyramusWorkspaceRedirect")
public class PyramusWorkspaceRedirect extends HttpServlet {
  
  private static final long serialVersionUID = -4680974940617451L;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private PyramusIdentifierMapper pyramusIdentifierMapper;
  
  @Inject
  @BaseUrl
  private String baseUrl;

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    long courseId = NumberUtils.toLong(req.getParameter("courseId"));
    if (courseId == 0) {
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    String workspaceIdentifier = pyramusIdentifierMapper.getWorkspaceIdentifier(courseId);
    SchoolDataIdentifier workspaceIdentier = new SchoolDataIdentifier(workspaceIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(workspaceIdentier);
    if (workspaceEntity == null) {
      resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    resp.sendRedirect(String.format("%s/workspace/%s", baseUrl, workspaceEntity.getUrlName()));
  }
  
}

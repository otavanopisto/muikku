package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.io.IOException;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

@WebServlet (
    name = "ApplicationRedirectServlet",
    urlPatterns = "/application"
)
public class ApplicationRedirectServlet extends HttpServlet {

  private static final long serialVersionUID = 447029802157517570L;

  private static final String PLUGIN_NAME = SchoolDataPyramusPluginDescriptor.PLUGIN_NAME;
  private static final String PYRAMUSORIGIN_SETTING_NAME = "pyramusOrigin";

  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String origin = pluginSettingsController.getPluginSetting(PLUGIN_NAME, PYRAMUSORIGIN_SETTING_NAME, false);
    
    if (StringUtils.isNotBlank(origin)) {
      String originRoot = StringUtils.endsWith(origin, "/") ? origin : origin + "/";
      
      resp.sendRedirect(originRoot + "applications/index.page");
    }
    else {
      logger.severe("Pyramus Origin is not set, cannot determine location for Applications.");
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
    }
  }
  
}

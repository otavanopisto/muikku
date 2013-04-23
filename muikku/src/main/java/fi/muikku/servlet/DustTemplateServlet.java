package fi.muikku.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.muikku.plugin.PluginContextClassLoader;
import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

@WebServlet (
    name = "DustTemplateServlet",
    urlPatterns = "/resources/dust/*"     
)
public class DustTemplateServlet extends HttpServlet {

  private static final long serialVersionUID = -891919145673255454L;

  @Override
  @PluginContextClassLoader
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    try {
      ClassLoader contextClassLoader = SingletonPluginManager.getInstance().getPluginsClassLoader();
      URL resource = contextClassLoader.getResource("META-INF/resources/dust" + req.getPathInfo());

      if (resource != null) {
        ServletOutputStream outputStream = resp.getOutputStream();
        
        URLConnection connection = resource.openConnection();
        connection.setDoInput(true);
        connection.setDoOutput(true);
        String contentType = connection.getContentType();
        InputStream resourceStream = connection.getInputStream();
        int bytesRead = 0;
        byte[] buff = new byte[1024];
        while ((bytesRead = resourceStream.read(buff, 0, 1024)) > 0) {
          outputStream.write(buff, 0, bytesRead);
        }
        resourceStream.close();
        
        resp.setContentType(contentType);
        outputStream.flush();
        outputStream.close();
      }
      else
        resp.setStatus(404);
    } catch (PluginManagerException e) {
      e.printStackTrace();
    }
  }
}

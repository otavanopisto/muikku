package fi.otavanopisto.muikku.servlet;

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

import org.apache.commons.io.IOUtils;

@WebServlet (
    name = "DustTemplateServlet",
    urlPatterns = "/resources/dust/*"     
)
public class DustTemplateServlet extends HttpServlet {

  private static final long serialVersionUID = -891919145673255454L;

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
      ClassLoader contextClassLoader = getClass().getClassLoader();
      URL resource = contextClassLoader.getResource("META-INF/resources/dust" + req.getPathInfo());

      if (resource != null) {
        ServletOutputStream outputStream = resp.getOutputStream();
        
        URLConnection connection = resource.openConnection();
        connection.setDoInput(true);
        connection.setDoOutput(true);
        String contentType = connection.getContentType();
        InputStream resourceStream = connection.getInputStream();
        try {
          IOUtils.copy(resourceStream, outputStream);
        }
        finally {
          IOUtils.closeQuietly(resourceStream);
        }
        
        resp.setContentType(contentType);
        outputStream.flush();
        outputStream.close();
      }
      else
        resp.setStatus(404);
  }
}

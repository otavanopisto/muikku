package fi.otavanopisto.muikku;

import java.io.IOException;
import java.io.PrintWriter;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;

@WebServlet(name = "JavaScriptLocaleServlet", urlPatterns = "/JavaScriptLocales")
public class JavaScriptLocaleServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;

  @Inject
  private LocaleController localeController;

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/javascript");
    PrintWriter writer = response.getWriter();
    writer.write(localeController.getJsLocales(LocaleUtils.toLocale(request.getParameter("lang"))));
    writer.flush();
    writer.close();
  }

  @Override
  protected long getLastModified(HttpServletRequest req) {
    Long lastModified = localeController.getJsLastModified((LocaleUtils.toLocale(req.getParameter("lang"))));
    if (lastModified != null) {
    	return lastModified;
    }
    
    return super.getLastModified(req);
  }

}

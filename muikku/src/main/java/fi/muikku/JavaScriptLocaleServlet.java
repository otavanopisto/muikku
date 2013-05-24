package fi.muikku;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.muikku.i18n.LocaleBackingBean;

@WebServlet(urlPatterns = "/JavaScriptLocales")
public class JavaScriptLocaleServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;

  @Inject
  private LocaleBackingBean localeBackingBean;

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/javascript");
    ServletOutputStream out = response.getOutputStream();
    out.println(localeBackingBean.getJsLocales(request.getLocale()));
    out.flush();
    out.close();
  }

  @Override
  protected long getLastModified(HttpServletRequest req) {
    return localeBackingBean.getJsLastModified(req.getLocale().getLanguage());
  }

}

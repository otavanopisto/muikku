package fi.muikku;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.i18n.JavaScriptMessages;

@WebServlet (urlPatterns = "/JavaScriptLocales")
public class JavaScriptLocaleServlet extends HttpServlet {
  
  // TODO refactor to jQuery?

	private static final long serialVersionUID = 1L;

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Locale locale = request.getLocale();
    
    Map<String, String> localeStrings = new HashMap<String, String>();

    ResourceBundle resourceBundle = JavaScriptMessages.getInstance().getResourceBundle(locale);
    Enumeration<String> keys = resourceBundle.getKeys();
    while (keys.hasMoreElements()) {
      String key = keys.nextElement();
      String value = resourceBundle.getString(key);
      localeStrings.put(key, value.trim());
    }

    Map<String, String> settingStrings = new HashMap<String, String>();
    DateFormat shortDate = SimpleDateFormat.getDateInstance(DateFormat.SHORT, locale);
    DateFormat longDate = SimpleDateFormat.getDateInstance(DateFormat.LONG, locale);
    DateFormat time = SimpleDateFormat.getTimeInstance(DateFormat.SHORT, locale);

    if (shortDate instanceof SimpleDateFormat)
      settingStrings.put("dateFormatShort", ((SimpleDateFormat) shortDate).toPattern());
    if (longDate instanceof SimpleDateFormat)
      settingStrings.put("dateFormatLong", ((SimpleDateFormat) longDate).toPattern());
    if (time instanceof SimpleDateFormat)
      settingStrings.put("timeFormat", ((SimpleDateFormat) time).toPattern());

    
    Map<String, Object> result = new HashMap<String, Object>();
    result.put("localeStrings", localeStrings);
    result.put("settings", settingStrings);
    result.put("statusCode", 0);
    result.put("messages", new ArrayList<>());
    
    ServletOutputStream outputStream = response.getOutputStream();
    ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(outputStream, result);
    outputStream.flush();
    outputStream.close();
	}
	
}

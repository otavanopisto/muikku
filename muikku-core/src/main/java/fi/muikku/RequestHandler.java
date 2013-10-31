package fi.muikku;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface RequestHandler {

	public boolean handleRequest(HttpServletRequest request, HttpServletResponse response) throws IOException;
	
}

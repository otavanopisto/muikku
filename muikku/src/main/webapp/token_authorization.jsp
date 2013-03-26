<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
  RequestDispatcher dispatcher = request.getRequestDispatcher("token_authorization.jsf");
  if (dispatcher == null) {
    response.setStatus(java.net.HttpURLConnection.HTTP_NOT_FOUND);
    return;
  }

  try {
    /**
    request.setAttribute("oauth_consumer_id", request.getAttribute("oauth_consumer_id"));
    request.setAttribute("oauth_consumer_display", request.getAttribute("oauth_consumer_id"));
    request.setAttribute("oauth_consumer_scopes", request.getAttribute("oauth_consumer_id"));
    request.setAttribute("oauth_consumer_permissions", request.getAttribute("oauth_consumer_id"));
    request.setAttribute("oauth_request_token", request.getAttribute("oauth_consumer_id"));
    request.setAttribute("oauth_token_confirm_uri",  request.getAttribute("oauth_consumer_id"));
    **/
    
    dispatcher.forward(request, response);
  } catch (Exception ex) {
    response.setStatus(500);
  }
/**
  request.
${oauth_consumer_id}
${oauth_consumer_display}
${oauth_consumer_scopes}
${oauth_consumer_permissions}
${oauth_request_token}
${oauth_token_confirm_uri}
**/
%>
package fi.otavanopisto.muikku.utils;

public class RequestUtils {

  public static String getViewIdWithRedirect(String viewId){
    if (viewId == null) {
      return null;
    }
    if (viewId.contains("?")) {
      return viewId + "&faces-redirect=true";
    } else {
      return viewId + "?faces-redirect=true";
    }
  }
}
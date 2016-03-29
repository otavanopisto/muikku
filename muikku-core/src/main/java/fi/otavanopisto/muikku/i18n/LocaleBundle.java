package fi.otavanopisto.muikku.i18n;

import java.util.ResourceBundle;

public class LocaleBundle {
  
  public LocaleBundle(LocaleLocation location, ResourceBundle bundle) {
    this.location = location;
    this.bundle = bundle;
  }
  
  public LocaleLocation getLocation() {
    return location;
  }

  public ResourceBundle getBundle() {
    return bundle;
  }

  private LocaleLocation location;
  private ResourceBundle bundle;


}

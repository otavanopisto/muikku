package fi.otavanopisto.muikku.controller;

import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.session.SessionController;

@Model
@Stateful
@Named ("muikku")
public class MuikkuController {
  
  @Inject
  private SessionController sessionController;

  public void setLanguage(String lang) {
    sessionController.setLocale(new Locale(lang));
  }
}

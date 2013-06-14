package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.plugins.seeker.DefaultSeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.session.SessionController;

public class CalendarSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    String searchTerms = localeController.getText(sessionController.getLocale(), "plugin.calendar.seekersearchterms").toLowerCase();
    
    if (searchTerms.contains(searchTerm.toLowerCase())) {
      result.add(new DefaultSeekerResultImpl(
          localeController.getText(sessionController.getLocale(), "plugin.calendar.seekerCaption"), 
          null,
          "/calendar/index.jsf",
          "/resources/gfx/icons/32x32/actions/navigate-cal.png"));
    }
    
    return result; 
  }
}

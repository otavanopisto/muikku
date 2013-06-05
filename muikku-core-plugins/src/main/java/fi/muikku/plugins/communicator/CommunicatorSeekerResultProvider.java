package fi.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.session.SessionController;

public class CommunicatorSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    Locale locale = sessionController.getLocale();
    
    String caption = localeController.getText(locale, "plugin.communicator.seekercategory");
    String searchtTerms = localeController.getText(locale, "plugin.communicator.seekersearchterms");
    
    if (searchtTerms.contains(searchTerm))
      result.add(new SeekerResultImpl(caption, "communicator/communicator_seekerresult.dust"));
    
    return result; 
  }
}

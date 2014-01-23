package fi.muikku.plugins.guidancerequest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.session.SessionController;

public class GuidanceRequestSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    String searchTerms = "ohjauspyyntö"; 
//        localeController.getText(sessionController.getLocale(), "plugin.communicator.seekersearchterms").toLowerCase();
    
    if (searchTerms.contains(searchTerm.toLowerCase()))
      result.add(new SeekerResultImpl("guidancerequest/guidancerequest_seekerresult.dust"));
    
    return result; 
  }
}

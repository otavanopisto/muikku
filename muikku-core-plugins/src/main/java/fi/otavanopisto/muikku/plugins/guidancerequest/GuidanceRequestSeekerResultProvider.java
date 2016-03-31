package fi.otavanopisto.muikku.plugins.guidancerequest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultProvider;
import fi.otavanopisto.muikku.session.SessionController;

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
// Removed until communicator works    
//    if (searchTerms.contains(searchTerm.toLowerCase()))
//      result.add(new SeekerResultImpl("guidancerequest/guidancerequest_seekerresult.dust"));
    
    return result; 
  }

  @Override
  public String getName() {
    return "Guidance request";
  }

  @Override
  public int getWeight() {
    return 1;
  }
}

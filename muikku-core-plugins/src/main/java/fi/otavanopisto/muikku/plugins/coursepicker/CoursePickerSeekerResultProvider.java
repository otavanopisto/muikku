package fi.otavanopisto.muikku.plugins.coursepicker;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultImpl;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultProvider;
import fi.otavanopisto.muikku.session.SessionController;

public class CoursePickerSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    String searchTerms = localeController.getText(sessionController.getLocale(), "plugin.coursepicker.seekersearchterms").toLowerCase();
 

     if (searchTerms.contains(searchTerm.toLowerCase()))
       result.add(new SeekerResultImpl("coursepicker/coursepicker_seekerresult.dust"));
    
    return result; 
  }

  @Override
  public String getName() {
    return "Courses";
  }

  @Override
  public int getWeight() {
    return 1;
  }
}

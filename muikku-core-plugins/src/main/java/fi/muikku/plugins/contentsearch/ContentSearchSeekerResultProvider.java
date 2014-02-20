package fi.muikku.plugins.contentsearch;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResultProvider;

public class ContentSearchSeekerResultProvider implements SeekerResultProvider {

  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    String searchTerms = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."; 
    if (searchTerms.contains(searchTerm.toLowerCase())) {
      result.add(new SeekerResultImpl("contentsearch/content_seekerresult.dust"));
    }
      
    return result; 
  }
}

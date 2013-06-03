package fi.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResultProvider;

public class CommunicatorSeekerResultProvider implements SeekerResultProvider {

  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    String caption = "New message";
    if (caption.toLowerCase().contains(searchTerm.toLowerCase())) {
      result.add(new SeekerResultImpl(
          caption, "Communicator", "/communicator/index.jsf#new", ""));
    }
    
    caption = "Mail settings";
    if (caption.toLowerCase().contains(searchTerm.toLowerCase())) {
      result.add(new SeekerResultImpl(
          caption, "Communicator", "/communicator/index.jsf#settings", ""));
    }
    return result; 
  }
}

package fi.muikku.plugins.fish;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.fish.dao.FishMessageDAO;

@Dependent
@Stateful
public class DatabaseFishWidgetController {
  
  @Inject
  private FishMessageDAO fishMessageDAO;
  
  public String getText(int index) {
    try {
      return fishMessageDAO.listAll(index, 1).get(0).getContent();
    } catch (IndexOutOfBoundsException ex) {
      throw new IndexOutOfBoundsException("Fish message index out of bounds.");
    }
  }
  
  public Long getCount() {
    return fishMessageDAO.count();
  }
}

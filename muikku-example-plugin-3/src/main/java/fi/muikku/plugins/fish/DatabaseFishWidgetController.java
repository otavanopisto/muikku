package fi.otavanopisto.muikku.plugins.fish;

import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.fish.dao.FishMessageDAO;
import fi.otavanopisto.muikku.plugins.fish.model.FishMessage;

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
  
  public List<FishMessage> getAllMessages() {
    return Collections.unmodifiableList(fishMessageDAO.listAll());
  }
  
  public void addText(String text) {
    fishMessageDAO.create(text);
  }
  
  public void removeById(Long id) {
    fishMessageDAO.delete(fishMessageDAO.findById(id));
  }
}
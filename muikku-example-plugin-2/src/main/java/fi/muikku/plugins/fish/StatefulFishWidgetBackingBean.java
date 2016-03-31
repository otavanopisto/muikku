package fi.otavanopisto.muikku.plugins.fish;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;

import java.io.Serializable;
import java.util.Random;

@Named
@SessionScoped
public class StatefulFishWidgetBackingBean implements Serializable {
  /**
   * 
   */
  private static final long serialVersionUID = 599838785344712550L;
  
  @Inject
  private StatefulFishWidgetController fishWidgetController;
  
  public String getText() {
    int index;
    do {
      index = new Random().nextInt(fishWidgetController.getCount());
    } while (index == oldIndex);
    oldIndex = index;
    return fishWidgetController.getText(index);
  }
  
  private int oldIndex = -1;
}

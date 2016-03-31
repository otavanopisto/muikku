package fi.otavanopisto.muikku.plugins.fish;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.Random;

@Named
@RequestScoped
public class LocalizedFishWidgetBackingBean {
  @Inject
  private LocalizedFishWidgetController fishWidgetController;
  
  public String getText() {
    int index = new Random().nextInt(fishWidgetController.getCount());
    return fishWidgetController.getText(index);
  }
}

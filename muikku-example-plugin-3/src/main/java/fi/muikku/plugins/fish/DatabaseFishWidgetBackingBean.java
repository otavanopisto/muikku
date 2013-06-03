package fi.muikku.plugins.fish;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import java.util.Random;

@Named
@RequestScoped
public class DatabaseFishWidgetBackingBean {
  @Inject
  private DatabaseFishWidgetController fishWidgetController;

  public String getText() {
    Long count = fishWidgetController.getCount();
    if (count == null || count == 0) {
      return "No messages.";
    } else if (count > Integer.MAX_VALUE) {
      return "Too many messages.";
    } else {
      int index = new Random().nextInt(count.intValue());
      return fishWidgetController.getText(index);
    }
  }
}

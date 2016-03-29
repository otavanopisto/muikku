package fi.otavanopisto.muikku.plugins.fish;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.plugins.fish.model.FishMessage;
import fi.otavanopisto.muikku.session.SessionController;

import java.util.List;
import java.util.Random;

@Named
@RequestScoped
public class DatabaseFishWidgetBackingBean {
  @Inject
  private DatabaseFishWidgetController fishWidgetController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;

  public String getText() {
    Long count = fishWidgetController.getCount();
    if (count == null || count == 0) {
      return localeController.getText(sessionController.getLocale(), "plugin.fish.noMessages");
    } else if (count > Integer.MAX_VALUE) {
      return localeController.getText(sessionController.getLocale(), "plugin.fish.tooManyMessages");
    } else {
      int index = new Random().nextInt(count.intValue());
      return fishWidgetController.getText(index);
    }
  }
  
  public List<FishMessage> getAllMessages() {
    return fishWidgetController.getAllMessages();
  }
  
  public void removeById(Long id) {
    fishWidgetController.removeById(id);
  }
  
  public String getPendingMessage() {
    return pendingMessage;
  }

  public void setPendingMessage(String pendingMessage) {
    this.pendingMessage = pendingMessage;
  }
  
  public void submitPendingMessage() {
    fishWidgetController.addText(pendingMessage);
    pendingMessage = "";
  }

  private String pendingMessage = ""; 
}

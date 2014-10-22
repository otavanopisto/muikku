package fi.muikku.plugins.seeker.defaultproviders;

import java.util.Map;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultParser;
import fi.muikku.session.SessionController;

public class UserSeekerResultParser implements SeekerResultParser{

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public String getIndexType() {
    return "LocalUser";
  }

  @Override
  public SeekerResult parse(Map<String, Object> entry) {
    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.users");
    String label = "";
      for (String key : entry.keySet()) {
        if (key != "indexType") {
          Object value = entry.get(key);
          if (value instanceof String) {
            label += entry.get(key) + " ";
          }
        }
      }
    return new UserSeekerResult(label, caption,"/user/"+entry.get("id"), "/tmp/userprofile.png");
  }

}

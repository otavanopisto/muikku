package fi.otavanopisto.muikku.plugins.seeker.defaultproviders;

import java.util.Map;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultParser;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

public class UserSeekerResultParser implements SeekerResultParser {

  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;

  @Override
  public String getIndexType() {
    return "User";
  }

  @Override
  public SeekerResult parse(Map<String, Object> entry) {
    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.users");
    StringBuilder labelBuilder = new StringBuilder();
    
    if (entry.containsKey("firstName")) {
      labelBuilder.append(entry.get("firstName"));
    }

    if (entry.containsKey("lastName")) {
      if (labelBuilder.length() > 0) {
        labelBuilder.append(' ');
      }
      
      labelBuilder.append(entry.get("lastName"));
    }
    
    // TODO: Validate
    String[] id = ((String) entry.get("id")).split("/", 2);
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(id[1], id[0]);
    
    if (userEntity != null)
      return new UserSeekerResult(labelBuilder.toString(), caption, "/user/" + userEntity.getId(), "/tmp/userprofile.png"); //TODO: remove image url
    else
      return null;
  }

}

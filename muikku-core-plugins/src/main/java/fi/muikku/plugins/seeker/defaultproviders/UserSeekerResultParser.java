package fi.muikku.plugins.seeker.defaultproviders;

import java.util.Map;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultParser;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserEntityController;

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
    return new UserSeekerResult(labelBuilder.toString(), caption, "/user/" + userEntity.getId(), "/tmp/userprofile.png"); //TODO: remove image url
  }

}

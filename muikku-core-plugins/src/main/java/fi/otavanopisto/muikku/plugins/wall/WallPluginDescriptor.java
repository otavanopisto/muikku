package fi.otavanopisto.muikku.plugins.wall;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.plugin.PrioritizedPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.users.UserController;

public class WallPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor, PrioritizedPluginDescriptor {

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WallController wallController;

  @Inject
  private UserController userController;
  
  @Override
  public void init() {
	  // Initialize workspace walls
//	  
//	  List<WorkspaceEntity> workspaceEntities = workspaceController.listWorkspaceEntities();
//	  for (WorkspaceEntity workspaceEntity : workspaceEntities) {
//	    WorkspaceWall workspaceWall = wallController.findWorkspaceWall(workspaceEntity);
//	    if (workspaceWall == null)
//	      wallController.createWorkspaceWall(workspaceEntity);
//	  }
//
//	  // Init user walls
//	  
//    List<UserEntity> userEntities = userController.listUserEntities();
//    for (UserEntity userEntity : userEntities) {
//      UserWall userWall = wallController.findUserWall(userEntity);
//      if (userWall == null)
//        wallController.createUserWall(userEntity);
//    }
	}
  
  @Override
  public String getName() {
    return "wall";
  }
  
	@Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.wall.WallJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.wall.WallJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

  @Override
  public int getPriority() {
    return PrioritizedPluginDescriptor.NORMAL + 1;
  }
}

package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugin.TranquilEntityLookup;
import fi.muikku.plugin.TranquilEntityLookups;
import fi.muikku.plugin.TranquilEntityLookupsImpl;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestPluginDescriptor;
import fi.muikku.plugins.calendar.CalendarPluginDescriptor;
import fi.muikku.plugins.communicator.CommunicatorPluginDescriptor;
import fi.muikku.plugins.contentsearch.ContentSearchPluginDescriptor;
import fi.muikku.plugins.courselist.CourseListPluginDescriptor;
import fi.muikku.plugins.coursepicker.CoursePickerPluginDescriptor;
import fi.muikku.plugins.data.DataPluginDescriptor;
import fi.muikku.plugins.data.PermissionDataPluginDescriptor;
import fi.muikku.plugins.externallogin.ExternalLoginPluginDescriptor;
import fi.muikku.plugins.forum.ForumPluginDescriptor;
import fi.muikku.plugins.friends.FriendsPluginDescriptor;
import fi.muikku.plugins.grading.GradingPluginDescriptor;
import fi.muikku.plugins.guidancerequest.GuidanceRequestPluginDescriptor;
import fi.muikku.plugins.internallogin.InternalLoginPluginDescriptor;
import fi.muikku.plugins.language.LanguagePluginDescriptor;
import fi.muikku.plugins.loggeduser.LoggedUserPluginDescriptor;
import fi.muikku.plugins.logout.LogoutPluginDescriptor;
import fi.muikku.plugins.material.MaterialPluginDescriptor;
import fi.muikku.plugins.schooldatalocal.SchoolDataLocalPluginDescriptor;
import fi.muikku.plugins.seeker.SeekerPluginDescriptor;
import fi.muikku.plugins.settings.SettingsPluginDescriptor;
import fi.muikku.plugins.students.StudentsPluginDescriptor;
import fi.muikku.plugins.user.UserPluginDescriptor;
import fi.muikku.plugins.wall.WallPluginDescriptor;
import fi.muikku.plugins.workspace.WorkspacePluginDescriptor;

public class CorePluginsDescriptor implements PluginLibraryDescriptor {
	
	@Inject
	private Logger logger;

	@Override
	public String getName() {
		return "core-plugins";
	}
	
	@Override
	public List<Class<? extends PluginDescriptor>> getPlugins() {
		return new ArrayList<Class<? extends PluginDescriptor>>(Arrays.asList(
		  CalendarPluginDescriptor.class,
		  InternalLoginPluginDescriptor.class,
      ExternalLoginPluginDescriptor.class,
      LogoutPluginDescriptor.class,
      LanguagePluginDescriptor.class,
		  CommunicatorPluginDescriptor.class,
      CoursePickerPluginDescriptor.class,
      ForumPluginDescriptor.class,
      WallPluginDescriptor.class,
      SeekerPluginDescriptor.class,
      GradingPluginDescriptor.class,
      SettingsPluginDescriptor.class,
      DataPluginDescriptor.class,
      SchoolDataLocalPluginDescriptor.class,
      WorkspacePluginDescriptor.class,
      MaterialPluginDescriptor.class,
      AssessmentRequestPluginDescriptor.class,
      CourseListPluginDescriptor.class,
      FriendsPluginDescriptor.class,
      LoggedUserPluginDescriptor.class,
      UserPluginDescriptor.class,
      StudentsPluginDescriptor.class,
      GuidanceRequestPluginDescriptor.class,
      PermissionDataPluginDescriptor.class,
      ContentSearchPluginDescriptor.class
		));
	}
	
	@TranquilEntityLookup
	@Produces
	public TranquilEntityLookups productTranquilityEntityFactory() {
		try {
			return new TranquilEntityLookupsImpl(
			  fi.muikku.plugins.coreplugins.BaseLookup.class,
				fi.muikku.plugins.coreplugins.CompactLookup.class,
				fi.muikku.plugins.coreplugins.CompleteLookup.class
			);
		} catch (InstantiationException | IllegalAccessException e) {
			logger.log(Level.SEVERE, "Could not initialize tranquility entity factory for core plugins", e);
			return null;
		}
	}
}

package fi.otavanopisto.muikku.plugins.chat;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.infinispan.configuration.global.ShutdownHookBehavior;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.MUCRoomEntity;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.rest.model.Student;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.SchoolDataEntity;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.session.SessionController;

@Stateless
public class ChatRoomSyncScheduler {

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CourseMetaController courseMetaController;
    
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private UserChatSettingsDAO userChatSettingsDao;


  @Schedule(second = "0", minute = "0", hour = "*/24", persistent = false)
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateChatRooms() {

	List<Curriculum> curriculums = courseMetaController.listCurriculums();
    
    curriculums.removeIf((curriculum) -> "OPS2005".equals(curriculum.getName()));

	List<UserChatSettings> listUsers = userChatSettingsDao.listAll();
	  
	  if (CollectionUtils.isEmpty(listUsers)) {
	    return;
	  }

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.INFO, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.INFO, "No openfire url set, skipping room sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.INFO, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "Invalid openfire port, skipping room sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);
    
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();
      SearchResult searchResult = null;
      
      List<SchoolDataIdentifier> curriculumIdentifiers = null;
      if (curriculums != null) {
        curriculumIdentifiers = new ArrayList<>(curriculums.size());
        for (Curriculum curriculum : curriculums) {
          SchoolDataIdentifier curriculumIdentifier = SchoolDataIdentifier.fromId(curriculum.getIdentifier().toString());
          if (curriculumIdentifier != null && !"OPS2005".equals(curriculum.getName())) {
            curriculumIdentifiers.add(curriculumIdentifier);
          } 

      }
      
      String searchString = null;
      boolean includeUnpublished = true;
	  int firstResult = 0;
  	  int maxResults = 100;
	  List<Sort> sorts = null;
	  searchResult = searchProvider.searchWorkspaces(null, null, null, null, curriculumIdentifiers, searchString, null, null, includeUnpublished, firstResult, maxResults, sorts);          
	  
	  List<Map<String, Object>> results = searchResult.getResults();
      for (Map<String, Object> result : results) {
    	  String searchId = (String) result.get("id");
          if (StringUtils.isNotBlank(searchId)) {
            String[] id = searchId.split("/", 2);
            if (id.length == 2) {
              String dataSource = id[1];
              String identifier = id[0];
              WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, identifier);
            
              String name = (String) result.get("name");
                
        	  try {
        		// Checking before creating is subject to a race condition, but in the worst
        	    // case
                // the creation just fails, resulting in a log entry
       	        MUCRoomEntity chatRoomEntity = client.getChatRoom(identifier);
        		  if (chatRoomEntity == null) {
        		    logger.log(Level.INFO, "Syncing chat workspace " + name);
        		    // SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(enabledWorkspace.getIdentifier());
        		    if (identifier == null) {
        		      logger.log(Level.WARNING, "Invalid workspace identifier " + identifier + ", skipping...");
        		      continue;
        		    }
        		  
        		    if (workspaceEntity == null) {
        		      logger.log(Level.WARNING, "No workspace entity found for identifier " + identifier + ", skipping...");
        		      continue;
        		    }
        		    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
                String subjectCode = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier()).getCode();
                
        		      String roomName = subjectCode + workspace.getCourseNumber() + " - " + workspace.getNameExtension();
        		      chatRoomEntity = new MUCRoomEntity(identifier, roomName, workspace.getDescription());
        		      client.createChatRoom(chatRoomEntity);

        		      List<WorkspaceUser> workspaceUsers = workspaceController.listWorkspaceStudents(workspaceEntity);
                  List<WorkspaceUser> workspaceStaffs = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
                  
                  for (WorkspaceUser workspaceStaff : workspaceStaffs) {

                    SchoolDataIdentifier memberIdentifier = workspaceStaff.getUserIdentifier();
                    
                    for (UserChatSettings listUser : listUsers) {
                      if (listUser.getUserIdentifier().equals(memberIdentifier.toId())) {
                      client.addAdmin(identifier, memberIdentifier.toId());
                      break;
                      }
                    }
                  }

                  for (WorkspaceUser workspaceUser : workspaceUsers) {

                    SchoolDataIdentifier memberIdentifier = workspaceUser.getUserIdentifier();
                    
                    for (UserChatSettings listUser : listUsers) {
                      if (listUser.getUserIdentifier().equals(memberIdentifier.toId())) {
                        client.addMember(identifier, memberIdentifier.toId());
                        break;
                      }
                    }
                  }
        		    }

        		    } catch (Exception e) {
        		      logger.log(Level.INFO, "Exception when syncing chat workspace " + name, e);
        		    }
            }
          }
        }
      } 
    }
  }
}


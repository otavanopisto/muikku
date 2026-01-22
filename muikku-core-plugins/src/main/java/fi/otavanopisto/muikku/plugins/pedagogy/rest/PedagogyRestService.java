package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyController;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyFormLockWSMessage;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyFormWebsocketMessenger;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormImplementedActions;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.GroupStaffMember;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;
import fi.otavanopisto.muikku.schooldata.entity.UserContactInfo;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/pedagogy")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class PedagogyRestService {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private PedagogyController pedagogyController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;
  
  @Inject
  private UserController userController;

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private PedagogyFormWebsocketMessenger pedagogyFormWebSocketMessenger;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  /**
   * mApi().pedagogy.form.access.read(123);
   */
  @Path("/form/{STUDENTIDENTIFIER}/access")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAccesss(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    
    return Response.ok(getAccess(userEntity.getId(), true, PedagogyFormAccessType.READ, false)).build();
  }
  
  /**
   * mApi().pedagogy.form.create(123, {formData: String});
   */
  @Path("/form/{STUDENTIDENTIFIER}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createForm(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormCreatePayload payload) {
    
    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    // Payload validation
    
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntity.getId());
    if (form != null) {
      return Response.status(Status.BAD_REQUEST).entity("Form already exists").build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), false, PedagogyFormAccessType.WRITE, false);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    form = pedagogyController.createForm(userEntity.getId(), payload.getFormData());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.read(123);
   */
  @Path("/form/{STUDENTIDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getForm(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    UserEntity userEntity = toUserEntity(studentIdentifier);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), true, PedagogyFormAccessType.READ, false);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntity.getId());
    
    // If the form doesn't exist (or exists but isn't yet published to the student), return an empty object
    
    if (form == null || (form.getPublished() == null && userEntityController.isStudent(sessionController.getLoggedUserEntity()))) {
      return Response.ok(toRestModel((PedagogyForm) null, userEntity.getId())).build();
    }
    else {
      
      // Add history item about the caller having viewed the form and add them to receive websocket messages about it
      
      pedagogyController.createViewHistory(form, sessionController.getLoggedUserEntity().getId());
      pedagogyFormWebSocketMessenger.registerUser(studentIdentifier, sessionController.getLoggedUserEntity().getId());
    }
    return Response.ok(toRestModel(form)).build();
  }

  /**
   * mApi().pedagogy.form.formData.update(123, {formData: String, fields: [String], details: String});
   */
  @Path("/form/{STUDENTIDENTIFIER}/formData")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateFormData(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormUpdatePayload payload) {
    
    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntity.getId());
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %d not found", userEntity.getId())).build();
    }
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), false, PedagogyFormAccessType.WRITE, false);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Form data update
    
    form = pedagogyController.updateFormData(form, payload.getFormData(), payload.getFields(), payload.getDetails(), sessionController.getLoggedUserEntity().getId());
    
    PedagogyFormRestModel restModel = toRestModel(form);
    
    // Websocket only if published
    
    if (form.getPublished() != null) {
      pedagogyFormWebSocketMessenger.sendMessage(userEntity.defaultSchoolDataIdentifier().toId(), "pedagogy:pedagogy-form-updated", restModel);
    }
    return Response.ok(restModel).build();
  }
  
  @Path("/form/{STUDENTIDENTIFIER}/publish")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response togglePublished(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntity.getId());
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %d not found", userEntity.getId())).build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), false, PedagogyFormAccessType.WRITE, false);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Form data update
    
    form = pedagogyController.updatePublished(form, sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.implementedActions.read(123);
   */
  @Path("/form/implementedActions/{STUDENTIDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getFormImplementedActions(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), true, PedagogyFormAccessType.READ, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    PedagogyFormImplementedActions form = pedagogyController.findFormImplementedActionsByUserEntityId(userEntity.getId());

    if (form == null) {
      return Response.status(Status.NO_CONTENT).entity(String.format("Form not found for student %s", studentIdentifier)).build();
    }
    // User registration for websocket
    pedagogyFormWebSocketMessenger.registerUser(userEntity.defaultSchoolDataIdentifier().toId(), sessionController.getLoggedUserEntity().getId());

    return Response.ok(toRestModel(form, userEntity.getId())).build();
    
  }
  
  /**
   * mApi().pedagogy.form.implementedActions.formData.update(123, {formData: String, fields: [String], details: String});
   */
  @Path("/form/implementedActions/{STUDENTIDENTIFIER}/formData")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateFormDataImplementedActions(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormImplementedActionsCreatePayload payload) {
    
    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    
    // Payload validation
    
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }
    
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), false, PedagogyFormAccessType.WRITE, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    PedagogyFormImplementedActions form = pedagogyController.findFormImplementedActionsByUserEntityId(userEntity.getId());
    
    // Create form
    if (form == null) {
      form = pedagogyController.createFormForImplementedActions(userEntity.getId(), payload.getFormData());
    } else { // Update form
      form = pedagogyController.updateFormDataImplementedActions(form, payload.getFormData());
    }
    PedagogyFormImplementedActionsRestModel restModel = toRestModel(form, userEntity.getId());
    
    // Websocket
    pedagogyFormWebSocketMessenger.sendMessage(userEntity.defaultSchoolDataIdentifier().toId(), "pedagogy:implemented-support-actions-updated", restModel);

    return Response.ok(restModel).build();
  }
  
  @Path("/form/{STUDENTIDENTIFIER}/workspaces")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaces(@PathParam("STUDENTIDENTIFIER") String studentIdentifier,
      @QueryParam("q") String searchString,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults) {

    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), true, PedagogyFormAccessType.READ, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Search provider
    
    SearchProvider searchProvider = null;
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      searchProvider = searchProviderIterator.next();
    }
    if (searchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Missing search provider").build();
    }
    
    // List of student's current and past workspaces
    
    SchoolDataIdentifier sdi = userEntity.defaultSchoolDataIdentifier();
    List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifierIncludeArchived(sdi);
    if (workspaceEntities.isEmpty()) {
      return Response.ok(Collections.emptyList()).build();
    }
    List<SchoolDataIdentifier> workspaceIdentifierFilters = new ArrayList<>();
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      workspaceIdentifierFilters.add(workspaceEntity.schoolDataIdentifier());
    }
    
    // Organization restrictions

    List<OrganizationEntity> loggedUserOrganizations = organizationEntityController.listLoggedUserOrganizations();
    List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(loggedUserOrganizations, PublicityRestriction.ONLY_PUBLISHED, TemplateRestriction.ONLY_WORKSPACES);
    organizationRestrictions = organizationRestrictions.stream()
        .map(organizationRestriction -> new OrganizationRestriction(organizationRestriction.getOrganizationIdentifier(), PublicityRestriction.LIST_ALL, TemplateRestriction.ONLY_WORKSPACES))
        .collect(Collectors.toList());

    // Search

    SearchResult searchResult = searchProvider.searchWorkspaces()
        .setWorkspaceIdentifiers(workspaceIdentifierFilters)
        .setOrganizationRestrictions(organizationRestrictions)
        .setFreeText(searchString)
        .setFirstResult(firstResult)
        .setMaxResults(maxResults)
        .search();
    
    // Return object
    
    List<PedagogyWorkspaceRestModel> pedagogyWorkspaces = new ArrayList<>();
    List<Map<String, Object>> results = searchResult.getResults();
    for (Map<String, Object> result : results) {
      String searchId = (String) result.get("id");
      if (StringUtils.isNotBlank(searchId)) {
        String[] id = searchId.split("/", 2);
        if (id.length == 2) {
          String identifier = id[0];
          WorkspaceEntity workspaceEntity = workspaceEntities.stream().filter(w -> identifier.equals(w.getIdentifier())).findFirst().orElse(null);
          if (workspaceEntity != null) {
            Long workspaceEntityId = workspaceEntity.getId();
            String urlName = workspaceEntity.getUrlName();
            String name = (String) result.get("name");
            String nameExtension = (String) result.get("nameExtension");
            pedagogyWorkspaces.add(new PedagogyWorkspaceRestModel(workspaceEntityId, urlName, name, nameExtension));
          }
        }
      }
    }
    return Response.ok(pedagogyWorkspaces).build();
  }
  
  @GET
  @Path("/form/student/{STUDENTIDENTIFIER}/lock")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getPedagogyFormLock(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {

    UserEntity userEntity = toUserEntity(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    // Access check
    SchoolDataIdentifier schoolDataIdentifier = userEntity.defaultSchoolDataIdentifier();
    
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), true, PedagogyFormAccessType.READ, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Return value

    PedagogyFormLockRestModel pedagogyFormLock = null;
    UserIdentifierProperty pedagogyProperty = userEntityController.getUserIdentifierPropertyByKey(schoolDataIdentifier.getIdentifier(), "pedagogyFormLock");
    if (pedagogyProperty != null && !StringUtils.isBlank(pedagogyProperty.getValue())) {
      try {
        pedagogyFormLock = new ObjectMapper().readValue(pedagogyProperty.getValue(), PedagogyFormLockRestModel.class);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Error deserializing pedagogy form lock", e);
      }
    }

    if (pedagogyFormLock == null) {
      pedagogyFormLock = new PedagogyFormLockRestModel();
    }

    return Response.ok(pedagogyFormLock).build();
  }
  
  @PUT
  @Path("/form/student/{STUDENTIDENTIFIER}/lock")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updatePedagogyFormLock(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, PedagogyFormLockRestModel payload) {

    // Access check
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);

    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    PedagogyFormAccessRestModel access = getAccess(userEntity.getId(), true, PedagogyFormAccessType.WRITE, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Create/update

    if (payload.isLocked()) {
      payload.setUserEntityId(sessionController.getLoggedUserEntity().getId());
      payload.setUserName(userEntityController.getName(sessionController.getLoggedUserEntity(), true).getDisplayNameWithLine());
      try {
        userEntityController.setUserIdentifierProperty(studentIdentifier.getIdentifier(), "pedagogyFormLock",  new ObjectMapper().writeValueAsString(payload));
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Error serializing pedagogy form lock", e);
      }
    }
    else {
      payload.setUserEntityId(null);
      payload.setUserName(null);
      userEntityController.setUserIdentifierProperty(studentIdentifier.getIdentifier(), "pedagogyFormLock", null);
    }

    PedagogyFormLockWSMessage msg = new PedagogyFormLockWSMessage();
    msg.setLocked(payload.isLocked());
    msg.setUserEntityId(payload.getUserEntityId());
    msg.setUserName(payload.getUserName());
    msg.setStudentIdentifier(studentIdentifier.toId());
    pedagogyFormWebSocketMessenger.sendMessage(studentIdentifier.toId(), "pedagogy:lock-updated", msg);
    return Response.ok(payload).build();
  }
  
  private PedagogyFormRestModel toRestModel(PedagogyForm form) {
    return toRestModel(form, form.getUserEntityId());
  }

  private PedagogyFormRestModel toRestModel(PedagogyForm form, Long userEntityId) {
    PedagogyFormRestModel model = new PedagogyFormRestModel();

    // Owner and student contact info

    UserEntity studentEntity = userEntityController.findUserEntityById(userEntityId);
    SchoolDataIdentifier identifier = studentEntity.defaultSchoolDataIdentifier();
    UserContactInfo contactInfo = userController.getStudentContactInfo(identifier.getDataSource(),
        identifier.getIdentifier());
    model.setStudentInfo(toMap(contactInfo));

    // For form owner, only return name, email, and phone number

    Long formCreator = getFormCreator(form);
    if (formCreator != null) {
      model.setOwnerId(formCreator);
      UserEntity userEntity = userEntityController.findUserEntityById(formCreator);
      if (userEntity != null) {
        UserEntityName userEntityName = userEntityController.getName(userEntity.defaultSchoolDataIdentifier(), true);
        String email = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false);
        // Note: Phone number from Muikku, not Pyramus
        UserEntityProperty phoneProperty = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-phone");
        Map<String, String> properties = new HashMap<>();
        properties.put("firstName", userEntityName.getFirstName());
        properties.put("lastName", userEntityName.getLastName());
        properties.put("email", email);
        properties.put("phoneNumber", phoneProperty == null ? null : phoneProperty.getValue());
        model.setOwnerInfo(properties);
      }
    }
    model.setUserEntityId(userEntityId);

    // Normal fields

    if (form != null) {
      model.setFormData(form.getFormData());
      model.setId(form.getId());
      model.setPublished(form.getPublished());

      // Form history

      List<PedagogyFormHistoryRestModel> historyModelList = new ArrayList<>();
      List<PedagogyFormHistory> historyList = pedagogyController.listHistory(form);
      if (!historyList.isEmpty()) {
        // Temporary cache for names and avatars
        Map<Long, UserEntityName> names = new HashMap<>();
        Set<Long> avatars = new HashSet<>();
        for (PedagogyFormHistory historyItem : historyList) {
          PedagogyFormHistoryRestModel historyModel = new PedagogyFormHistoryRestModel();
          historyModel.setDate(historyItem.getCreated());
          historyModel.setDetails(historyItem.getDetails());
          if (!StringUtils.isEmpty(historyItem.getFields())) {
            historyModel.setEditedFields(Arrays.asList(historyItem.getFields().split(",")));
          }
          // Cache name and avatar
          if (!names.containsKey(historyItem.getCreator())) {
            UserEntity userEntity = userEntityController.findUserEntityById(historyItem.getCreator());
            names.put(historyItem.getCreator(), userEntityController.getName(userEntity, true));
            if (userEntityFileController.hasProfilePicture(userEntity)) {
              avatars.add(historyItem.getCreator());
            }
          }
          historyModel.setType(historyItem.getType());
          historyModel.setModifierHasAvatar(avatars.contains(historyItem.getCreator()));
          historyModel.setModifierId(historyItem.getCreator());
          historyModel.setModifierName(names.get(historyItem.getCreator()).getDisplayName());
          historyModelList.add(historyModel);
        }

        // Form creation date is the date of the first history item

        model.setCreated(historyList.get(historyList.size() - 1).getCreated());
      }
      model.setHistory(historyModelList);
    }
    else {
      model.setHistory(Collections.emptyList());
    }

    // Study guiders & counselors
    List<String> counselorNames = new ArrayList<>();
    List<String> studyAdvisors = new ArrayList<>();
    List<String> groupAdvisors = new ArrayList<>();

    // Counselors & guiders
    List<GroupStaffMember> studentGuidanceCounselors = userSchoolDataController
        .listStudentGuidanceCounselors(identifier, false);

    for (GroupStaffMember counselor : studentGuidanceCounselors) {
      UserEntityName userName = userEntityController.getName(counselor.userSchoolDataIdentifier(), true);

      counselorNames.add(userName.getDisplayName());

      if (counselor.isGroupAdvisor()) {
        groupAdvisors.add(userName.getDisplayName());
      }

      if (counselor.isStudyAdvisor()) {
        studyAdvisors.add(userName.getDisplayName());
      }
    }

    model.setCounselors(counselorNames);
    model.setGroupAdvisors(groupAdvisors);
    model.setStudyAdvisors(studyAdvisors);

    return model;
  }
  

  private PedagogyFormImplementedActionsRestModel toRestModel(PedagogyFormImplementedActions form, Long userEntityId) {
    PedagogyFormImplementedActionsRestModel model = new PedagogyFormImplementedActionsRestModel();
    
    model.setUserEntityId(userEntityId);
    
    if (form != null) {
      model.setFormData(form.getFormData());
      model.setId(form.getId());
    }
    
    return model;
  }
  private Map<String, String> toMap(UserContactInfo contactInfo) {
    if (contactInfo == null) {
      return null;
    }
    Map<String, String> infoMap = new HashMap<>();
    infoMap.put("firstName", contactInfo.getFirstName());
    infoMap.put("lastName", contactInfo.getLastName());
    infoMap.put("dateOfBirth", contactInfo.getDateOfBirth() == null ? null : contactInfo.getDateOfBirth().toString());
    infoMap.put("phoneNumber", contactInfo.getPhoneNumber());
    infoMap.put("addressName", contactInfo.getAddressName());
    infoMap.put("streetAddress", contactInfo.getStreetAddress());
    infoMap.put("zipCode", contactInfo.getZipCode());
    infoMap.put("city", contactInfo.getCity());
    infoMap.put("country", contactInfo.getCountry());
    infoMap.put("email", contactInfo.getEmail());
    return infoMap;
  }
  
  enum PedagogyFormAccessType {
    READ,
    WRITE
  }
  
  private PedagogyFormAccessRestModel getAccess(Long userEntityId, boolean allowStudent, PedagogyFormAccessType accessType, boolean implementedActions) {

    // Master access flag and various roles
    
    boolean accessible = false;
    boolean specEdTeacher = false;
    boolean guidanceCounselor = false;
    boolean courseTeacher = false;
    boolean studentParent = false;
    boolean manager = false;
    boolean studyProgrammeLeader = false;
    
    // Students can always access their own form
    
    if (sessionController.getLoggedUserEntity().getId().equals(userEntityId)) {
      accessible = allowStudent;
    }
    else {
      
      // For staff members or student parents, access is based on (guidance) relation

      PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntityId);
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();
      StudentGuidanceRelation relation = userController.getGuidanceRelation(identifier.getDataSource(), identifier.getIdentifier());
      
      // Basic relations
      
      if (relation != null) {
        specEdTeacher = relation.isSpecEdTeacher();
        guidanceCounselor = relation.isGuidanceCounselor();
        courseTeacher = relation.isCourseTeacher();
        studentParent = relation.isStudentParent();
        
        // If only the courseTeacher is true, check if the student is active in some of the teacher's courses        
        if (courseTeacher && !guidanceCounselor && !specEdTeacher && !studentParent) {

          Set<Long> teacherWorkspaceIds = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(sessionController.getLoggedUserEntity()).stream().map(WorkspaceEntity::getId).collect(Collectors.toSet());
          Set<Long> studentWorkspaceIds = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(userEntity).stream().map(WorkspaceEntity::getId).collect(Collectors.toSet());
          
          courseTeacher = !Collections.disjoint(teacherWorkspaceIds, studentWorkspaceIds);
          
        }
      }

      // Counselor & manager
      
      if (implementedActions) {
        manager = sessionController.hasRole(EnvironmentRoleArchetype.MANAGER);
        studyProgrammeLeader = sessionController.hasRole(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
      }
      
      boolean isAdmin = sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR); 

      // Admins and spec ed teachers always have access...

      accessible = isAdmin || specEdTeacher;
      if (!accessible && ((form != null && form.getPublished() != null) || implementedActions)) {

        // ...guidance counselors, course teachers, and guardians can only access published form
        // implemented actions  are available to everyone who has access to the student’s guider view. The guardian is granted read-only access
        
        accessible = (relation != null && relation.isGuidanceCounselor()) || courseTeacher || manager || studyProgrammeLeader || (studentParent && accessType == PedagogyFormAccessType.READ);
      }
    }
    return new PedagogyFormAccessRestModel(accessible, specEdTeacher, guidanceCounselor, courseTeacher, studentParent);
  }
  
  private Long getFormCreator(PedagogyForm form) {
    if (form == null) {
      return null;
    }
    List<PedagogyFormHistory> historyList = pedagogyController.listHistory(form);
    return historyList.isEmpty() ? null : historyList.get(historyList.size() - 1).getCreator();
  }
  
  private UserEntity toUserEntity(String studentIdentifier) {
    if (studentIdentifier == null) {
      return null;
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);

    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    
    return userEntity;
  }
}

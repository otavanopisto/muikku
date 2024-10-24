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

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyController;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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
  
  /**
   * mApi().pedagogy.form.access.read(123);
   */
  @Path("/form/{USERENTITYID}/access")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAccesss(@PathParam("USERENTITYID") Long userEntityId) {
    return Response.ok(getAccess(userEntityId, true, PedagogyFormAccessType.READ)).build();
  }
  
  /**
   * mApi().pedagogy.form.create(123, {formData: String});
   */
  @Path("/form/{USERENTITYID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createForm(@PathParam("USERENTITYID") Long userEntityId, PedagogyFormCreatePayload payload) {
    
    // Payload validation
    
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntityId);
    if (form != null) {
      return Response.status(Status.BAD_REQUEST).entity("Form already exists").build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntityId, false, PedagogyFormAccessType.WRITE);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    form = pedagogyController.createForm(userEntityId, payload.getFormData());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.read(123);
   */
  @Path("/form/{USERENTITYID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getForm(@PathParam("USERENTITYID") Long userEntityId) {
    
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntityId, true, PedagogyFormAccessType.READ);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntityId);
    
    // UI wants a skeleton return object for the student even if they don't yet have a form at all...
    if (form == null) {
      return Response.ok(toRestModel(form, userEntityId)).build();
    }
    else {

      // PedagogyFormHistory creation
      pedagogyController.createViewHistory(form, sessionController.getLoggedUserEntity().getId());
      
      return Response.ok(toRestModel(form)).build();
    }
  }

  /**
   * mApi().pedagogy.form.formData.update(123, {formData: String, fields: [String], details: String});
   */
  @Path("/form/{USERENTITYID}/formData")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateFormData(@PathParam("USERENTITYID") Long userEntityId, PedagogyFormUpdatePayload payload) {
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntityId);
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %d not found", userEntityId)).build();
    }
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntityId, false, PedagogyFormAccessType.WRITE);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Form data update
    
    form = pedagogyController.updateFormData(form, payload.getFormData(), payload.getFields(), payload.getDetails(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.state.read(123);
   */
  @Path("/form/{USERENTITYID}/state")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getFormState(@PathParam("USERENTITYID") Long userEntityId) {

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntityId, true, PedagogyFormAccessType.READ);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntityId);
    return Response.ok(form == null ? PedagogyFormState.INACTIVE : form.getState()).build();
  }

  /**
   * mApi().pedagogy.form.state.update(123, {state: String});
   */
  @Path("/form/{USERENTITYID}/state")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateState(@PathParam("USERENTITYID") Long userEntityId, PedagogyFormStatePayload payload) {
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByUserEntityId(userEntityId);
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %d not found", userEntityId)).build();
    }
    
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntityId, true, PedagogyFormAccessType.WRITE);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Valid change; only supports ACTIVE -> PENDING by staff and PENDING -> APPROVED by form student
    
    boolean validChange = false;
    if (payload.getState() == PedagogyFormState.PENDING) {
      validChange = form.getState() == PedagogyFormState.ACTIVE; 
    }
    else if (payload.getState() == PedagogyFormState.APPROVED) {
      validChange = form.getState() == PedagogyFormState.PENDING && sessionController.getLoggedUserEntity().getId().equals(form.getUserEntityId()); 
    }
    if (!validChange) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid state change").build();
    }
    
    // State update
    
    form = pedagogyController.updateState(form, payload.getState(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  @Path("/form/{USERENTITYID}/workspaces")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaces(@PathParam("USERENTITYID") Long userEntityId,
      @QueryParam("q") String searchString,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults) {

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(userEntityId, true, PedagogyFormAccessType.READ);
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
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
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
  
  private PedagogyFormRestModel toRestModel(PedagogyForm form) {
    return toRestModel(form, form.getUserEntityId());
  }

  private PedagogyFormRestModel toRestModel(PedagogyForm form, Long userEntityId) {
    PedagogyFormRestModel model = new PedagogyFormRestModel();
    
    // Owner and student contact info
    
    UserEntity studentEntity = userEntityController.findUserEntityById(userEntityId);
    SchoolDataIdentifier identifier = studentEntity.defaultSchoolDataIdentifier();
    UserContactInfo contactInfo = userController.getStudentContactInfo(identifier.getDataSource(), identifier.getIdentifier());
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
      model.setState(form.getState());


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
      model.setState(PedagogyFormState.INACTIVE);
      model.setHistory(Collections.emptyList());
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
  
  private PedagogyFormAccessRestModel getAccess(Long userEntityId, boolean allowStudent, PedagogyFormAccessType accessType) {

    // Master access flag and various roles
    
    boolean accessible = false;
    boolean specEdTeacher = false;
    boolean guidanceCounselor = false;
    boolean courseTeacher = false;
    boolean studentParent = false;
    
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
      
      // Form is always accessible to admins and special education teachers but also to other related staff,
      // if the form exists and form state is approved by student
      
      boolean isAdmin = sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR); 
      accessible = isAdmin || specEdTeacher || (studentParent && accessType == PedagogyFormAccessType.READ);
      if (!accessible && form != null && form.getState() == PedagogyFormState.APPROVED) {
        accessible = relation.isGuidanceCounselor() || courseTeacher;
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

}

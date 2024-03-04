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
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
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
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
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
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  /**
   * mApi().pedagogy.form.access.read('PYRAMUS-STUDENT-123');
   */
  @Path("/form/{STUDENTIDENTIFIER}/access")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAccesss(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    return Response.ok(getAccess(studentIdentifier, true)).build();
  }
  
  /**
   * mApi().pedagogy.form.create('PYRAMUS-STUDENT-123', {formData: String});
   */
  @Path("/form/{STUDENTIDENTIFIER}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createForm(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormCreatePayload payload) {
    
    // Payload validation
    
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }
    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(studentIdentifier);
    UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sdi);
    if (usdi == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Student %s not found", studentIdentifier)).build();
    }
    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    if (form != null) {
      return Response.status(Status.BAD_REQUEST).entity("Form already exists").build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(studentIdentifier, false);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    form = pedagogyController.createForm(studentIdentifier, payload.getFormData());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.read('PYRAMUS-STUDENT-123');
   */
  @Path("/form/{STUDENTIDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getForm(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(studentIdentifier, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    
    // UI wants a skeleton return object for the student even if they don't yet have a form at all...
    if (form == null) {
      return Response.ok(toRestModel(form, studentIdentifier)).build();
    }
    else {

      // PedagogyFormHistory creation
      pedagogyController.createViewHistory(form, sessionController.getLoggedUserEntity().getId());
      
      return Response.ok(toRestModel(form)).build();
    }
  }

  /**
   * mApi().pedagogy.form.formData.update('PYRAMUS-STUDENT-123', {formData: String, fields: [String], details: String});
   */
  @Path("/form/{STUDENTIDENTIFIER}/formData")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateFormData(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormUpdatePayload payload) {
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %s not found", studentIdentifier)).build();
    }
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(studentIdentifier, false);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Form data update
    
    form = pedagogyController.updateFormData(form, payload.getFormData(), payload.getFields(), payload.getDetails(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.state.read('PYRAMUS-STUDENT-123');
   */
  @Path("/form/{STUDENTIDENTIFIER}/state")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getFormState(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(studentIdentifier, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    return Response.ok(form == null ? PedagogyFormState.INACTIVE : form.getState()).build();
  }

  /**
   * mApi().pedagogy.form.state.update('PYRAMUS-STUDENT-123', {state: String});
   */
  @Path("/form/{STUDENTIDENTIFIER}/state")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateState(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormStatePayload payload) {
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %s not found", studentIdentifier)).build();
    }
    
    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(studentIdentifier, true);
    if (!access.isAccessible()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Valid change; only supports ACTIVE -> PENDING by staff and PENDING -> APPROVED by form student
    
    boolean validChange = false;
    if (payload.getState() == PedagogyFormState.PENDING) {
      validChange = form.getState() == PedagogyFormState.ACTIVE; 
    }
    else if (payload.getState() == PedagogyFormState.APPROVED) {
      validChange = form.getState() == PedagogyFormState.PENDING && StringUtils.equals(sessionController.getLoggedUser().toId(), form.getStudentIdentifier()); 
    }
    if (!validChange) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid state change").build();
    }
    
    // State update
    
    form = pedagogyController.updateState(form, payload.getState(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  @Path("/form/{STUDENTIDENTIFIER}/workspaces")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaces(@PathParam("STUDENTIDENTIFIER") String studentIdentifier,
      @QueryParam("q") String searchString,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults) {

    // Access check
    
    PedagogyFormAccessRestModel access = getAccess(studentIdentifier, true);
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
    
    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(studentIdentifier);
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
    return toRestModel(form, form.getStudentIdentifier());
  }

  private PedagogyFormRestModel toRestModel(PedagogyForm form, String studentIdentifier) {
    PedagogyFormRestModel model = new PedagogyFormRestModel();
    
    // Owner and student contact info
    
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(studentIdentifier);
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
    model.setStudentIdentifier(studentIdentifier);
    
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
  
  private PedagogyFormAccessRestModel getAccess(String studentIdentifier, boolean allowStudent) {

    // Master access flag and various roles
    
    boolean accessible = false;
    boolean specEdTeacher = false;
    boolean guidanceCounselor = false;
    boolean courseTeacher = false;
    
    // Students can always access their own form
    
    if (StringUtils.equals(sessionController.getLoggedUser().toId(), studentIdentifier)) {
      accessible = allowStudent;
    }
    else {
      
      // For staff members, access is based on guidance relation

      PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
      SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(studentIdentifier);
      StudentGuidanceRelation relation = userController.getGuidanceRelation(identifier.getDataSource(), identifier.getIdentifier());
      
      // Basic relations
      
      if (relation != null) {
        specEdTeacher = relation.isSpecEdTeacher();
        guidanceCounselor = relation.isGuidanceCounselor();
        courseTeacher = relation.isCourseTeacher();
        // If only the courseTeacher is true, check if the student is active in some of the teacher's courses
        if (courseTeacher && !guidanceCounselor && !specEdTeacher) {

          SchoolDataIdentifier studentId = SchoolDataIdentifier.fromId(studentIdentifier);
          UserEntity studentEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(studentId.getDataSource(), studentId.getIdentifier());
          
          Set<Long> teacherWorkspaceIds = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(sessionController.getLoggedUserEntity()).stream().map(WorkspaceEntity::getId).collect(Collectors.toSet());
          Set<Long> studentWorkspaceIds = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(studentEntity).stream().map(WorkspaceEntity::getId).collect(Collectors.toSet());
          
          courseTeacher = !Collections.disjoint(teacherWorkspaceIds, studentWorkspaceIds);
          
        }
      }
      
      // Form is always accessible to admins and special education teachers but also to other related staff,
      // if the form exists and form state is approved by student
      
      boolean isAdmin = sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR); 
      accessible = isAdmin || specEdTeacher;
      if (!accessible && form != null && form.getState() == PedagogyFormState.APPROVED) {
        accessible = relation.isGuidanceCounselor() || courseTeacher;
      }
    }
    return new PedagogyFormAccessRestModel(accessible, specEdTeacher, guidanceCounselor, courseTeacher);
  }
  
  private Long getFormCreator(PedagogyForm form) {
    if (form == null) {
      return null;
    }
    List<PedagogyFormHistory> historyList = pedagogyController.listHistory(form);
    return historyList.isEmpty() ? null : historyList.get(historyList.size() - 1).getCreator();
  }

}

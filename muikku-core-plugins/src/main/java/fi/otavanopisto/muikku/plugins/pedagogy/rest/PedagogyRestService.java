package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyController;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyPermissions;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormVisibility;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserContactInfo;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
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
  private UserEntityFileController userEntityFileController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  /**
   * mApi().pedagogy.form.create('PYRAMUS-STUDENT-123', {formData: String});
   */
  @Path("/form/{STUDENTIDENTIFIER}")
  @POST
  @RESTPermit(PedagogyPermissions.CREATE_PEDAGOGY_FORM)
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
    
    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    // UI wants a skeleton return object for the student even if they don't yet have a form at all...
    if (form == null) {
      return Response.ok(toRestModel(form, studentIdentifier)).build();
    }
    if (!sessionController.getLoggedUserEntity().getId().equals(form.getOwner())) {
      UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(sessionController.getLoggedUserEntity());
      if (usdi == null) {
        return Response.status(Status.FORBIDDEN).build();
      }
      if (usdi.getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT) {
        // Student can only access their own form
        if (!StringUtils.equals(sessionController.getLoggedUser().toId(), form.getStudentIdentifier())) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
      else {
        // Staff other than form owner requires suitable visibility
        if (StringUtils.isEmpty(form.getVisibility())) {
          return Response.status(Status.FORBIDDEN).build();
        }
        // TODO Guardians
        List<PedagogyFormVisibility> visibility = Stream.of(form.getVisibility().split(",")).map(v -> PedagogyFormVisibility.valueOf(v)).collect(Collectors.toList());
        if (!visibility.contains(PedagogyFormVisibility.TEACHERS)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }
    
    // Return form

    return Response.ok(toRestModel(form)).build();
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
    if (!sessionController.getLoggedUserEntity().getId().equals(form.getOwner())) {
      return Response.status(Status.FORBIDDEN).entity("Form can only be updated by owner").build();
    }
    if (StringUtils.isEmpty(payload.getFormData())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing form data").build();
    }
    
    // Form data update
    
    form = pedagogyController.updateFormData(form, payload.getFormData(), payload.getFields(), payload.getDetails(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }

  /**
   * mApi().pedagogy.form.visibility.update('PYRAMUS-STUDENT-123', {visibility: [String]});
   */
  @Path("/form/{STUDENTIDENTIFIER}/visibility")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateVisibility(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, PedagogyFormVisibilityPayload payload) {
    
    // Payload validation
    
    PedagogyForm form = pedagogyController.findFormByStudentIdentifier(studentIdentifier);
    if (form == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Form for student %s not found", studentIdentifier)).build();
    }
    if (!StringUtils.equals(sessionController.getLoggedUser().toId(), form.getStudentIdentifier())) {
      return Response.status(Status.FORBIDDEN).entity("Visibility can only be updated by student").build();
    }
    
    // Visibility update
    
    form = pedagogyController.updateVisibility(form, payload.getVisibility(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  /**
   * mApi().pedagogy.form.state.read('PYRAMUS-STUDENT-123');
   */
  @Path("/form/{STUDENTIDENTIFIER}/state")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getFormState(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
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
    
    // Valid change; only supports ACTIVE -> PENDING by form owner and PENDING -> APPROVED by form student
    
    boolean validChange = false;
    if (payload.getState() == PedagogyFormState.PENDING) {
      validChange = form.getState() == PedagogyFormState.ACTIVE && sessionController.getLoggedUserEntity().getId().equals(form.getOwner()); 
    }
    else if (payload.getState() == PedagogyFormState.APPROVED) {
      validChange = form.getState() == PedagogyFormState.PENDING && StringUtils.equals(sessionController.getLoggedUser().toId(), form.getStudentIdentifier()); 
    }
    if (!validChange) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid state change").build();
    }

    // TODO If state is set to INACTIVE, is it an error or a request to delete the form altogether?
    
    // State update
    
    form = pedagogyController.updateState(form, payload.getState(), sessionController.getLoggedUserEntity().getId());
    
    return Response.ok(toRestModel(form)).build();
  }
  
  private PedagogyFormRestModel toRestModel(PedagogyForm form) {
    return toRestModel(form, form.getStudentIdentifier());
  }

  private PedagogyFormRestModel toRestModel(PedagogyForm form, String studentIdentifier) {
    PedagogyFormRestModel model = new PedagogyFormRestModel();
    
    // User contact info
    
    UserContactInfo contactInfo = null;
    schoolDataBridgeSessionController.startSystemSession();
    try {
      SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(studentIdentifier);
      contactInfo = userController.getUserContactInfo(identifier.getDataSource(), identifier.getIdentifier());
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    if (contactInfo != null) {
      Map<String, String> studentInfo = new HashMap<>();
      studentInfo.put("firstName", contactInfo.getFirstName());
      studentInfo.put("lastName", contactInfo.getLastName());
      studentInfo.put("dateOfBirth", contactInfo.getDateOfBirth() == null ? null : contactInfo.getDateOfBirth().toString());
      studentInfo.put("phoneNumber", contactInfo.getPhoneNumber());
      studentInfo.put("addressName", contactInfo.getAddressName());
      studentInfo.put("streetAddress", contactInfo.getStreetAddress());
      studentInfo.put("zipCode", contactInfo.getZipCode());
      studentInfo.put("city", contactInfo.getCity());
      studentInfo.put("country", contactInfo.getCountry());
      studentInfo.put("email", contactInfo.getEmail());
      model.setStudentInfo(studentInfo);
    }
    model.setStudentIdentifier(studentIdentifier);

    // Normal fields
    
    if (form != null) {
      model.setFormData(form.getFormData());
      model.setId(form.getId());
      model.setOwnerId(form.getOwner());
      model.setState(form.getState());

      // Comma-delimited visibility string to enum list

      if (!StringUtils.isEmpty(form.getVisibility())) {
        model.setVisibility(Stream.of(form.getVisibility().split(",")).map(v -> PedagogyFormVisibility.valueOf(v)).collect(Collectors.toList()));
      }
      else {
        model.setVisibility(Collections.emptyList());
      }

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
      model.setVisibility(Collections.emptyList());
      model.setHistory(Collections.emptyList());
    }
    
    return model;
  }

}

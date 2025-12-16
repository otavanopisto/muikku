package fi.otavanopisto.muikku.plugins.languageprofile.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
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

import fi.otavanopisto.muikku.plugins.languageprofile.LanguageProfileController;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSample;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSampleType;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/languageprofile")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class LanguageProfileRestService {
  
  @Inject
  private LanguageProfileController languageProfileController;

  @GET
  @Path("/user/{USERENTITYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getLanguageProfile(@PathParam("USERENTITYID") Long userEntityId) {
    
    // Access checK; read for owner + interested parties

    if (!languageProfileController.hasAccess(userEntityId, false)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Actual functionality
    
    LanguageProfile languageProfile = languageProfileController.findByUserEntityId(userEntityId);
    if (languageProfile == null) {
      return Response.noContent().build();
    }
    return Response.ok(toRestModel(languageProfile)).build();
  }

  @POST
  @Path("/user/{USERENTITYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateLanguageProfile(@PathParam("USERENTITYID") Long userEntityId, LanguageProfileRestModel payload) {
    
    // Access check; write for owner only
    
    if (!languageProfileController.hasAccess(userEntityId, true)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Actual functionality
    
    LanguageProfile languageProfile = languageProfileController.findByUserEntityId(userEntityId);
    if (languageProfile == null) {
      languageProfile = languageProfileController.create(userEntityId, payload.getFormData());
    }
    else {
      languageProfile = languageProfileController.update(languageProfile, payload.getFormData());
    }
    return Response.ok(toRestModel(languageProfile)).build();
  }

  @GET
  @Path("/user/{USERENTITYID}/samples")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listSamples(@PathParam("USERENTITYID") Long userEntityId, @QueryParam("language") String language) {
    
    // Access checK; read for owner + interested parties
    
    if (!languageProfileController.hasAccess(userEntityId, false)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Actual functionality
    
    List<LanguageProfileSampleRestModel> restSamples = new ArrayList<>();
    LanguageProfile languageProfile = languageProfileController.findByUserEntityId(userEntityId);
    if (languageProfile != null) {
      List<LanguageProfileSample> samples = StringUtils.isEmpty(language)
          ? languageProfileController.getSamples(languageProfile)
          : languageProfileController.getSamples(languageProfile, language);
      for (LanguageProfileSample sample : samples) {
        restSamples.add(toRestModel(sample));
      }
    }
    return Response.ok().entity(restSamples).build();
  }
  
  @POST
  @Path("/user/{USERENTITYID}/samples")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createSample(@PathParam("USERENTITYID") Long userEntityId, LanguageProfileSampleRestModel payload) {
    
    // Access check; write for owner only
    
    if (!languageProfileController.hasAccess(userEntityId, true)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Actual functionality
    
    LanguageProfile profile = languageProfileController.findByUserEntityId(userEntityId);
    if (profile == null) {
      return Response.status(Status.NOT_FOUND).entity("LanguageProfile not found").build();
    }
    if (StringUtils.isEmpty(payload.getLanguage())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing language").build();
    }
    if (StringUtils.isEmpty(payload.getValue())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing value").build();
    }
    LanguageProfileSample sample = languageProfileController.createSample(profile, payload.getLanguage(), LanguageProfileSampleType.TEXT, payload.getValue());
    return Response.ok().entity(toRestModel(sample)).build();
  }
  
  @PUT
  @Path("/user/{USERENTITYID}/samples/{SAMPLEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateSample(@PathParam("USERENTITYID") Long userEntityId, @PathParam("SAMPLEID") Long sampleId, LanguageProfileSampleRestModel payload) {
    
    // Access check; write for owner only
    
    if (!languageProfileController.hasAccess(userEntityId, true)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Actual functionality
    
    LanguageProfile profile = languageProfileController.findByUserEntityId(userEntityId);
    if (profile == null) {
      return Response.status(Status.NOT_FOUND).entity("LanguageProfile not found").build();
    }
    LanguageProfileSample sample = languageProfileController.findSampleById(sampleId);
    if (sample == null) {
      return Response.status(Status.NOT_FOUND).entity("LanguageProfile not found").build();
    }
    if (!profile.getId().equals(sample.getLanguageProfile().getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Profile sample mismatch").build();
    }
    sample = languageProfileController.updateSample(sample, payload.getValue());
    return Response.ok().entity(toRestModel(sample)).build();
  }

  @DELETE
  @Path("/user/{USERENTITYID}/samples/{SAMPLEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteSample(@PathParam("USERENTITYID") Long userEntityId, @PathParam("SAMPLEID") Long sampleId) {
    
    // Access check; delete for owner only
    
    if (!languageProfileController.hasAccess(userEntityId, true)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Actual functionality
    
    LanguageProfile profile = languageProfileController.findByUserEntityId(userEntityId);
    if (profile == null) {
      return Response.status(Status.NOT_FOUND).entity("LanguageProfile not found").build();
    }
    LanguageProfileSample sample = languageProfileController.findSampleById(sampleId);
    if (sample == null) {
      return Response.status(Status.NOT_FOUND).entity("LanguageProfile not found").build();
    }
    if (!profile.getId().equals(sample.getLanguageProfile().getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Profile sample mismatch").build();
    }
    languageProfileController.deleteSample(sample);
    return Response.noContent().build();
  }
  
  private LanguageProfileRestModel toRestModel(LanguageProfile languageProfile) {
    LanguageProfileRestModel model = new LanguageProfileRestModel();
    model.setFormData(languageProfile.getFormData());
    model.setLastModified(languageProfile.getLastModified());
    return model;
  }
  
  private LanguageProfileSampleRestModel toRestModel(LanguageProfileSample languageProfileSample) {
    LanguageProfileSampleRestModel model = new LanguageProfileSampleRestModel();
    model.setFileName(languageProfileSample.getFileName());
    model.setId(languageProfileSample.getId());
    model.setLanguage(languageProfileSample.getLanguage());
    model.setLastModified(languageProfileSample.getLastModified());
    model.setType(languageProfileSample.getType());
    model.setValue(languageProfileSample.getValue());
    return model;
  }
  
  protected class Range {
    public Range(int start, int end, int total) {
      this.start = start;
      this.end = end;
      this.length = end - start + 1;
      this.total = total;
    }
    int start;
    int end;
    int length;
    int total;
  }

}

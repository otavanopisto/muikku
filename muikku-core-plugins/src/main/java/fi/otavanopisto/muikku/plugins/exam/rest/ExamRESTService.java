package fi.otavanopisto.muikku.plugins.exam.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspace/exam")
@RestCatchSchoolDataExceptions
public class ExamRESTService {

}

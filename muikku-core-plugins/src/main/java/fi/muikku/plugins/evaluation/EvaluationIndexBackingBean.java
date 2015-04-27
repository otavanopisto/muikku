package fi.muikku.plugins.evaluation;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation/", to = "/jsf/evaluation/index.jsf")  

public class EvaluationIndexBackingBean {

}

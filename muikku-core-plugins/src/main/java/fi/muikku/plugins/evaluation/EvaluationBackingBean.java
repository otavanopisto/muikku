package fi.muikku.plugins.evaluation;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation", to = "/evaluation/index.jsf")  
public class EvaluationBackingBean {

}

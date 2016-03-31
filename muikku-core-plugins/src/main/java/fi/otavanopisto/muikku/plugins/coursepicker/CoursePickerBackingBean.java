package fi.otavanopisto.muikku.plugins.coursepicker;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
@Join (path = "/coursepicker", to = "/jsf/coursepicker/index.jsf")
public class CoursePickerBackingBean {
  
}
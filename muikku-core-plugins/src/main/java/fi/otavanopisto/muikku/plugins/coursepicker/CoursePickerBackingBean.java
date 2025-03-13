package fi.otavanopisto.muikku.plugins.coursepicker;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join (path = "/coursepicker", to = "/jsf/coursepicker/index.jsf")
public class CoursePickerBackingBean {
  
}
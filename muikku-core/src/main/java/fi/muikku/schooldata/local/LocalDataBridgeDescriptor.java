package fi.muikku.schooldata.local;

import java.lang.annotation.Annotation;

import javax.enterprise.util.AnnotationLiteral;

import fi.muikku.schooldata.SchoolDataBridgeDescriptor;

public class LocalDataBridgeDescriptor implements SchoolDataBridgeDescriptor {

  @Override
  public String getIdentifier() {
    return "LOCAL";
  }
  
  @Override
  public Annotation getQualifier() {
    return new AnnotationLiteral<LocalSchoolDataController>() {
      private static final long serialVersionUID = -5240890270224482468L;
    };
  }

}

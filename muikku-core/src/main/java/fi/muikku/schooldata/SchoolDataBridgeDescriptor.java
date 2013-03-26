package fi.muikku.schooldata;

import java.lang.annotation.Annotation;

public interface SchoolDataBridgeDescriptor {

  String getIdentifier();
  
  Annotation getQualifier();
}

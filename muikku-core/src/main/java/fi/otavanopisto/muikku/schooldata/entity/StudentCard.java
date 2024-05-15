package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

public interface StudentCard {

  public String getFirstName();

  public String getLastName();

  public String getStudyProgramme();

  public Long getUserEntityId();

  public Long getId();

  public Date getExpiryDate();

  public String getActivity();

  public String getType();

}
package fi.otavanopisto.muikku.plugins.material.coops;

import fi.foyt.coops.CoOpsConflictException;

public interface CoOpsDiffAlgorithm {

  public String getName();

  public String patch(String data, String patch) throws CoOpsConflictException;

  public String unpatch(String data, String patch) throws CoOpsConflictException;
  
}

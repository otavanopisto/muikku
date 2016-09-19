package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;

public interface PyramusUpdateScheduler {

  public int getPriority();
  public abstract void synchronize() throws SchoolDataBridgeInternalException;

}
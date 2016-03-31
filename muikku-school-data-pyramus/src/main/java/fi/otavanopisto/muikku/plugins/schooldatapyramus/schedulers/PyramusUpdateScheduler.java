package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import fi.otavanopisto.muikku.schooldata.UnexpectedSchoolDataBridgeException;

public interface PyramusUpdateScheduler {

  public int getPriority();
  public abstract void synchronize() throws UnexpectedSchoolDataBridgeException;

}
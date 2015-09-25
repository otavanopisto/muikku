package fi.muikku.plugins.schooldatapyramus.schedulers;

import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

public interface PyramusUpdateScheduler {

  public int getPriority();
  public abstract void synchronize() throws UnexpectedSchoolDataBridgeException;

}
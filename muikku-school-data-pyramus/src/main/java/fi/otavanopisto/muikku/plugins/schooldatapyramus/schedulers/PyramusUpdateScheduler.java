package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

public interface PyramusUpdateScheduler {

  public int getPriority();
  public abstract void synchronize();

}
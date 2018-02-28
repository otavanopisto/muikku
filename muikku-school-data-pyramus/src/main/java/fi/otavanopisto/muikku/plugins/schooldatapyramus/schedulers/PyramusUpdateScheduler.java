package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

public interface PyramusUpdateScheduler {

  public boolean isEnabled();
  public int getPriority();
  public abstract void prepare();
  public abstract void synchronize();

}
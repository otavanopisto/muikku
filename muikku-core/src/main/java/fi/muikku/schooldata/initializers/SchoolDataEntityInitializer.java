package fi.muikku.schooldata.initializers;

public interface SchoolDataEntityInitializer {
  
  public static final int PRIORITY_HIGHEST = -100;
  public static final int PRIORITY_HIGH = 0;
  public static final int PRIORITY_NORMAL = 100;
  public static final int PRIORITY_LOW = 1000;
  
  public int getPriority();

}

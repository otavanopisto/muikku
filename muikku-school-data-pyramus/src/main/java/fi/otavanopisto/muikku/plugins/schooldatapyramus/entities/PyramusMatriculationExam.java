package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;

public class PyramusMatriculationExam implements MatriculationExam {

  @Override
  public long getStarts() {
    return startTime;
  }
  
  public void setStarts(long startTime) {
    this.startTime = startTime;
  }

  @Override
  public long getEnds() {
    return endTime;
  }
  
  public void setEnds(long endTime) {
    this.endTime = endTime;
  }
  
  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  @Override
  public boolean isEligible() {
    return eligible;
  }
  
  private long id;
  private long startTime;
  private long endTime;
  private boolean eligible; 
}

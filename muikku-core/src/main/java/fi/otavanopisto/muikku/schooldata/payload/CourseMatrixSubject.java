package fi.otavanopisto.muikku.schooldata.payload;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseMatrixSubject {

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public List<CourseMatrixModule> getModules() {
    return modules;
  }

  public void setModules(List<CourseMatrixModule> modules) {
    this.modules = modules;
  }

  private String name;
  private String code;
  private List<CourseMatrixModule> modules;

}

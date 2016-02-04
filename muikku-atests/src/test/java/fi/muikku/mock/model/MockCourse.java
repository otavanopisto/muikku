package fi.muikku.mock.model;

import org.joda.time.DateTime;

public class MockCourse {
  private long id;
  private String name;
  private DateTime created;
  private String description;  
  private DateTime begin;
  private DateTime end;
  
  public MockCourse(long id, String name, DateTime created, String description, DateTime begin, DateTime end) {
    super();
    this.id = id;
    this.name = name;
    this.created = created;
    this.description = description;
    this.begin = begin;
    this.end = end;
  }
  
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public long getId() {
    return id;
  }
  public void setId(long id) {
    this.id = id;
  }
  public DateTime getCreated() {
    return created;
  }
  public void setCreated(DateTime created) {
    this.created = created;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public DateTime getBegin() {
    return begin;
  }
  public void setBegin(DateTime begin) {
    this.begin = begin;
  }
  public DateTime getEnd() {
    return end;
  }
  public void setEnd(DateTime end) {
    this.end = end;
  }
}

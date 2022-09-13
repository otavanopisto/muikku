package fi.otavanopisto.muikku.mock.model;

import java.time.OffsetDateTime;

public class MockCourse {
  private long id;
  private String name;
  private OffsetDateTime created;
  private String description;  
  private OffsetDateTime begin;
  private OffsetDateTime end;
  private OffsetDateTime signupStart;
  private OffsetDateTime signupEnd;
  
  public MockCourse(long id, String name, OffsetDateTime created, String description, OffsetDateTime begin, OffsetDateTime end, OffsetDateTime signupStart, OffsetDateTime signupEnd) {
    super();
    this.id = id;
    this.name = name;
    this.created = created;
    this.description = description;
    this.begin = begin;
    this.end = end;
    this.signupStart = signupStart;
    this.signupEnd = signupEnd;
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
  public OffsetDateTime getCreated() {
    return created;
  }
  public void setCreated(OffsetDateTime created) {
    this.created = created;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public OffsetDateTime getBegin() {
    return begin;
  }
  public void setBegin(OffsetDateTime begin) {
    this.begin = begin;
  }
  public OffsetDateTime getEnd() {
    return end;
  }
  public void setEnd(OffsetDateTime end) {
    this.end = end;
  }

  public OffsetDateTime getSignupStart() {
    return signupStart;
  }

  public void setSignupStart(OffsetDateTime signupStart) {
    this.signupStart = signupStart;
  }

  public OffsetDateTime getSignupEnd() {
    return signupEnd;
  }

  public void setSignupEnd(OffsetDateTime signupEnd) {
    this.signupEnd = signupEnd;
  }
}

package fi.otavanopisto.muikku.rest.test;

import io.restassured.specification.RequestSpecification;

import fi.otavanopisto.muikku.TestRole;

public class RestTestRequest {
  
  public RestTestRequest(RequestSpecification request, TestRole role) {
    this.request = request;
    this.role = role;
  }

  public TestRole getRole() {
    return role;
  }

  public void setRole(TestRole role) {
    this.role = role;
  }

  public RequestSpecification getRequest() {
    return request;
  }

  public void setRequest(RequestSpecification request) {
    this.request = request;
  }

  private RequestSpecification request;
  private TestRole role;
}

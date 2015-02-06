package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;

import fi.muikkku.ui.AbstractUITest;

public class IndexPageTestsBase extends AbstractUITest {

//  @Before
//  public void requiredPyramusMocks() {
//    stubFor(get(urlEqualTo("/1/students/students/1234"))
//        .withHeader("Accept", equalTo("text/json"))
//        .willReturn(aResponse().withStatus(200)
//        .withHeader("Content-Type", "text/json")
//        .withBody("{\"id\":1234,\"abstractStudentId\":8,\"firstName\":\"Testii\",\"lastName\":\"Userii\",\"nickname\":null,\"additionalInfo\":null,\"additionalContactInfo\":null,\"nationalityId\":null,\"languageId\":null,\"municipalityId\":null,\"schoolId\":null,\"activityTypeId\":null,\"examinationTypeId\":null,\"educationalLevelId\":null,\"studyTimeEnd\":null,\"studyProgrammeId\":3,\"previousStudies\":null,\"education\":null,\"lodging\":false,\"studyStartDate\":\"2010-09-29T00:00:00.000+03:00\",\"studyEndDate\":null,\"studyEndReasonId\":null,\"studyEndText\":null,\"variables\":{},\"tags\":[],\"archived\":false}")));
//  }

  @Test
  public void IndexPageTest() throws IOException {
    getWebDriver().get(getAppUrl());
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    assertTrue(elementExists);
  }

}

package fi.muikku.ui.sauce.course.materials;

import java.net.MalformedURLException;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

import fi.muikku.ui.base.course.materials.CourseMaterialsPageTestsBase;

public class CourseMaterialsPageTestsIT extends CourseMaterialsPageTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
  
  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
  @Override
  public void courseTOCExistsTest() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.courseTOCExistsTest();
    }
  }
  
  @Override
  public void courseMaterialTOCHighlightTest() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.courseMaterialTOCHighlightTest();
    }
  }

  @Override
  public void answerDropdownTestAdmin() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.answerDropdownTestAdmin();
    }
  }
  
  @Override
  public void answerDropdownTestStudent() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.answerDropdownTestStudent();
    }
  }
  
  @Override
  public void answerRadioButtonsTestAdmin() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.answerRadioButtonsTestAdmin();
    }
  }
  
  @Override
  public void answerRadioButtonsTestStudent() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.answerRadioButtonsTestStudent();
    }
  }
  
  @Override
  public void answerCheckboxTestAdmin() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.answerRadioButtonsTestAdmin();
    }
  }
  
  @Override
  public void answerCheckboxTestStudent() throws Exception {
    if (!"microsoftedge".equals(getSauceBrowser())) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.answerRadioButtonsTestStudent();
    }
  }
}

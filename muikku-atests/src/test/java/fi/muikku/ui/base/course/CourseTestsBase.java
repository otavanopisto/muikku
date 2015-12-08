package fi.muikku.ui.base.course;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.atests.Workspace;
import fi.muikku.ui.AbstractUITest;

public class CourseTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }

  @Test
  public void courseHomeButtonExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
      waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
      boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-home")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }
 
  @Test
  public void courseGuideButtonExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
      waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
      boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-guides")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseMaterialButtonTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-materials")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseDiscussionButtonTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-discussions")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseUnpublishTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
      waitForPresent(".workspace-title");
      assertVisible(".workspace-unpublish-button");
      assertNotVisible(".workspace-publish-button");
      click(".workspace-unpublish-button");
      waitForPresent(".workspace-title");
      assertNotVisible(".workspace-unpublish-button");
      assertVisible(".workspace-publish-button");      
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }
  
}

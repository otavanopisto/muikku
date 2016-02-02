package fi.muikku.plugins.dnm.util;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public class TaskM2Image extends AbstractHtmlMaterialCleanerTask {

  @Inject
  private Logger logger;
  
  @Inject
  private BinaryMaterialController binaryMaterialController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  private int imageCounter = 0;
  
  @Override
  protected void cleanElement(Element element) {
    boolean needsModify = false;
    if ("img".equals(element.getTagName())) {
      
      String src = element.getAttribute("src");
      if (StringUtils.startsWith(src, "https://muikku.otavanopisto.fi/fi")) {
        needsModify = true;
      }
      else if (StringUtils.startsWith(src, "http://muikku.otavanopisto.fi/fi")) {
        needsModify = true;
      }
      else if (StringUtils.startsWith(src, "muikku.otavanopisto.fi/fi")) {
        src = "http://" + src;
        needsModify = true;
      }
      
      if (needsModify) {
        try {
          logger.info(String.format("Fixing image from %s", src));
          
          String m2Url = pluginSettingsController.getPluginSetting("deus-nex-machina", "m2.url");
          String m2User = pluginSettingsController.getPluginSetting("deus-nex-machina", "m2.user");
          String m2Pass = pluginSettingsController.getPluginSetting("deus-nex-machina", "m2.pass");
          String m2Auth = pluginSettingsController.getPluginSetting("deus-nex-machina", "m2.auth");
          
          String cookie = null;
          URL authUrl = new URL(String.format("%s?u=%s&p=%s&c=%s", m2Url, m2User, m2Pass, m2Auth));
          URLConnection authUrlConnection = authUrl.openConnection();
          authUrlConnection.connect();
          try {
            String headerName = null;
            for (int i = 1; (headerName = authUrlConnection.getHeaderFieldKey(i)) != null; i++) {
              if (StringUtils.equals(headerName, "Set-Cookie")) {
                if (StringUtils.contains(authUrlConnection.getHeaderField(i), "IxAuth")) {
                  cookie = authUrlConnection.getHeaderField(i);
                  break;
                }
              }
            }
            
            if (cookie != null) {
              URL imgUrl = new URL(src);
              URLConnection imgUrlConnection = imgUrl.openConnection();
              imgUrlConnection.setRequestProperty("Cookie", cookie);
              imgUrlConnection.connect();
              String contentType = imgUrlConnection.getContentType();
              if (StringUtils.startsWith(contentType, "image/")) {
                String prefix = null;
                if (StringUtils.contains(contentType,  "jpg") || StringUtils.contains(contentType,  "jpeg")) {
                  prefix = "jpg";
                }
                else if (StringUtils.contains(contentType, "gif")) {
                  prefix = "gif";
                }
                else if (StringUtils.contains(contentType, "png")) {
                  prefix = "png";
                }
                else {
                  prefix = StringUtils.substringAfter(contentType,  "image/");
                  logger.log(Level.WARNING, String.format("Image of content type %s prefixed as %s", contentType, prefix));
                }
                
                InputStream is = imgUrlConnection.getInputStream();
                byte[] data = {};
                try {
                  data = IOUtils.toByteArray(is);
                }
                finally {
                  is.close();
                }
                
                String name = String.format("img%s.%s", StringUtils.leftPad(++imageCounter + "", 3, '0'), prefix);
                BinaryMaterial material = binaryMaterialController.createBinaryMaterial(name, contentType, data);
                WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(getWorkspaceMaterial(), material);
                String workspaceUrl = StringUtils.prependIfMissing(workspaceMaterialController.getCompletePath(workspaceMaterial), "/");
                logger.info(String.format("Image converted to %s", workspaceUrl));
                element.setAttribute("src",  workspaceUrl);

                markModified();
              }
              else {
                logger.log(Level.SEVERE, String.format("Skipping image due to questionable content type %s", contentType));
              }
            }
            else {
              logger.log(Level.SEVERE, "Cookie get fail");
            }
          }
          finally {
            URL logoutUrl = new URL(String.format("%s", m2Url));
            URLConnection logoutUrlConnection = logoutUrl.openConnection();
            logoutUrlConnection.connect();
          }
        }
        catch (Exception e) {
          logger.log(Level.SEVERE, String.format("Failed to fix image from %s", src), e);
        }
      }
    }
  }

  @Override
  public Integer getPriority() {
    return PRIORITY_HIGH;
  }

}

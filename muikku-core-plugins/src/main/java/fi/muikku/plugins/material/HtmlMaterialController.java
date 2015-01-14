package fi.muikku.plugins.material;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.foyt.coops.CoOpsConflictException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.muikku.plugins.material.coops.CoOpsDiffAlgorithm;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialExtensionPropertyDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialPropertyDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionExtensionPropertyDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionPropertyDAO;
import fi.muikku.plugins.material.coops.model.HtmlMaterialExtensionProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevisionExtensionProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty;
import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Dependent
@Stateless
public class HtmlMaterialController {

  @Inject
  private HtmlMaterialDAO htmlMaterialDAO;
  
  @Inject
  private HtmlMaterialPropertyDAO htmlMaterialPropertyDAO;

  @Inject
  private HtmlMaterialExtensionPropertyDAO htmlMaterialExtensionPropertyDAO;

  @Inject
  private HtmlMaterialRevisionDAO htmlMaterialRevisionDAO;

  @Inject
  private HtmlMaterialRevisionPropertyDAO htmlMaterialRevisionPropertyDAO;

  @Inject
  private HtmlMaterialRevisionExtensionPropertyDAO htmlMaterialRevisionExtensionPropertyDAO;

  @Inject
  @Any
  private Instance<CoOpsDiffAlgorithm> algorithms;
  
  @Inject
  private Event<HtmlMaterialCreateEvent> materialCreateEvent;

  @Inject
  private Event<HtmlMaterialDeleteEvent> materialDeleteEvent;

  @Inject
  private Event<HtmlMaterialUpdateEvent> materialUpdateEvent;

  public HtmlMaterial createHtmlMaterial(String title, String html,
      String contentType, Long revisionNumber) {
    HtmlMaterial material = htmlMaterialDAO.create(title, html, contentType,
        revisionNumber);
    materialCreateEvent.fire(new HtmlMaterialCreateEvent(material));
    return material;
  }

  public HtmlMaterial findHtmlMaterialById(Long id) {
    return htmlMaterialDAO.findById(id);
  }

  public HtmlMaterial updateHtmlMaterialTitle(HtmlMaterial htmlMaterial, String title) {
    return htmlMaterialDAO.updateTitle(htmlMaterial, title);
  }

  public void deleteHtmlMaterial(HtmlMaterial htmlMaterial) {
    // TODO Logic for remove answers flag
    materialDeleteEvent.fire(new HtmlMaterialDeleteEvent(htmlMaterial, false));
    htmlMaterialDAO.delete(htmlMaterial);
  }
  
  public HtmlMaterial updateHtmlMaterialHtml(HtmlMaterial htmlMaterial, String html) {
    System.out.println(html);
    // TODO Logic for remove answers flag
    HtmlMaterialUpdateEvent event = new HtmlMaterialUpdateEvent(htmlMaterial, htmlMaterial.getHtml(), html, false);
    materialUpdateEvent.fire(event);
    return htmlMaterialDAO.updateData(htmlMaterial, html);
  }
  
  public HtmlMaterial updateHtmlMaterialToRevision(HtmlMaterial htmlMaterial, String html, Long revisionNumber, boolean removeNewerRevisions) {
    updateHtmlMaterialHtml(htmlMaterial, html);
    htmlMaterialDAO.updateRevisionNumber(htmlMaterial, revisionNumber);
    
    if (removeNewerRevisions) {
      for (HtmlMaterialRevision revision : listRevisionsAfter(htmlMaterial, revisionNumber)) {
        deleteRevision(revision);
      }
    }
    
    return htmlMaterial;
  }

  public String getRevisionHtml(HtmlMaterial htmlMaterial, long revision) throws CoOpsInternalErrorException {
    String result = htmlMaterial.getHtml();
    long baselineRevision = htmlMaterial.getRevisionNumber();
    CoOpsDiffAlgorithm algorithm = findAlgorithm("dmp");

    if (revision < baselineRevision) {
      List<HtmlMaterialRevision> revisions = htmlMaterialRevisionDAO.listByFileAndRevisionGtAndRevisonLeOrderedByRevision(htmlMaterial, revision, baselineRevision);
      for (int i = revisions.size() - 1; i >= 0; i--) {
        HtmlMaterialRevision patchingRevision = revisions.get(i);
        try {
          if (patchingRevision.getData() != null) {
            result = algorithm.unpatch(result, patchingRevision.getData());
          }
        } catch (CoOpsConflictException e) {
          throw new CoOpsInternalErrorException("Patch failed when building material revision number " + revision);
        }
      }
          
    } else {
      List<HtmlMaterialRevision> revisions = htmlMaterialRevisionDAO.listByFileAndRevisionGtAndRevisonLeOrderedByRevision(htmlMaterial, baselineRevision, revision);

      for (HtmlMaterialRevision patchingRevision : revisions) {
        try {
          if (patchingRevision.getData() != null) {
            result = algorithm.patch(result, patchingRevision.getData());
          }
        } catch (CoOpsConflictException e) {
          throw new CoOpsInternalErrorException("Patch failed when building material revision number " + revision);
        }
      }
    }
    
    return result;
  }
  
  public long lastHtmlMaterialRevision(HtmlMaterial htmlMaterial) {
    Long maxRevision = htmlMaterialRevisionDAO.maxRevisionByHtmlMaterial(htmlMaterial);
    if (maxRevision == null) {
      maxRevision = 0l;
    }
    return maxRevision;
  }

  /* HtmlMaterialRevision */
  
  public HtmlMaterialRevision createRevision(HtmlMaterial htmlMaterial, String sessionId, Long patchRevisionNumber, Date date, String patch, String checksum) {
    return htmlMaterialRevisionDAO.create(htmlMaterial, sessionId, patchRevisionNumber, new Date(), patch, checksum);
  }
  
  private void deleteRevision(HtmlMaterialRevision revision) {
    List<HtmlMaterialRevisionExtensionProperty> extensionProperties = listRevisionExtensionProperties(revision);
    List<HtmlMaterialRevisionProperty> properties = listRevisionProperties(revision);
    
    for (HtmlMaterialRevisionExtensionProperty extensionProperty : extensionProperties) {
      htmlMaterialRevisionExtensionPropertyDAO.delete(extensionProperty);
    }
    
    for (HtmlMaterialRevisionProperty property : properties) {
      htmlMaterialRevisionPropertyDAO.delete(property);
    }
    
    htmlMaterialRevisionDAO.delete(revision);
  }

  /* HtmlMaterialProperty */
  
  public List<HtmlMaterialProperty> listPropertiesByMaterial(HtmlMaterial htmlMaterial) {
    return htmlMaterialPropertyDAO.listByHtmlMaterial(htmlMaterial);
  }

  public List<HtmlMaterialRevision> listRevisionsAfter(HtmlMaterial htmlMaterial, Long revisionNumber) {
    return htmlMaterialRevisionDAO.listByFileAndRevisionGreaterThanOrderedByRevision(htmlMaterial, revisionNumber);
  }

  public HtmlMaterialProperty setProperty(HtmlMaterial htmlMaterial, String key, String value) {
    HtmlMaterialProperty fileProperty = htmlMaterialPropertyDAO.findByHtmlMaterialAndKey(htmlMaterial, key);
    if (fileProperty == null) {
      return htmlMaterialPropertyDAO.create(htmlMaterial, key, value);
    } else {
      return htmlMaterialPropertyDAO.updateValue(fileProperty, value);
    }
  }

  /* HtmlMaterialRevisionProperty */

  public HtmlMaterialRevisionProperty createRevisionProperty(HtmlMaterialRevision htmlMaterialRevision, String key, String value) {
    return htmlMaterialRevisionPropertyDAO.create(htmlMaterialRevision, key, value);
  }

  public List<HtmlMaterialRevisionProperty> listRevisionProperties(HtmlMaterialRevision htmlMaterialRevision) {
    return htmlMaterialRevisionPropertyDAO.listByHtmlMaterialRevision(htmlMaterialRevision);
  }

  /* HtmlMaterialRevisionExtensionProperty */
  
  public HtmlMaterialRevisionExtensionProperty createRevisionExtensionProperty(HtmlMaterialRevision htmlMaterialRevision, String key, String value) {
    return htmlMaterialRevisionExtensionPropertyDAO.create(htmlMaterialRevision, key, value);
  }

  public List<HtmlMaterialRevisionExtensionProperty> listRevisionExtensionProperties(HtmlMaterialRevision htmlMaterialRevision) {
    return htmlMaterialRevisionExtensionPropertyDAO.listByHtmlMaterialRevision(htmlMaterialRevision);
  }
  
  /* HtmlMaterialExtensionProperty */

  public void setExtensionProperty(HtmlMaterial htmlMaterial, String key, String value) {
    HtmlMaterialExtensionProperty htmlMaterialExtensionProperty = htmlMaterialExtensionPropertyDAO.findByFileAndKey(htmlMaterial, key);
    if (htmlMaterialExtensionProperty == null) {
      htmlMaterialExtensionPropertyDAO.create(htmlMaterial, key, value);
    } else {
      htmlMaterialExtensionPropertyDAO.updateValue(htmlMaterialExtensionProperty, value);
    }
  }

  
  public CoOpsDiffAlgorithm findAlgorithm(String algorithmName) {
    return findAlgorithm(Arrays.asList(algorithmName)); 
  }
  
  public CoOpsDiffAlgorithm findAlgorithm(List<String> algorithmNames) {
    Map<String, CoOpsDiffAlgorithm> algorithmMap = getAlgorithmMap();
    for (String algorithmName : algorithmNames) {
      if (algorithmMap.containsKey(algorithmName)) {
        return algorithmMap.get(algorithmName);
      }
    }
    
    return null;
  }
  
  private Map<String, CoOpsDiffAlgorithm> getAlgorithmMap() {
    Map<String, CoOpsDiffAlgorithm> result = new HashMap<>();
    
    Iterator<CoOpsDiffAlgorithm> iterator = this.algorithms.iterator();
    while (iterator.hasNext()) {
      CoOpsDiffAlgorithm algorithm = iterator.next();
      result.put(algorithm.getName(), algorithm);
    }
    
    return result;
  }

}

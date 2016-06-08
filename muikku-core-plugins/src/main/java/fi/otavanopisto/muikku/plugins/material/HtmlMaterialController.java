package fi.otavanopisto.muikku.plugins.material;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.foyt.coops.CoOpsConflictException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.otavanopisto.muikku.plugins.material.coops.CoOpsDiffAlgorithm;
import fi.otavanopisto.muikku.plugins.material.coops.dao.HtmlMaterialRevisionDAO;
import fi.otavanopisto.muikku.plugins.material.coops.dao.HtmlMaterialRevisionExtensionPropertyDAO;
import fi.otavanopisto.muikku.plugins.material.coops.dao.HtmlMaterialRevisionPropertyDAO;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionExtensionProperty;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty;
import fi.otavanopisto.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.MaterialVisibility;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;

@Dependent
public class HtmlMaterialController {

  @Inject
  private HtmlMaterialDAO htmlMaterialDAO;
  
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

  public HtmlMaterial createHtmlMaterial(String title, String html, String contentType, Long revisionNumber, String license) {
    return createHtmlMaterial(title, html, contentType, revisionNumber, null, license, MaterialVisibility.EVERYONE);
  }

  public HtmlMaterial createHtmlMaterial(String title, String html, String contentType, Long revisionNumber, HtmlMaterial originMaterial, String license, MaterialVisibility visibility) {
    HtmlMaterial material = htmlMaterialDAO.create(title, html, contentType, revisionNumber, originMaterial, license, visibility);
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
    return updateHtmlMaterialHtml(htmlMaterial, html, false);
  }
  
  public HtmlMaterial updateHtmlMaterialHtml(HtmlMaterial htmlMaterial, String html, boolean removeAnswers) {
    HtmlMaterialUpdateEvent event = new HtmlMaterialUpdateEvent(htmlMaterial, htmlMaterial.getHtml(), html, removeAnswers);
    materialUpdateEvent.fire(event);
    return htmlMaterialDAO.updateData(htmlMaterial, html);
  }
  
  public HtmlMaterial updateHtmlMaterialToRevision(HtmlMaterial htmlMaterial, String html, Long revisionNumber, boolean removeNewerRevisions, boolean removeAnswers) throws WorkspaceMaterialContainsAnswersExeption {
    // TODO: WorkspaceMaterialContainsAnswersExeption quick fix should be removed
    try {
      updateHtmlMaterialHtml(htmlMaterial, html, removeAnswers);
    } catch (Exception e) {
      Throwable cause = e;
      while (cause != null) {
        cause = cause.getCause();
        if (cause instanceof WorkspaceMaterialContainsAnswersExeption) {
          throw (WorkspaceMaterialContainsAnswersExeption) cause;
        }
      }
      throw e;
    }
    
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
    if (result == null) {
      result = "";
    }
    long baselineRevision = htmlMaterial.getRevisionNumber();
    CoOpsDiffAlgorithm algorithm = findAlgorithm("dmp");

    if (revision < baselineRevision) {
      List<HtmlMaterialRevision> revisions = htmlMaterialRevisionDAO.listByFileAndRevisionGeAndRevisonLtOrderedByRevision(htmlMaterial, revision, baselineRevision);
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

  public String getRevisionProperty(HtmlMaterial htmlMaterial, Long revisionNumber, String property) {
    HtmlMaterialRevisionProperty revisionProperty = null;
    
    if (revisionNumber > htmlMaterial.getRevisionNumber()) {
      revisionProperty = htmlMaterialRevisionPropertyDAO.findByHtmlMaterialAndKeyMaxRevision(htmlMaterial, property);
    } else {
      revisionProperty = htmlMaterialRevisionPropertyDAO.findByHtmlMaterialAndKeyRevisionLeAndMaxRevision(htmlMaterial, property, htmlMaterial.getRevisionNumber());  
    }
    
    if (revisionProperty == null) {
      return null;
    } else {
      return revisionProperty.getValue();
    }
  }

  public Map<String, String> getRevisionProperties(HtmlMaterial htmlMaterial, Long revisionNumber) {
    Map<String, String> result = new HashMap<>();
    
    for (String key : htmlMaterialRevisionPropertyDAO.listKeysByHtmlMaterial(htmlMaterial)) {
      String value = getRevisionProperty(htmlMaterial, revisionNumber, key);
      if (value != null) {
        result.put(key, value);
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

  public List<HtmlMaterialRevision> listRevisionsAfter(HtmlMaterial htmlMaterial, Long revisionNumber) {
    return htmlMaterialRevisionDAO.listByFileAndRevisionGreaterThanOrderedByRevision(htmlMaterial, revisionNumber);
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
  
  /* CoOpsDiffAlgorithm */
  
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

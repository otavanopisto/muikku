package fi.muikku.plugins.dnm.util;

import java.io.StringReader;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.xerces.parsers.DOMParser;
import org.cyberneko.html.HTMLConfiguration;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;

import com.sksamuel.diffpatch.DiffMatchPatch;
import com.sksamuel.diffpatch.DiffMatchPatch.Diff;
import com.sksamuel.diffpatch.DiffMatchPatch.Patch;

import fi.foyt.coops.CoOpsInternalErrorException;
import fi.foyt.coops.CoOpsUsageException;
import fi.muikku.plugins.dnm.parser.DeusNexXmlUtils;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.coops.CoOpsDiffAlgorithm;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public class HtmlMaterialCleaner {
  
  private static final String COOPS_PATCH_ALGORITHM = "dmp";
  
  @Inject
  private Logger logger;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  @Any
  private Instance<HtmlMaterialCleanerTask> analyzerTasks;

  public void cleanMaterial(HtmlMaterial htmlMaterial, WorkspaceMaterial ownerMaterial) {
    Long maxRevision = getMaterialRevision(htmlMaterial);
    try {
      // Document
      String html = htmlMaterialController.getRevisionHtml(htmlMaterial, maxRevision);
      DOMParser parser = new DOMParser(new HTMLConfiguration());
      parser.setProperty("http://cyberneko.org/html/properties/names/elems", "lower");
      InputSource inputSource = new InputSource(new StringReader(html));
      parser.parse(inputSource);
      Document document = parser.getDocument();
      // Tasks
      Iterator<HtmlMaterialCleanerTask> taskIterator = analyzerTasks.iterator();
      String newHtml = null;
      while (taskIterator.hasNext()) {
        HtmlMaterialCleanerTask task = taskIterator.next();
        if (task.process(document, ownerMaterial)) {
          newHtml = DeusNexXmlUtils.serializeElement(document.getDocumentElement(), true, false, "html");
          patch(htmlMaterial, newHtml);
        }
      }
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to clean material " + htmlMaterial.getId(), e);
    }
  }
  
  public void patch(HtmlMaterial material, String newHtml) throws CoOpsUsageException, CoOpsInternalErrorException, WorkspaceMaterialContainsAnswersExeption {
    CoOpsDiffAlgorithm algorithm = htmlMaterialController.findAlgorithm(COOPS_PATCH_ALGORITHM);
    if (algorithm == null) {
      throw new CoOpsUsageException("Algorithm is not supported by this server");
    }
    Long maxRevision = getMaterialRevision(material);
    boolean published = material.getRevisionNumber().equals(maxRevision);
    
    String oldHtml = htmlMaterialController.getRevisionHtml(material, maxRevision);
    if (oldHtml == null) {
      oldHtml = "";
    }
    String checksum = DigestUtils.md5Hex(newHtml);
    String patch = createPatch(oldHtml, newHtml);
    
    Long patchRevisionNumber = maxRevision + 1;
    HtmlMaterialRevision htmlMaterialRevision = htmlMaterialController.createRevision(material, "dnm-cleaner", patchRevisionNumber, new Date(), patch, checksum);

    if (published) {
      htmlMaterialController.updateHtmlMaterialToRevision(material, newHtml, htmlMaterialRevision.getRevision(), false, false);
    }
  }

  private Long getMaterialRevision(HtmlMaterial material) {
    Long maxRevision = htmlMaterialController.lastHtmlMaterialRevision(material);
    return maxRevision == null ? 0l : maxRevision;
  }
  
  private String createPatch(String oldHtml, String newHtml) {
    DiffMatchPatch diffMatchPatch = new DiffMatchPatch();
    LinkedList<Diff> diffs = diffMatchPatch.diff_main(oldHtml, newHtml);
    diffMatchPatch.diff_cleanupEfficiency(diffs);
    LinkedList<Patch> patch = diffMatchPatch.patch_make(diffs);
    return diffMatchPatch.patch_toText(patch);
  }
  
}

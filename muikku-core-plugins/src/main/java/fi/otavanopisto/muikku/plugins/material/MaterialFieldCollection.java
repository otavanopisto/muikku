package fi.otavanopisto.muikku.plugins.material;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.DeserializationConfig;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import fi.otavanopisto.muikku.plugins.material.fieldmeta.FieldMeta;

public class MaterialFieldCollection {
  
  public MaterialFieldCollection() {
  }
  
  public MaterialFieldCollection(String html) {
    parseFields(html);
  }
  
  public void parseFields(String html) {
    if (!materialFields.isEmpty()) {
      materialFields.clear();
    }
    if (StringUtils.isNotBlank(html)) {
      StringReader htmlReader = new StringReader(html);
      try {
        DOMParser parser = new DOMParser();
        InputSource inputSource = new InputSource(htmlReader);
        parser.parse(inputSource);
        Document document = parser.getDocument();
        NodeList objectNodeList = document.getElementsByTagName("object");
        for (int i = 0, l = objectNodeList.getLength(); i < l; i++) {
          Node objectNode = objectNodeList.item(i);
          if (objectNode instanceof Element) {
            Element objectElement = (Element) objectNode;
            if (isMuikkuField(objectElement)) {
              String fieldType = objectElement.getAttribute("type");
              NodeList paramNodes = objectElement.getElementsByTagName("param");
              String content = null;
              for (int j = 0, jl = paramNodes.getLength(); j < jl; j++) {
                Node paramNode = paramNodes.item(j);
                if (paramNode instanceof Element) {
                  Element paramElement = (Element) paramNode;
                  if ("content".equals(paramElement.getAttribute("name"))) {
                    content = paramElement.getAttribute("value");
                    break;
                  }
                }
              }
              if (StringUtils.isNotBlank(content)) {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                FieldMeta fieldMeta = objectMapper.readValue(content, FieldMeta.class);
                materialFields.put(fieldMeta.getName(), new MaterialField(fieldMeta.getName(), fieldType, content));
              }
            }
          }
        }
      }
      catch (Exception e) {
        // TODO Proper exception handling
        throw new IllegalArgumentException("Malformed document structure: " + html);
      }
      finally {
        htmlReader.close();
      }
    }
  }
  
  public boolean hasField(String name) {
    return materialFields.containsKey(name);
  }
  
  public MaterialField getField(String name) {
    return materialFields.get(name);
  }
  
  public Set<String> getFieldNames() {
    return materialFields.keySet();
  }

  public List<MaterialField> getFields() {
    return Collections.unmodifiableList(new ArrayList<>(materialFields.values()));
  }
  
  public List<MaterialField> getNewFields(MaterialFieldCollection collection) {
    List<MaterialField> fields = new ArrayList<MaterialField>();
    Set<String> names = materialFields.keySet();
    for (String name : names) {
      if (!collection.hasField(name)) {
        fields.add(getField(name));
      }
    }
    
    return Collections.unmodifiableList(fields);
  }

  public List<MaterialField> getUpdatedFields(MaterialFieldCollection collection) {
    List<MaterialField> fields = new ArrayList<MaterialField>();
    Set<String> names = materialFields.keySet();
    for (String name : names) {
      if (collection.hasField(name)) {
        MaterialField myField = getField(name);
        MaterialField referenceField = collection.getField(name);
        if (!myField.equals(referenceField)) {
          fields.add(myField);
        }
      }
    }
    
    return Collections.unmodifiableList(fields);
  }
  
  public List<MaterialField> getRemovedFields(MaterialFieldCollection collection) {
    List<MaterialField> fields = new ArrayList<MaterialField>();
    Set<String> names = collection.getFieldNames();
    for (String name : names) {
      if (!hasField(name)) {
        fields.add(collection.getField(name));
      }
    }
    
    return Collections.unmodifiableList(fields);
  }
  
  private boolean isMuikkuField(Element element) {
    String type = element.getAttribute("type");
    return StringUtils.startsWith(type,  "application/vnd.muikku.field.");
  }
  
  private HashMap<String, MaterialField> materialFields = new HashMap<String, MaterialField>();

}

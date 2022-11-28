package fi.otavanopisto.muikku.plugins.material;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;

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
      try {
        Document document = Jsoup.parse(html, "", Parser.htmlParser());
        Elements elements = document.getElementsByTag("object");
        for (int i = 0; i < elements.size(); i++) {
          Element element = elements.get(i);
          if (isMuikkuField(element)) {
            String fieldType = element.attr("type");
            Elements params = element.getElementsByTag("param");
            String content = null;
            for (int j = 0; j < params.size(); j++) {
              Element param = params.get(j);
              if ("content".equals(param.attr("name"))) {
                content = param.attr("value");
                break;
              }
            }
            if (StringUtils.isNotBlank(content)) {
              ObjectMapper objectMapper = new ObjectMapper();
              objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
              FieldMeta fieldMeta = objectMapper.readValue(content, FieldMeta.class);
              materialFields.put(fieldMeta.getName(), new MaterialField(fieldMeta.getName(), fieldType, content));
            }
          }
        }
      }
      catch (Exception e) {
        // TODO Proper exception handling
        throw new IllegalArgumentException("Malformed document structure: " + html);
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
        // #5277: Since even unchanged connect fields could already be corrupt in
        // database, always treat them as updated :|
        else if ("application/vnd.muikku.field.connect".equals(myField.getType())) {
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
    String type = element.attr("type");
    return StringUtils.startsWith(type, "application/vnd.muikku.field.");
  }

  private HashMap<String, MaterialField> materialFields = new HashMap<String, MaterialField>();

}

package fi.otavanopisto.muikku.plugins.dnm.parser.structure;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.xpath.XPathExpressionException;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.text.translate.NumericEntityUnescaper;
import org.w3c.dom.CDATASection;
import org.w3c.dom.DOMException;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.Text;
import org.xml.sax.SAXException;

import fi.otavanopisto.muikku.plugins.dnm.parser.DeusNexException;
import fi.otavanopisto.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.otavanopisto.muikku.plugins.dnm.parser.DeusNexSyntaxException;
import fi.otavanopisto.muikku.plugins.dnm.parser.DeusNexXmlUtils;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Binary;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Document;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Query;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Resource;

public class DeusNexStructureParser {

  private static Logger logger = Logger.getLogger(DeusNexStructureParser.class.getName());

  public DeusNexDocument parseDocument(InputStream inputStream) throws DeusNexException {
    DeusNexDocumentImpl deusNexDocument = new DeusNexDocumentImpl();
    DocumentBuilder builder = DeusNexXmlUtils.createDocumentBuilder();

    org.w3c.dom.Document domDocument;
    try {
      domDocument = builder.parse(inputStream);
    } catch (SAXException | IOException e1) {
      throw new DeusNexInternalException("XML Parsing failed", e1);
    }

    if (!"doc".equals(domDocument.getDocumentElement().getTagName())) {
      throw new DeusNexSyntaxException("Invalid root element");
    }

    try {
      deusNexDocument.setRootFolder(parseFolder(domDocument.getDocumentElement()));
    } catch (XPathExpressionException e) {
      throw new DeusNexInternalException("Invalid XPath expression", e);
    }

    return deusNexDocument;
  }

  private Resource parseResource(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException, DeusNexInternalException {
    int type = DeusNexXmlUtils.getChildValueInt(resourceElement, "type");

    switch (type) {
    case 2:
    case 3:
      return parseBinary(resourceElement);
    case 4:
      return parseFolder(resourceElement);
    case 7:
      return parseStyleDocument(resourceElement);
    case 34:
      return parseQueryDocument(resourceElement);
    case 37:
      return parseFCKDocument(resourceElement);
    case 38:
      return parseFCKQuery(resourceElement);
    case 11:
      return parseLink(resourceElement);
    default:
      throw new DeusNexInternalException("Unimplemented resource type " + type);
    }
  }

  private Resource parseLink(Element resourceElement) throws DeusNexInternalException {
    // TODO: Add support for proper link materials
    Document document = new Document();

    Element linkElement = resourceElement.getOwnerDocument().createElement("a");
    try {
      linkElement.setAttribute("href", DeusNexXmlUtils.getChildValue(resourceElement, "path"));
      linkElement.setTextContent(DeusNexXmlUtils.getChildValue(resourceElement, "title"));
      parseBasicResourceProperties(resourceElement, document);

      Element documentElement = resourceElement.getOwnerDocument().createElement("document");
      Element fckDocumentElement = resourceElement.getOwnerDocument().createElement("fckdocument");
      fckDocumentElement.setAttribute("lang", "fi");
      fckDocumentElement.appendChild(linkElement);
      documentElement.appendChild(fckDocumentElement);

      document.setDocument(documentElement);
    } catch (DOMException | XPathExpressionException | DeusNexSyntaxException e) {
      throw new DeusNexInternalException("Link parsing failed", e);
    }
    return document;
  }

  private Binary parseBinary(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException, DeusNexInternalException {
    Binary binary = new Binary();
    parseBasicResourceProperties(resourceElement, binary);

    Element contentElement = (Element) DeusNexXmlUtils.findNodeByXPath(resourceElement, "content");
    Node contentChild = contentElement.getFirstChild();
    String textContent = null;

    if (contentChild instanceof CDATASection) {
      textContent = ((CDATASection) contentChild).getTextContent();
    } else if (contentChild instanceof Text) {
      textContent = ((Text) contentChild).getTextContent();
    }
    byte[] content;
    try {
      content = decodeDeusNexBinary(textContent);
    } catch (UnsupportedEncodingException | DOMException e) {
      throw new DeusNexInternalException("Could not retrieve binary content", e);
    }

    binary.setContent(content);
    binary.setContentType(DeusNexXmlUtils.getChildValue(resourceElement, "contentType"));

    return binary;
  }

  private byte[] decodeDeusNexBinary(String binaryData) throws UnsupportedEncodingException {
    // First we need to decode base64 encoding
    byte[] decodedBytes = Base64.decodeBase64(binaryData);
    // Convert bytes into ISO-8859-1 string
    String decodedString = new String(decodedBytes, "ISO-8859-1");
    // Translate escaped xml entities into characters
    String translatedString = new NumericEntityUnescaper().translate(decodedString);
    // Convert string into byte array using ISO-8859-1 encoding
    byte[] translatedBytes = translatedString.getBytes("ISO-8859-1");
    // And voilà we have a working binary
    return translatedBytes;
  }

  private Query parseFCKQuery(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException, DeusNexInternalException {
    Element documentElement = (Element) DeusNexXmlUtils.findNodeByXPath(resourceElement, "document");

    if (documentElement == null) {
      logger.severe("Missing data/document node");
      return null;
    }

    List<Resource> embeddedElements = new ArrayList<>();
    List<Element> embeddedResourceElements = DeusNexXmlUtils.getElementsByXPath(resourceElement, "embedded/res");
    for (Element embeddedResourceElement : embeddedResourceElements) {
      Resource resource = parseResource(embeddedResourceElement);
      if (resource != null) {
        embeddedElements.add(resource);
      }
    }

    Query query = new Query();
    parseBasicResourceProperties(resourceElement, query);
    query.setDocument(documentElement);
    query.setResources(embeddedElements);
    query.setQueryIdType(DeusNexXmlUtils.getChildValue(resourceElement, "queryIdType"));
    query.setQueryStorageType(DeusNexXmlUtils.getChildValue(resourceElement, "queryStorageType"));
    query.setQueryState(DeusNexXmlUtils.getChildValue(resourceElement, "queryState"));
    query.setQueryType(DeusNexXmlUtils.getChildValue(resourceElement, "queryType"));

    return query;
  }

  private Document parseStyleDocument(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException,
      DeusNexInternalException {
    Element documentElement = (Element) DeusNexXmlUtils.findNodeByXPath(resourceElement, "document/styledocument");

    if (documentElement == null) {
      logger.severe("Missing data/document node");
      return null;
    }

    List<Resource> embeddedElements = new ArrayList<>();
    List<Element> embeddedResourceElements = DeusNexXmlUtils.getElementsByXPath(resourceElement, "embedded/res");
    for (Element embeddedResourceElement : embeddedResourceElements) {
      Resource resource = parseResource(embeddedResourceElement);
      if (resource != null) {
        embeddedElements.add(resource);
      }
    }

    Document document = new Document();
    parseBasicResourceProperties(resourceElement, document);
    document.setDocument(documentElement);
    document.setResources(embeddedElements);

    return document;
  }

  private Query parseQueryDocument(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException,
      DeusNexInternalException {
    Element documentElement = (Element) DeusNexXmlUtils.findNodeByXPath(resourceElement, "styledocument");
    List<Resource> embeddedElements = new ArrayList<>();

    if (documentElement == null) {
      logger.severe("Missing data/document node");
      return null;
    }

    List<Element> embeddedResourceElements = DeusNexXmlUtils.getElementsByXPath(resourceElement, "embedded/res");
    for (Element embeddedResourceElement : embeddedResourceElements) {
      Resource resource = parseResource(embeddedResourceElement);
      if (resource != null) {
        embeddedElements.add(resource);
      }
    }

    Query query = new Query();
    parseBasicResourceProperties(resourceElement, query);
    query.setDocument(documentElement);
    query.setResources(embeddedElements);
    query.setQueryIdType(DeusNexXmlUtils.getChildValue(resourceElement, "queryIdType"));
    query.setQueryStorageType(DeusNexXmlUtils.getChildValue(resourceElement, "queryStorageType"));
    query.setQueryState(DeusNexXmlUtils.getChildValue(resourceElement, "queryState"));
    query.setQueryType(DeusNexXmlUtils.getChildValue(resourceElement, "queryType"));

    return query;
  }

  private Document parseFCKDocument(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException,
      DeusNexInternalException {
    Element documentElement = (Element) DeusNexXmlUtils.findNodeByXPath(resourceElement, "document");

    if (documentElement == null) {
      logger.severe("Missing data/document node");
      return null;
    }

    List<Resource> embeddedElements = new ArrayList<>();
    List<Element> embeddedResourceElements = DeusNexXmlUtils.getElementsByXPath(resourceElement, "embedded/res");
    for (Element embeddedResourceElement : embeddedResourceElements) {
      Resource resource = parseResource(embeddedResourceElement);
      if (resource != null) {
        embeddedElements.add(resource);
      }
    }

    Document document = new Document();
    parseBasicResourceProperties(resourceElement, document);
    document.setDocument(documentElement);
    document.setResources(embeddedElements);

    return document;
  }

  private Folder parseFolder(Element resourceElement) throws DeusNexSyntaxException, XPathExpressionException, DeusNexInternalException {
    List<Element> childResources = DeusNexXmlUtils.getElementsByXPath(resourceElement, "res");
    List<Resource> resources = new ArrayList<>();
    for (Element childResource : childResources) {
      Resource resource = parseResource(childResource);
      if (resource != null) {
        resources.add(resource);
      }
    }

    Folder folder = new Folder();
    parseBasicResourceProperties(resourceElement, folder);
    folder.setResources(resources);

    return folder;
  }

  private void parseBasicResourceProperties(Element resourceElement, Resource resource) throws XPathExpressionException,
      DeusNexSyntaxException {
    Integer no = DeusNexXmlUtils.getChildValueInteger(resourceElement, "no");
    if (no == null) {
      throw new DeusNexSyntaxException("Missing no node");
    }

    resource.setNo(no);
    resource.setName(DeusNexXmlUtils.getChildValue(resourceElement, "name"));
    resource.setPath(DeusNexXmlUtils.getChildValue(resourceElement, "path"));
    resource.setTitle(DeusNexXmlUtils.getChildValue(resourceElement, "title"));
    resource.setHidden(DeusNexXmlUtils.getChildValueInt(resourceElement, "hidden") == 1 ? Boolean.TRUE : Boolean.FALSE);
  }

}

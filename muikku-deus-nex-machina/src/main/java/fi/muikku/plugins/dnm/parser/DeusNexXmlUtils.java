package fi.muikku.plugins.dnm.parser;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class DeusNexXmlUtils {

	
	public static int getChildValueInt(Element parent, String name) throws XPathExpressionException {
		return getChildValueInteger(parent, name);
	}
	
	public static Integer getChildValueInteger(Element parent, String name) throws XPathExpressionException {
		String childValue = getChildValue(parent, name);
		if (StringUtils.isNotBlank(childValue)) {
  		return NumberUtils.createInteger(childValue);
		}
		
		return null;
	}
	
	public static Long getChildValueLong(Element parent, String name) throws XPathExpressionException {
		String childValue = getChildValue(parent, name);
		if (StringUtils.isNotBlank(childValue)) {
	  	return NumberUtils.createLong(childValue);
		}
		
		return null;
	}
	
	public static String getChildValue(Element parent, String name) throws XPathExpressionException {
		Node node = findNodeByXPath(parent, name);
		if (node instanceof Element) {
			return ((Element) node).getTextContent();
		}
		
		return null;
	}

	public static List<Element> getElementsByXPath(Element parent, String name) throws XPathExpressionException {
		List<Element> result = new ArrayList<>();
		for (Node node : getNodesByXPath(parent, name)) {
			if (node instanceof Element) {
				result.add((Element) node);
			}
		}
		
		return result;
	}
	
	public static List<Node> getNodesByXPath(Element parent, String name) throws XPathExpressionException {
		List<Node> result = new ArrayList<>();
		
		NodeList nodeList = findNodesByXPath(parent, name);
		for (int i = 0, l = nodeList.getLength(); i < l; i++) {
			result.add(nodeList.item(i));
		}
		
		return result;
	}
	
	public static Node findNodeByXPath(Node contextNode, String expression) throws XPathExpressionException {
		return (Node) XPathFactory.newInstance().newXPath().evaluate(expression, contextNode, XPathConstants.NODE);
	}
	
	public static NodeList findNodesByXPath(Node contextNode, String expression) throws XPathExpressionException {
		return (NodeList) XPathFactory.newInstance().newXPath().evaluate(expression, contextNode, XPathConstants.NODESET);
	}

	public static String serializeElement(Element element) throws TransformerException {
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
		StringWriter writer = new StringWriter();
    transformer.transform(new DOMSource(element), new StreamResult(writer));
    return writer.getBuffer().toString();
	}

}

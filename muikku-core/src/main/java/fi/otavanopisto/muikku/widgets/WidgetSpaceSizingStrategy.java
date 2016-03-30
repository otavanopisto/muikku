package fi.otavanopisto.muikku.widgets;

public enum WidgetSpaceSizingStrategy {
	
	/**
	 * Allocates size by using the size of largest of widget space widgets 
	 */
	
	MINIMIZE,
	
	/**
	 * Allocates size by summing the size of all widgets inside a widget space
	 */
	
	SUM,
	
	/**
	 * Allocates all remaining space by subtracting size of adjacent widget spaces 
	 * from maximum total available size.
	 */
	MAXIMIZE
}
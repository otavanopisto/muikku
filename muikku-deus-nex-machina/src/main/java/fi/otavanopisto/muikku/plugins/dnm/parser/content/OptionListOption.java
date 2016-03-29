package fi.otavanopisto.muikku.plugins.dnm.parser.content;

public class OptionListOption {

	public OptionListOption(String name, Double points, String text) {
		this.name = name;
		this.points = points;
		this.text = text;
	}

	public String getName() {
		return name;
	}

	public Double getPoints() {
		return points;
	}

	public String getText() {
		return text;
	}

	private String name;
	private Double points;
	private String text;

}

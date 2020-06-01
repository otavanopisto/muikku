package fi.otavanopisto.muikku.plugins.dnm.parser.content;

public class RightAnswer {

	public RightAnswer(Double points, String text) {
		this.points = points;
		this.text = text;
	}

	public Double getPoints() {
		return points;
	}

	public String getText() {
		return text;
	}

	private Double points;
	private String text;

}

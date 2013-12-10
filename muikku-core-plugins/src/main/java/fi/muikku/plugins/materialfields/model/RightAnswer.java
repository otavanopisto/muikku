package fi.muikku.plugins.materialfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class RightAnswer {
	
    public Double getPoints() {
		return points;
	}

	public void setPoints(Double points) {
		this.points = points;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isCaseSensitive() {
		return caseSensitive;
	}

	public void setCaseSensitive(boolean caseSensitive) {
		this.caseSensitive = caseSensitive;
	}

	public boolean isNormalizeWhitespace() {
		return normalizeWhitespace;
	}

	public void setNormalizeWhitespace(boolean normalizeWhitespace) {
		this.normalizeWhitespace = normalizeWhitespace;
	}

	public QueryField getField() {
		return field;
	}

	public void setField(QueryField field) {
		this.field = field;
	}

	@NotNull
	@Column(nullable = false)
	@NotEmpty
	private Double points;
	
	@NotNull
	@Column(nullable = false)
	@NotEmpty
    private String text;
	
	@NotNull
	@Column(nullable = false)
	@NotEmpty
    private boolean caseSensitive;
	
	@NotNull
	@Column(nullable = false)
	@NotEmpty
    private boolean normalizeWhitespace;
	
	@ManyToOne
	@JoinColumn(name = "field_id")
	private QueryField field;
		
}

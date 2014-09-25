package fi.muikku.plugins.schooldatamock;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatamock.entities.MockedGradingScale;
import fi.muikku.plugins.schooldatamock.entities.MockedGradingScaleItem;
import fi.muikku.schooldata.GradingSchoolDataBridge;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;

@Dependent
@Stateful
public class MockedGradingSchoolDataBridge implements GradingSchoolDataBridge {

  @Inject
  private SchoolDataMockPluginController schoolDataMockPluginController;
  
	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public GradingScale findGradingScale(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name from GradingScale where id = ?", id);
  			if (resultSet.next()) {
  				return new MockedGradingScale(resultSet.getString(1), resultSet.getString(2));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public List<GradingScale> listGradingScales() throws UnexpectedSchoolDataBridgeException {
		List<GradingScale> result = new ArrayList<>();

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, name from GradingScale");
  			while (resultSet.next()) {
  				result.add(new MockedGradingScale(resultSet.getString(1), resultSet.getString(2)));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

	@Override
	public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		Long id = NumberUtils.createLong(identifier);

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, grading_scale_id, name from GradingScaleItem where id = ?", id);
  			if (resultSet.next()) {
  				return new MockedGradingScaleItem(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<GradingScaleItem> result = new ArrayList<>();

		try {
      Connection connection = schoolDataMockPluginController.getConnection();
      try {
  			ResultSet resultSet = schoolDataMockPluginController.executeSelect(connection, "select id, grading_scale_id, name from GradingScaleItem");
  			while (resultSet.next()) {
  				result.add(new MockedGradingScaleItem(resultSet.getString(1), resultSet.getString(2), resultSet.getString(2)));
  			}
      } finally {
        connection.close();
      }
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

}

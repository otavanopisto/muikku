/**
 * This information comes from the api endpoint and contains
 * those properties, any changes to this data will be related
 * to the endpoint
 */
export interface MainChartData {
  EVALUATION_REQUESTED?: number;
  EVALUATION_GOTINCOMPLETED?: number;
  EVALUATION_GOTFAILED?: number;
  EVALUATION_GOTPASSED?: number;
  SESSION_LOGGEDIN?: number;
  WORKSPACE_VISIT?: number;
  MATERIAL_EXERCISEDONE?: number;
  MATERIAL_ASSIGNMENTDONE?: number;
  FORUM_NEWMESSAGE?: number;
  NOTIFICATION_ASSESMENTREQUEST?: number;
  NOTIFICATION_NOPASSEDCOURSES?: number;
  NOTIFICATION_SUPPLEMENTATIONREQUEST?: number;
  NOTIFICATION_STUDYTIME?: number;
}

/**
 * The filter type for the main chart, key values of MainChartData
 */
export type MainChartFilter = keyof MainChartData;

/**
 * Configuration for each series in the chart.
 */
export interface SeriesConfig {
  /**
   * The field name in the data object
   */
  field: MainChartFilter;
  /**
   * The name to be displayed in the legend/filter list
   */
  name: string;
  /**
   * The color of the series, amcharts color
   */
  color: string;
  /**
   * Style modifier
   */
  modifier: string;
  /**
   * The type of series (line or column)
   */
  type: string;
}

import React, { useLayoutEffect, useRef, useState, useCallback } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// eslint-disable-next-line camelcase
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Graph, GraphFilterEnum } from "./types";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { ActivityLogEntry } from "~/generated/client";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
// eslint-disable-next-line camelcase
import am4lang_en_US from "@amcharts/amcharts4/lang/en_US";
// eslint-disable-next-line camelcase
import am4lang_fi_FI from "@amcharts/amcharts4/lang/fi_FI";
import { localize } from "~/locales/i18n";
import Dropdown from "../dropdown";
import { processChartData } from "./helper";

// Apply animated theme
am4core.useTheme(am4themes_animated);

/**
 * Configuration for each series in the chart.
 */
interface SeriesConfig {
  /**
   * The field name in the data object
   */
  field: GraphFilterEnum;
  /**
   * The name to be displayed in the legend/filter list
   */
  name: string;
  /**
   * The color of the series
   */
  color: string;
  /**
   * This one is weird as it is not one to one with values in GraphFilterEnum and MainChartData.
   * But it still has some functionality with styles
   */
  graph: Graph;
}

/**
 * Props for the MainChart component.
 */
interface MainChartProps {
  activityLogs?: Array<ActivityLogEntry>;
  workspaces?: WorkspaceDataType[];
}

/**
 * Creates the configuration for chart series based on the provided translation function.
 * @param t - Translation function
 * @returns Array of SeriesConfig objects
 */
const seriesConfig = (t: TFunction): SeriesConfig[] => [
  {
    field: GraphFilterEnum.SESSION_LOGGEDIN,
    name: t("labels.graph", { ns: "guider", context: "logins" }),
    color: "#2c2c2c",
    graph: Graph.SESSION_LOGGEDIN,
  },
  {
    field: GraphFilterEnum.MATERIAL_ASSIGNMENTDONE,
    name: t("labels.graph", {
      ns: "guider",
      context: "assignments",
    }),
    color: "#ce01bd",
    graph: Graph.MATERIAL_ASSIGNMENTDONE,
  },
  {
    field: GraphFilterEnum.MATERIAL_EXERCISEDONE,
    name: t("labels.graph", {
      ns: "guider",
      context: "exercises",
    }),
    color: "#ff9900",
    graph: Graph.MATERIAL_EXERCISEDONE,
  },
  {
    field: GraphFilterEnum.WORKSPACE_VISIT,
    name: t("labels.graph", {
      ns: "guider",
      context: "visits",
    }),
    color: "#43cd80",
    graph: Graph.WORKSPACE_VISIT,
  },
  {
    field: GraphFilterEnum.FORUM_NEWMESSAGE,
    name: t("labels.graph", {
      ns: "guider",
      context: "discussionMessages",
    }),
    color: "#62c3eb",
    graph: Graph.FORUM_NEWMESSAGE,
  },
  {
    field: GraphFilterEnum.EVALUATION_REQUESTED,
    name: t("labels.graph", {
      ns: "guider",
      context: "evaluationRequest",
    }),
    color: "#009fe3",
    graph: Graph.EVALUATION_REQUESTED,
  },
  {
    field: GraphFilterEnum.EVALUATION_INCOMPLETED,
    name: t("labels.graph", {
      ns: "guider",
      context: "incomplete",
    }),
    color: "#ea7503",
    graph: Graph.EVALUATION_INCOMPLETED,
  },
  {
    field: GraphFilterEnum.EVALUATION_PASSED,
    name: t("labels.graph", {
      ns: "guider",
      context: "passed",
    }),
    color: "#24c118",
    graph: Graph.EVALUATION_PASSED,
  },
  {
    field: GraphFilterEnum.EVALUATION_FAILED,
    name: t("labels.graph", {
      ns: "guider",
      context: "failed",
    }),
    color: "#de3211",
    graph: Graph.EVALUATION_FAILED,
  },
];

/**
 * MainChart component for displaying activity data in a chart format.
 * @param {MainChartProps} props - The component props
 * @returns {React.FC} A React functional component
 */
const MainChart: React.FC<MainChartProps> = ({ activityLogs, workspaces }) => {
  const chartRef = useRef<am4charts.XYChart | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<GraphFilterEnum[]>([
    GraphFilterEnum.SESSION_LOGGEDIN,
    GraphFilterEnum.MATERIAL_ASSIGNMENTDONE,
    GraphFilterEnum.MATERIAL_EXERCISEDONE,
    GraphFilterEnum.WORKSPACE_VISIT,
    GraphFilterEnum.FORUM_NEWMESSAGE,
    GraphFilterEnum.EVALUATION_REQUESTED,
    GraphFilterEnum.EVALUATION_PASSED,
    GraphFilterEnum.EVALUATION_FAILED,
    GraphFilterEnum.EVALUATION_INCOMPLETED,
  ]);

  const [visibleWorkspaceData, setVisibleWorkspaceData] = useState<number[]>(
    workspaces.map((workspace) => workspace.id)
  );
  const { t } = useTranslation(["common"]);
  const { lang } = localize;

  const memoizedSeriesConfig = React.useMemo(() => seriesConfig(t), [t]);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.responsive.enabled = true;

    // eslint-disable-next-line camelcase
    const locale = lang === "fi" ? am4lang_fi_FI : am4lang_en_US;
    chart.language.locale = locale;

    // Lets process the data first
    const chartData = processChartData(
      activityLogs,
      workspaces,
      workspaces.map((workspace) => workspace.id)
    );

    chart.data = chartData;

    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.tooltip.disabled = true;

    // Configure grid template for value (y) axis
    valueAxis.renderer.grid.template.stroke = am4core.color("#e0e0e0");
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.grid.template.location = 0;

    // Configure labels for value (y) axis
    valueAxis.renderer.labels.template.fill = am4core.color("#333333");
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.dx = -10;
    valueAxis.renderer.minGridDistance = 30;

    // Configure line for value (y) axis
    valueAxis.renderer.line.strokeOpacity = 1;

    // Conficure tick marks for value (y) axis
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.length = 8;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.8;
    valueAxis.renderer.ticks.template.stroke = am4core.color("#000000");

    // Configure grid template for date (x) axis
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.grid.template.stroke = am4core.color("#e0e0e0");
    dateAxis.renderer.grid.template.strokeWidth = 1;
    dateAxis.renderer.grid.template.strokeOpacity = 1;

    // Configure tick marks for date (x) axis
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.8;
    dateAxis.renderer.ticks.template.stroke = am4core.color("#000000");

    // Configure line for date (x) axis
    dateAxis.renderer.line.strokeOpacity = 1;

    // Configure labels for date (x) axis
    dateAxis.renderer.labels.template.paddingTop = 15;
    dateAxis.renderer.labels.template.fill = am4core.color("#333333");
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.minGridDistance = 60;

    // Set the date format for the axis tooltip
    dateAxis.tooltipDateFormat = {
      dateStyle: "short",
    };

    // Set zoom limits: minimum 2 weeks, maximum 1 year
    const minZoomDays = 14; // 2 weeks
    const maxZoomDays = 365; // 1 year

    dateAxis.min = new Date(chart.data[0].date).getTime();
    dateAxis.max = new Date(chart.data[chart.data.length - 1].date).getTime();

    dateAxis.minZoomCount = minZoomDays;
    dateAxis.maxZoomCount = maxZoomDays;

    // Ensure initial view shows entire date range
    dateAxis.keepSelection = false;
    dateAxis.start = 0;
    dateAxis.end = 1;

    // Move date axis to the bottom, directly under the chart
    dateAxis.parent = chart.bottomAxesContainer;

    // Create second date axis for full date range
    const fullRangeDateAxis = chart.xAxes.push(new am4charts.DateAxis());
    fullRangeDateAxis.parent = chart.bottomAxesContainer;
    fullRangeDateAxis.renderer.opposite = true;
    fullRangeDateAxis.syncWithAxis = dateAxis;
    fullRangeDateAxis.zoomable = false;

    // Configure full range date axis
    fullRangeDateAxis.renderer.labels.template.fontSize = 10;
    fullRangeDateAxis.renderer.minGridDistance = 50;
    fullRangeDateAxis.renderer.grid.template.disabled = true;
    fullRangeDateAxis.renderer.axisFills.template.disabled = true;
    fullRangeDateAxis.renderer.ticks.template.disabled = true;
    fullRangeDateAxis.renderer.inside = true;
    fullRangeDateAxis.renderer.labels.template.dy = 35;
    fullRangeDateAxis.opacity = 0.5;
    fullRangeDateAxis.keepSelection = true;
    fullRangeDateAxis.tooltip.disabled = true;

    // Set full range for the second axis
    fullRangeDateAxis.min = dateAxis.min;
    fullRangeDateAxis.max = dateAxis.max;

    // Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.opacity = 0.5; // Set opacity to allow see-through
    chart.scrollbarX.background.fill = am4core.color("#000000");
    chart.scrollbarX.background.fillOpacity = 0.1;
    chart.scrollbarX.minHeight = 50; // Adjust height as needed

    // Ensure the scrollbar is on top of the full range date axis
    chart.bottomAxesContainer.children.moveValue(fullRangeDateAxis);
    chart.bottomAxesContainer.children.moveValue(chart.scrollbarX);

    /**
     * Creates a series for the chart.
     * @param field - The field name in the data object
     * @param name - The name to be displayed in the legend/filter list
     * @param color - The color of the series
     * @returns The created series
     */
    const createSeries = (field: string, name: string, color: string) => {
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.name = name;
      series.strokeWidth = 2;
      series.stroke = am4core.color(color);

      // Customize tooltip
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 4;
      series.tooltip.background.fillOpacity = 0.8;
      series.tooltip.label.padding(12, 12, 12, 12);
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color("#ffffff");
      series.tooltip.background.stroke = am4core.color(color);
      series.tooltip.label.fill = am4core.color("#000000");

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#fff");

      return series;
    };

    // Use the seriesConfig to create series
    memoizedSeriesConfig.forEach(({ field, name, color }) => {
      createSeries(field, name, color);
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    // Enable pan behavior
    dateAxis.keepSelection = true;

    // After creating all series
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.behavior = "zoomX";
    chart.mouseWheelBehavior = "zoomX";

    // Ensure cursor is not snapping to any series
    chart.cursor.snapToSeries = undefined;

    // Disable snapping on the date axis
    dateAxis.snapTooltip = false;

    // Create a shared tooltip
    chart.tooltip = new am4core.Tooltip();
    chart.tooltip.pointerOrientation = "vertical";
    chart.tooltip.background.cornerRadius = 4;
    chart.tooltip.background.fillOpacity = 0.8;
    chart.tooltip.background.fill = am4core.color("#ffffff");
    chart.tooltip.background.stroke = am4core.color("#000000");
    chart.tooltip.label.padding(12, 12, 12, 12);
    chart.tooltip.getFillFromObject = false;

    // Customize shared tooltip content
    chart.tooltip.contentValign = "top";
    chart.tooltip.label.interactionsEnabled = true;
    chart.tooltip.keepTargetHover = true;

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [activityLogs, lang, memoizedSeriesConfig, t, workspaces]);

  /**
   * Handles toggling the visibility of a series in the chart.
   * @param {GraphFilterEnum} field - The field to toggle
   */
  const handleSeriesToggle = useCallback((field: GraphFilterEnum) => {
    const chart = chartRef.current;
    if (chart) {
      chart.series.each((series) => {
        if (series.dataFields.valueY === field) {
          series.hidden = !series.hidden;
          if (series.hidden) {
            series.hide();
          } else {
            series.show();
          }
        }
      });
    }
    setVisibleSeries((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }, []);

  /**
   * Handles changing the visibility of a workspace in the chart.
   * @param {number} visibleWorkspaceId - The ID of the workspace to toggle
   */
  const handleWorkspaceFilterChange = useCallback(
    (visibleWorkspaceId: number) => {
      setVisibleWorkspaceData((prev) =>
        prev.includes(visibleWorkspaceId)
          ? prev.filter((id) => id !== visibleWorkspaceId)
          : [...prev, visibleWorkspaceId]
      );

      const updatedVisibleWorkspaceData = [...visibleWorkspaceData];

      if (updatedVisibleWorkspaceData.includes(visibleWorkspaceId)) {
        updatedVisibleWorkspaceData.splice(
          updatedVisibleWorkspaceData.indexOf(visibleWorkspaceId),
          1
        );
      } else {
        updatedVisibleWorkspaceData.push(visibleWorkspaceId);
      }

      const chart = chartRef.current;
      if (chart) {
        chart.data = processChartData(
          activityLogs,
          workspaces,
          updatedVisibleWorkspaceData
        );
      }
    },
    [activityLogs, workspaces, visibleWorkspaceData]
  );

  /**
   * Toggles between showing all workspaces and hiding all workspaces.
   */
  const toggleAllWorkspaces = useCallback(() => {
    let workspaceIds: number[] = [];
    // All workspaces are visible
    if (visibleWorkspaceData.length === workspaces.length) {
      // Hide all workspaces
      workspaceIds = [];
      setVisibleWorkspaceData([]);
    } else {
      workspaceIds = workspaces.map((workspace) => workspace.id);
      // Show all workspaces
      setVisibleWorkspaceData(workspaces.map((workspace) => workspace.id));
    }

    // Update chart data
    const chart = chartRef.current;
    if (chart) {
      chart.data = processChartData(activityLogs, workspaces, workspaceIds);
    }
  }, [visibleWorkspaceData, workspaces, activityLogs]);

  const filterList = (
    <div className={"filter-items filter-items--graph-filter"}>
      {memoizedSeriesConfig.map(({ name, field, graph }) => {
        const ifChecked = visibleSeries.includes(field);
        return (
          <div
            className={"filter-item filter-item--" + graph}
            key={"l-" + graph}
          >
            <input
              id={`filter-` + graph}
              type="checkbox"
              onClick={() => {
                handleSeriesToggle(field);
              }}
              defaultChecked={ifChecked}
            />
            <label htmlFor={`filter-` + graph} className="filter-item__label">
              {name}
            </label>
          </div>
        );
      })}
    </div>
  );

  const dropdownFilters = (
    <Dropdown
      persistent
      modifier={"graph-filter"}
      items={memoizedSeriesConfig.map(({ field, graph, name }) => {
        const isChecked = visibleSeries.includes(field);
        return (
          <div
            className={"filter-item filter-item--" + graph}
            key={"w-" + graph}
          >
            <input
              id={`filter-` + graph}
              type="checkbox"
              onClick={() => handleSeriesToggle(field)}
              defaultChecked={isChecked}
            />
            <label htmlFor={`filter-` + graph} className="filter-item__label">
              {name}
            </label>
          </div>
        );
      })}
    >
      <span
        className={
          "icon-filter filter__activator filter__activator--graph-filter"
        }
      ></span>
    </Dropdown>
  );

  let workspaceFilterItems = workspaces.map((workspace) => {
    const modificator = workspace.activityLogs.length === 0 ? "-empty" : "";

    return (
      <div
        className={"filter-item filter-item--workspaces" + modificator}
        key={workspace.name}
      >
        <input
          id={`filterWorkspace` + workspace.id}
          type="checkbox"
          onClick={() => {
            handleWorkspaceFilterChange(workspace.id);
          }}
          checked={visibleWorkspaceData.includes(workspace.id)}
        />
        <label
          htmlFor={`filterWorkspace` + workspace.id}
          className="filter-item__label"
        >
          {workspace.name}
        </label>
      </div>
    );
  });

  workspaceFilterItems = [
    <div className="filter-category" key="activeWorkspaces">
      <span className="filter-category__label">
        {t("labels.workspaces", {
          ns: "workspace",
          context: "active",
        })}
      </span>
      <a
        className="filter-category__link"
        onClick={() => {
          toggleAllWorkspaces();
        }}
      >
        {visibleWorkspaceData.length !== workspaces.length
          ? t("actions.showAll")
          : t("actions.hideAll")}
      </a>
    </div>,
    ...workspaceFilterItems,
  ];

  return (
    <div className="application-sub-panel__body">
      <div className="chart-legend">
        <div className="filter filter--graph-filter">
          {dropdownFilters}
          {filterList}
        </div>

        <div className="filter filter--workspace-filter">
          <Dropdown
            persistent
            closeOnOutsideClick
            modifier="workspace-filter"
            items={workspaceFilterItems}
          >
            <span className="icon-books filter__activator filter__activator--workspace-filter"></span>
          </Dropdown>
        </div>
      </div>

      <div
        id="chartdiv"
        style={{
          width: "100%",
          height: "500px",
        }}
      />
    </div>
  );
};

export default MainChart;

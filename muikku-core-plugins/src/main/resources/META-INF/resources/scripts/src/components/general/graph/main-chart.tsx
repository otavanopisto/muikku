import React, { useLayoutEffect, useRef, useState, useCallback } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// eslint-disable-next-line camelcase
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MainChartData, MainChartFilter } from "./types";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { ActivityLogEntry } from "~/generated/client";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line camelcase
import am4lang_en_US from "@amcharts/amcharts4/lang/en_US";
// eslint-disable-next-line camelcase
import am4lang_fi_FI from "@amcharts/amcharts4/lang/fi_FI";
import { localize } from "~/locales/i18n";
import Dropdown from "../dropdown";
import { mainChartSeriesConfig, processChartData } from "./helper";
import "~/sass/elements/chart.scss";
import "~/sass/elements/filter.scss";

// Apply animated theme
am4core.useTheme(am4themes_animated);

/**
 * Props for the MainChart component.
 */
interface MainChartProps {
  activityLogs?: Array<ActivityLogEntry>;
  workspaces?: WorkspaceDataType[];
}

/**
 * MainChart component for displaying activity data in a chart format.
 * @param {MainChartProps} props - The component props
 * @returns {React.FC} A React functional component
 */
const MainChart: React.FC<MainChartProps> = ({ activityLogs, workspaces }) => {
  const chartRef = useRef<am4charts.XYChart | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<MainChartFilter[]>([
    "SESSION_LOGGEDIN",
    "MATERIAL_ASSIGNMENTDONE",
    "MATERIAL_EXERCISEDONE",
    "WORKSPACE_VISIT",
    "FORUM_NEWMESSAGE",
    "EVALUATION_REQUESTED",
    "EVALUATION_GOTPASSED",
    "EVALUATION_GOTFAILED",
    "EVALUATION_GOTINCOMPLETED",
  ]);

  const [visibleWorkspaceData, setVisibleWorkspaceData] = useState<number[]>(
    workspaces.map((workspace) => workspace.id)
  );
  const { t } = useTranslation(["common"]);
  const { lang } = localize;

  const memoizedSeriesConfig = React.useMemo(
    () => mainChartSeriesConfig(t),
    [t]
  );

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
      workspaces.map((workspace) => workspace.id),
      new Map<string, MainChartData>([
        [
          new Date().toISOString().slice(0, 10),
          {
            SESSION_LOGGEDIN: 0,
            WORKSPACE_VISIT: 0,
            MATERIAL_EXERCISEDONE: 0,
            MATERIAL_ASSIGNMENTDONE: 0,
            FORUM_NEWMESSAGE: 0,
          },
        ],
      ])
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
     * @param type - The type of series (line or column)
     * @returns The created series
     */
    const createSeries = (
      field: string,
      name: string,
      color: string,
      type = "line"
    ) => {
      let series;
      if (type === "column") {
        series = chart.series.push(new am4charts.ColumnSeries());
        series.columns.template.width = am4core.percent(70);
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      } else {
        series = chart.series.push(new am4charts.LineSeries());
        series.tooltipText = "{name}: [bold]{valueY}[/]";
      }

      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.name = name;
      series.stroke = am4core.color(color);
      series.fill = am4core.color(color);

      // Customize tooltip
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 4;
      series.tooltip.background.fillOpacity = 0.8;
      series.tooltip.label.padding(12, 12, 12, 12);
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color("#ffffff");
      series.tooltip.background.stroke = am4core.color(color);
      series.tooltip.label.fill = am4core.color("#000000");

      if (type === "line") {
        series.strokeWidth = 2;
        let bullet;

        switch (field) {
          case "SESSION_LOGGEDIN":
          case "WORKSPACE_VISIT":
            bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 4;
            break;
          case "EVALUATION_REQUESTED": {
            bullet = series.bullets.push(new am4charts.Bullet());
            const diamond = bullet.createChild(am4core.Rectangle);
            diamond.width = 8;
            diamond.height = 8;
            diamond.horizontalCenter = "middle";
            diamond.verticalCenter = "middle";
            diamond.rotation = 45;
            break;
          }
          case "EVALUATION_GOTINCOMPLETED": {
            bullet = series.bullets.push(new am4charts.Bullet());
            const square = bullet.createChild(am4core.Rectangle);
            square.width = 8;
            square.height = 8;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";
            break;
          }
          case "EVALUATION_GOTPASSED": {
            bullet = series.bullets.push(new am4charts.Bullet());
            const triangleUp = bullet.createChild(am4core.Triangle);
            triangleUp.width = 8;
            triangleUp.height = 8;
            triangleUp.horizontalCenter = "middle";
            triangleUp.verticalCenter = "middle";
            break;
          }
          case "EVALUATION_GOTFAILED": {
            bullet = series.bullets.push(new am4charts.Bullet());
            const triangleDown = bullet.createChild(am4core.Triangle);
            triangleDown.width = 8;
            triangleDown.height = 8;
            triangleDown.horizontalCenter = "middle";
            triangleDown.verticalCenter = "middle";
            triangleDown.rotation = 180;
            break;
          }
          default:
            // For other fields, we'll use a small circle as a subtle marker
            bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 2;
            break;
        }

        if (bullet) {
          bullet.strokeWidth = 2;
          bullet.stroke = am4core.color(color);
          bullet.fill = am4core.color("#fff");
        }
      }

      return series;
    };

    // Use the seriesConfig to create series
    memoizedSeriesConfig.forEach(({ field, name, color, type }) => {
      createSeries(field, name, color, type);
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
   * @param e - The change event
   */
  const handleSeriesFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Get the value from the event target. Expecting a string of the field name (A.K.A. MainChartFilter)
      const value = e.target.value as MainChartFilter;
      const chart = chartRef.current;

      // Update the series visibility
      if (chart) {
        chart.series.each((series) => {
          if (series.dataFields.valueY === value) {
            series.hidden = !series.hidden;
            if (series.hidden) {
              series.hide();
            } else {
              series.show();
            }
          }
        });
      }

      // Update the visible series state
      setVisibleSeries((prev) =>
        prev.includes(value)
          ? prev.filter((f) => f !== value)
          : [...prev, value]
      );
    },
    []
  );

  /**
   * Handles changing the visibility of a workspace in the chart.
   * @param e - The change event
   */
  const handleWorkspaceFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Get the value from the event target. Expecting a number
      const visibleWorkspaceId = parseInt(e.target.value);

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

      // Update chart data
      if (chart) {
        chart.data = processChartData(
          activityLogs,
          workspaces,
          updatedVisibleWorkspaceData,
          new Map<string, MainChartData>([
            [
              new Date().toISOString().slice(0, 10),
              {
                SESSION_LOGGEDIN: 0,
                WORKSPACE_VISIT: 0,
                MATERIAL_EXERCISEDONE: 0,
                MATERIAL_ASSIGNMENTDONE: 0,
                FORUM_NEWMESSAGE: 0,
              },
            ],
          ])
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
      chart.data = processChartData(
        activityLogs,
        workspaces,
        workspaceIds,
        new Map<string, MainChartData>([
          [
            new Date().toISOString().slice(0, 10),
            {
              SESSION_LOGGEDIN: 0,
              WORKSPACE_VISIT: 0,
              MATERIAL_EXERCISEDONE: 0,
              MATERIAL_ASSIGNMENTDONE: 0,
              FORUM_NEWMESSAGE: 0,
            },
          ],
        ])
      );
    }
  }, [visibleWorkspaceData, workspaces, activityLogs]);

  const filterList = (
    <div className={"filter-items filter-items--graph-filter"}>
      {memoizedSeriesConfig.map(({ name, field, modifier }) => (
        <div
          className={"filter-item filter-item--" + modifier}
          key={"l-" + field}
        >
          <input
            id={`filter-` + field}
            type="checkbox"
            value={field}
            onChange={handleSeriesFilterChange}
            checked={visibleSeries.includes(field)}
          />
          <label htmlFor={`filter-` + field} className="filter-item__label">
            {name}
          </label>
        </div>
      ))}
    </div>
  );

  const dropdownFilters = (
    <Dropdown
      persistent
      modifier={"graph-filter"}
      items={memoizedSeriesConfig.map(({ field, modifier, name }) => (
        <div
          className={"filter-item filter-item--" + modifier}
          key={"w-" + field}
        >
          <input
            id={`filter-` + field}
            type="checkbox"
            value={field}
            onChange={handleSeriesFilterChange}
            checked={visibleSeries.includes(field)}
          />
          <label htmlFor={`filter-` + field} className="filter-item__label">
            {name}
          </label>
        </div>
      ))}
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
          value={workspace.id}
          type="checkbox"
          onChange={handleWorkspaceFilterChange}
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

      <div id="chartdiv" className="chart chart--main-chart" />
    </div>
  );
};

export default MainChart;

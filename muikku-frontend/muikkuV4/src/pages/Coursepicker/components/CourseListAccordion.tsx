import { Accordion } from "@mantine/core";
import type { CourseListItem } from "../types";
import { CatalogCoursePanel } from "./CatalogCoursePanel";
import { CourseRowControl } from "./CourseRowControl";
import { MyCoursePanel } from "./MyCoursePanel";

/** Props for the CourseListAccordion component */
interface CourseListAccordionProps {
  items: CourseListItem[];
  defaultExpandedId?: string;
  /** e.g. next-page Loader */
  footer?: React.ReactNode;
}

/**
 * CourseListAccordion component
 * @param props - Props for the CourseListAccordion component
 */
export function CourseListAccordion(props: CourseListAccordionProps) {
  const { items, defaultExpandedId, footer } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Accordion
        variant="separated"
        multiple
        defaultValue={defaultExpandedId ? [defaultExpandedId] : []}
        chevronPosition="right"
      >
        {items.map((course) => (
          <Accordion.Item key={course.id} value={String(course.id)}>
            <Accordion.Control>
              <CourseRowControl course={course} />
            </Accordion.Control>
            <Accordion.Panel>
              {course.panelVariant === "catalog" ? (
                <CatalogCoursePanel course={course} />
              ) : (
                <MyCoursePanel course={course} />
              )}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      {footer}
    </>
  );
}

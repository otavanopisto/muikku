/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TableProps
 */
interface TableProps {
  element: HTMLElement;
  props: any;
  children: any;
}

/**
 * WordDefinition
 * @param props props
 * @returns WordDefinition
 */
export default function Table(_props: TableProps) {
  return <div>Table</div>;
}

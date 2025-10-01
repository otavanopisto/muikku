import * as React from "react";
import { Svg, G, Path } from "@react-pdf/renderer";

/**
 * Props for the PdfFiveStars component.
 */
interface PdfFiveStarsProps {
  value: number;
}

/**
 * Renders an SVG component that displays 5 stars with fill colors based on the provided rating value.
 * @param props - component props
 * @returns a react-pdf SVG component that renders 5 stars with fill colors based on the rating value
 */
const PdfFiveStars = (props: PdfFiveStarsProps) => {
  const { value } = props;
  const color = "#ab1566";
  /**
   * Generates an array of fill colors for the 5 stars based on the rating value.
   * @returns Array<string> array of fill colors for 5 stars
   */
  const fill = () => {
    const fillArray = [];
    for (let i = 0; i < 5; i++) {
      if (i + 1 <= value && value > 0) {
        fillArray.push(color);
      } else {
        fillArray.push("none");
      }
    }
    return fillArray;
  };

  return (
    <Svg style={{ width: 85, height: 15 }}>
      <G transform="translate(-53.488939,-45.64269)">
        <Path
          d="m 65.484375,59.928125 -4.466931,-2.301909 -4.428629,2.374763 0.808889,-4.959632 -3.627055,-3.478035 4.966851,-0.763311 2.186985,-4.524307 2.260794,4.48788 4.978687,0.681859 -3.569604,3.536974 z"
          fill={fill()[0]}
          stroke={color}
          strokeWidth={0.264583}
          strokeOpacity={1}
          transform="matrix(0.99955557,0,0,1.0236523,0.02709543,-1.4215512)"
        />
      </G>
      <G transform="translate(-37.739433,-45.64269)">
        <Path
          d="m 65.484375,59.928125 -4.466931,-2.301909 -4.428629,2.374763 0.808889,-4.959632 -3.627055,-3.478035 4.966851,-0.763311 2.186985,-4.524307 2.260794,4.48788 4.978687,0.681859 -3.569604,3.536974 z"
          fill={fill()[1]}
          stroke={color}
          strokeWidth={0.264583}
          strokeOpacity={1}
          transform="matrix(0.99955557,0,0,1.0236523,0.02709543,-1.4215512)"
        />
      </G>
      <G transform="translate(-21.989926,-45.64269)">
        <Path
          d="m 65.484375,59.928125 -4.466931,-2.301909 -4.428629,2.374763 0.808889,-4.959632 -3.627055,-3.478035 4.966851,-0.763311 2.186985,-4.524307 2.260794,4.48788 4.978687,0.681859 -3.569604,3.536974 z"
          fill={fill()[2]}
          stroke={color}
          strokeWidth={0.264583}
          strokeOpacity={1}
          transform="matrix(0.99955557,0,0,1.0236523,0.02709543,-1.4215512)"
        />
      </G>
      <G transform="translate(-6.2404191,-45.64269)">
        <Path
          d="m 65.484375,59.928125 -4.466931,-2.301909 -4.428629,2.374763 0.808889,-4.959632 -3.627055,-3.478035 4.966851,-0.763311 2.186985,-4.524307 2.260794,4.48788 4.978687,0.681859 -3.569604,3.536974 z"
          fill={fill()[3]}
          stroke={color}
          strokeWidth={0.264583}
          strokeOpacity={1}
          transform="matrix(0.99955557,0,0,1.0236523,0.02709543,-1.4215512)"
        />
      </G>
      <G transform="translate(9.5090871,-45.64269)">
        <Path
          d="m 65.484375,59.928125 -4.466931,-2.301909 -4.428629,2.374763 0.808889,-4.959632 -3.627055,-3.478035 4.966851,-0.763311 2.186985,-4.524307 2.260794,4.48788 4.978687,0.681859 -3.569604,3.536974 z"
          fill={fill()[4]}
          stroke={color}
          strokeWidth={0.264583}
          strokeOpacity={1}
          transform="matrix(0.99955557,0,0,1.0236523,0.02709543,-1.4215512)"
        />
      </G>
    </Svg>
  );
};

export default PdfFiveStars;

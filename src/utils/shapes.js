import { arc, pie } from "d3-shape";

/** make our pie svg and arc generators */
export default function makePie(
  data,
  innerRadius,
  outerRadius,
  cornerRadius,
  padAngle
) {
  
  const val = data.map(d => d.value);
  const total = val.reduce((total, curr) => curr + total, 0);
  const arcs = pie()(val);

  const arcGenerator = arc()
    .innerRadius(2) // 2
    .outerRadius(200) // 100
    .cornerRadius(0) // 0
    .padAngle(0.01); // 0.05
  const pieSvgDataUri = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(0.01)">
      ${arcs.map((arcData, i) => {
        return `<path d="${arcGenerator(arcData)}" />`;
      })}
      </g>
    </svg>
  `)}`;
  return { pieSvgDataUri, arcs, arcGenerator };
}


export const DEFAULT_EXTRUDE_SETTINGS = {
    curveSegments: 256,
    steps: 2,
    depth: 1, // should be 1 for our scaling to wokr
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0.0,
    bevelSegments: 1,
  }
  
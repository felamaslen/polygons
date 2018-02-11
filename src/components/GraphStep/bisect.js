import React from 'react';
import PropTypes from 'prop-types';
import { genTestArc } from './testArc';
import GraphStepLine from './line';

export default function GraphStepBisect({ current, stepIndex, pointA, pointB, pointC, lineProps }) {
    const lines = [
        <GraphStepLine key="line1" from={pointB} to={pointA} lineProps={lineProps} />,
        <GraphStepLine key="line2" from={pointB} to={pointC} lineProps={lineProps} />
    ];

    const testLength = (
        Math.sqrt((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2) +
        Math.sqrt((pointC[0] - pointB[0]) ** 2 + (pointC[1] - pointB[1]) ** 2)
    ) / 3;

    const angleA = Math.atan2(pointA[1] - pointB[1], pointA[0] - pointB[0]);
    const angleC = Math.atan2(pointC[1] - pointB[1], pointC[0] - pointB[0]);

    const testPointA = [
        pointB[0] + testLength * Math.cos(angleA),
        pointB[1] + testLength * Math.sin(angleA)
    ];

    const testPointC = [
        pointB[0] + testLength * Math.cos(angleC),
        pointB[1] + testLength * Math.sin(angleC)
    ];

    const arcs = [
        genTestArc(...pointB, testLength, angleA, 0.2),
        genTestArc(...pointB, testLength, angleC, 0.2),
        genTestArc(...testPointA, testLength, angleC),
        genTestArc(...testPointC, testLength, angleA)
    ]
        .map((arc, key) => <path key={key} d={arc} {...lineProps} />);

    const bisectAngle = (angleA + angleC) / 2;

    const bisectLineLength = testLength * Math.sqrt(
        2 * (1 + Math.cos(angleA - angleC))
    );

    const bisectLineEnd = [
        pointB[0] + bisectLineLength * Math.cos(bisectAngle),
        pointB[1] + bisectLineLength * Math.sin(bisectAngle)
    ];

    const bisectLine = (
        <GraphStepLine key="linebisect" from={pointB} to={bisectLineEnd} lineProps={lineProps} />
    );

    const paths = [...lines, ...arcs, bisectLine];

    const pathsVisible = current
        ? paths.slice(0, stepIndex)
        : paths;

    return (
        <g>
            {pathsVisible}
        </g>
    );
}

GraphStepBisect.propTypes = {
    current: PropTypes.bool.isRequired,
    stepIndex: PropTypes.number.isRequired,
    pointA: PropTypes.array.isRequired,
    pointB: PropTypes.array.isRequired,
    pointC: PropTypes.array.isRequired,
    lineProps: PropTypes.object.isRequired
};


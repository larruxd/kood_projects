export function createSkillChart(data) {
    const svg = document.getElementById("spider-graph");
    svg.setAttribute("width", "600");
    svg.setAttribute("height", "600");

    const centerX = 300; // X-coordinate of the center
    const centerY = 300; // Y-coordinate of the center
    const radius = 200;

    const maxValue = Math.max(...data.map((point) => point.value));
    // Reference to the SVG container

    // GENERATE GRAPH
    // Graph lines
    data.forEach((entry, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const angle2 = (Math.PI * 2 * (index + 1)) / data.length;

        // outgoing lines
        const angleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        angleLine.setAttribute("x1", centerX.toString());
        angleLine.setAttribute("y1", centerY.toString());
        angleLine.setAttribute("x2", (centerX + radius * Math.cos(angle)).toString());
        angleLine.setAttribute("y2", (centerY + radius * Math.sin(angle)).toString());
        angleLine.setAttribute("stroke", "gray");

        svg.appendChild(angleLine);

        for (let i = 0; i < 5; i++) {
            let radiusStep = radius / 5;
            let lineRadius = radiusStep * (i + 1);
            const connectingLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            connectingLine.setAttribute("x1", (centerX + lineRadius * Math.cos(angle)).toString());
            connectingLine.setAttribute("y1", (centerY + lineRadius * Math.sin(angle)).toString());
            connectingLine.setAttribute("x2", (centerX + lineRadius * Math.cos(angle2)).toString());
            connectingLine.setAttribute("y2", (centerY + lineRadius * Math.sin(angle2)).toString());
            connectingLine.setAttribute("stroke", "gray");
            if (!(i == 4)) {
                connectingLine.setAttribute("stroke-dasharray", "4");
            }
            svg.appendChild(connectingLine);
        }
    });

    // Create radial axis labels
    data.forEach((point, index) => {
        const angle = (Math.PI * 2 * index) / data.length;

        const x = centerX + (radius + 25) * Math.cos(angle); // <-- "+ 25" to have the text a bit further away from graph
        const y = centerY + (radius + 25) * Math.sin(angle);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x.toString());
        label.setAttribute("y", y.toString());
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dy", "0.5em"); // Offset for better positioning
        label.textContent = point.label.split("_")[1];
        label.id = "data-label";
        svg.appendChild(label);
    });

    // Create the polygon path
    const dataPoints = data.map((point, index) => {
        const normalizedValue = point.value / maxValue;
        const { x, y } = valueToCoordinates(normalizedValue, data.length, index);
        return `${x},${y}`;
    });

    // create lines and datapoints
    data.forEach((point, index) => {
        const normalizedValue = point.value / maxValue;
        const { x, y } = valueToCoordinates(normalizedValue, data.length, index);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX.toString());
        line.setAttribute("y1", centerY.toString());
        line.setAttribute("x2", x.toString());
        line.setAttribute("y2", y.toString());
        line.setAttribute("stroke", "blue");
        svg.appendChild(line);

        const dataPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dataPoint.setAttribute("cx", x.toString());
        dataPoint.setAttribute("cy", y.toString());
        dataPoint.setAttribute("r", "2");
        dataPoint.setAttribute("fill", "blue");
        svg.appendChild(dataPoint);
    });

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", dataPoints.join(" "));
    polygon.setAttribute("stroke", "blue");
    polygon.setAttribute("fill", "lightblue");
    polygon.setAttribute("fill-opacity", "0.4");
    polygon.addEventListener("mouseenter", showValueLabels);
    polygon.addEventListener("mouseleave", hideValueLabels);
    polygon.id = "polygon";

    svg.appendChild(polygon);

    // create datapoint values
    dataPoints.forEach((dataPoint, index) => {
        const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const x = dataPoint.split(",")[0];
        const y = dataPoint.split(",")[1];
        valueLabel.setAttribute("x", x);
        valueLabel.setAttribute("y", y);
        valueLabel.setAttribute("text-anchor", "middle");
        valueLabel.setAttribute("dy", "0.5em"); // Offset for better positioning
        valueLabel.id = "spider-value-label";
        valueLabel.textContent = data[index].value;
        valueLabel.style.visibility = "hidden";
        valueLabel.addEventListener("mouseenter", showValueLabels);
        valueLabel.addEventListener("mouseleave", hideValueLabels);
        svg.appendChild(valueLabel);
    });

    // Function to convert data values to coordinates
    function valueToCoordinates(value, totalValues, index) {
        const angle = (Math.PI * 2 * index) / totalValues;
        const x = centerX + radius * Math.cos(angle) * value; // Normalize value to a range between 0 and 1
        const y = centerY + radius * Math.sin(angle) * value;
        return { x, y };
    }

    function showValueLabels() {
        const valueLabels = document.querySelectorAll("#spider-value-label");
        if ((valueLabels[0].style.visibility = "hidden")) {
            valueLabels.forEach((label) => {
                label.style.visibility = "visible";
            });
        }

        const polygon = document.querySelector("#polygon");
        polygon.setAttribute("fill-opacity", "0.8");
    }

    function hideValueLabels() {
        const valueLabels = document.querySelectorAll("#spider-value-label");
        if ((valueLabels[0].style.visibility = "visible")) {
            valueLabels.forEach((label) => {
                label.style.visibility = "hidden";
            });
        }

        const polygon = document.querySelector("#polygon");
        polygon.setAttribute("fill-opacity", "0.4");
    }
}

export function createXpChart(data) {
    const svgWidth = 600;
    const svgHeight = 500;

    const chartWidth = svgWidth * 0.9;
    const chartHeight = svgHeight * 0.9;

    const svg = document.getElementById("xp-chart");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    // already sorted by graphQL query but sort again just in case
    data.sort((a, b) => parseCreatedAt(a.createdAt) - parseCreatedAt(b.createdAt));

    // format data
    const totalXPData = calculateTotalXP(data);
    const dataPoints = mapDataToCoordinates(totalXPData, chartWidth, chartHeight);

    // create the border for the graph
    const borderRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    borderRect.setAttribute("x", 0);
    borderRect.setAttribute("y", 0);
    borderRect.setAttribute("width", chartWidth);
    borderRect.setAttribute("height", chartHeight);
    borderRect.setAttribute("stroke", "none");
    borderRect.setAttribute("stroke-width", "1");
    borderRect.setAttribute("fill", "none");
    svg.appendChild(borderRect);

    // create graph trend line
    const xpPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathData = `M${dataPoints.map((point) => `${point.x},${point.y}`).join(" L")}`;
    xpPath.setAttribute("d", pathData);
    xpPath.setAttribute("fill", "none");
    xpPath.setAttribute("stroke", "white");
    xpPath.setAttribute("stroke-width", "2");
    svg.appendChild(xpPath);

    // "total:" in top right of graph
    const totalText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    totalText.setAttribute("x", chartWidth);
    totalText.setAttribute("y", 10);
    totalText.setAttribute("text-anchor", "middle");
    totalText.setAttribute("dx", "1.5em"); // Offset for better positioning
    totalText.id = "xp-value-label";
    totalText.textContent = "Total:";
    svg.appendChild(totalText);

    // create lines for date and xp gained info
    for (let i = 0; i < dataPoints.length; i++) {
        //
        let point = dataPoints[i];

        if (point.hasOwnProperty("totalXP")) {
            let nextPoint = dataPoints[i + 2];
            let rectHeight = 0;

            // create horizontal data lines
            const horizontalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            horizontalLine.setAttribute("x1", 0);
            horizontalLine.setAttribute("y1", point.y);
            horizontalLine.setAttribute("x2", chartWidth);
            horizontalLine.setAttribute("y2", point.y);
            horizontalLine.setAttribute("stroke", "red");
            horizontalLine.setAttribute("stroke-dasharray", "4");
            horizontalLine.setAttribute("stroke-width", "2");
            horizontalLine.style.opacity = "0";
            svg.appendChild(horizontalLine);

            // create vertical data lines
            const verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            verticalLine.setAttribute("x1", point.x);
            verticalLine.setAttribute("y1", 0);
            verticalLine.setAttribute("x2", point.x);
            verticalLine.setAttribute("y2", chartHeight);
            verticalLine.setAttribute("stroke", "red");
            verticalLine.setAttribute("stroke-dasharray", "4");
            verticalLine.setAttribute("stroke-width", "2");
            verticalLine.style.opacity = "0";
            svg.appendChild(verticalLine);

            // data xp total labels
            const dataXpTotalLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dataXpTotalLabel.setAttribute("x", chartWidth);
            dataXpTotalLabel.setAttribute("y", point.y);
            dataXpTotalLabel.setAttribute("text-anchor", "middle");
            dataXpTotalLabel.setAttribute("dx", "2em"); // Offset for better positioning
            dataXpTotalLabel.id = "xp-value-label";
            dataXpTotalLabel.textContent = formatXp(point.totalXP);
            dataXpTotalLabel.style.visibility = "hidden";
            svg.appendChild(dataXpTotalLabel);

            // data xp gained labels
            const dataXpGainLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dataXpGainLabel.setAttribute("x", point.x);
            dataXpGainLabel.setAttribute("y", point.y);
            dataXpGainLabel.setAttribute("text-anchor", "start");
            dataXpGainLabel.setAttribute("dx", "0.5em"); // Offset for better positioning
            dataXpGainLabel.setAttribute("dy", "1.5em");
            dataXpGainLabel.id = "xp-value-label";
            dataXpGainLabel.textContent = "+" + formatXp(point.amount);
            dataXpGainLabel.style.visibility = "hidden";
            svg.appendChild(dataXpGainLabel);

            // data xp gained labels
            const dataSubjectLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dataSubjectLabel.setAttribute("x", point.x);
            dataSubjectLabel.setAttribute("y", point.y);
            dataSubjectLabel.setAttribute("text-anchor", "start");
            dataSubjectLabel.setAttribute("dx", "0.5em"); // Offset for better positioning
            dataSubjectLabel.setAttribute("dy", "-1em");
            dataSubjectLabel.id = "xp-value-label";
            dataSubjectLabel.textContent = point.name;
            dataSubjectLabel.style.visibility = "hidden";
            svg.appendChild(dataSubjectLabel);

            // data date labels
            const dataDateLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dataDateLabel.setAttribute("x", point.x);
            dataDateLabel.setAttribute("y", chartHeight);
            dataDateLabel.setAttribute("text-anchor", "middle");
            dataDateLabel.setAttribute("dy", "2.5em"); // Offset for better positioning
            dataDateLabel.setAttribute("dx", "3em");
            dataDateLabel.id = "xp-value-label";
            dataDateLabel.textContent = formatDate(point.createdAt);
            dataDateLabel.style.visibility = "hidden";
            svg.appendChild(dataDateLabel);

            let y;
            if (i == dataPoints.length - 2) {
                // last real datapoint
                y = 0;
                rectHeight = chartHeight * 0.1;
            } else {
                y = nextPoint.y;
                rectHeight = point.y - nextPoint.y;
            }

            // create invisible rectangles to show data lines on mouseover
            const lineArea = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            lineArea.setAttribute("x", 0);
            lineArea.setAttribute("y", y);
            lineArea.setAttribute("width", chartWidth);
            lineArea.setAttribute("height", rectHeight);
            lineArea.setAttribute("fill", "blue");
            lineArea.style.opacity = "0";
            svg.appendChild(lineArea);

            lineArea.addEventListener("mouseenter", () => {
                horizontalLine.style.opacity = "0.5";
                verticalLine.style.opacity = "0.5";
                dataXpTotalLabel.style.visibility = "visible";
                dataXpGainLabel.style.visibility = "visible";
                dataSubjectLabel.style.visibility = "visible";
                dataDateLabel.style.visibility = "visible";
            });

            lineArea.addEventListener("mouseleave", () => {
                horizontalLine.style.opacity = "0";
                verticalLine.style.opacity = "0";
                dataXpGainLabel.style.visibility = "hidden";
                dataXpTotalLabel.style.visibility = "hidden";
                dataSubjectLabel.style.visibility = "hidden";
                dataDateLabel.style.visibility = "hidden";
            });
        }
    }
}

// add previous entries amount to new entry to get continous upwards graph
function calculateTotalXP(data) {
    let totalXP = 0;

    return data.map((item) => {
        totalXP += item.amount;
        return {
            name: item.object.name,
            createdAt: item.createdAt,
            totalXP: totalXP,
            amount: item.amount,
        };
    });
}

function mapDataToCoordinates(data, chartWidth, chartHeight) {
    const firstDate = parseCreatedAt(data[0].createdAt);
    const lastDate = Date.now();
    const dateRange = lastDate - firstDate;
    const xScale = chartWidth / dateRange;
    const maxY = Math.max(...data.map((item) => item.totalXP));
    const yScale = (chartHeight * 0.9) / maxY; // *0.9 so graph line ends before

    let newData = [];
    let obj = {};
    let obj2 = {};

    for (let i = 0; i < data.length; i++) {
        obj = {
            name: data[i].name,
            amount: data[i].amount,
            totalXP: data[i].totalXP,
            createdAt: data[i].createdAt,
            x: (parseCreatedAt(data[i].createdAt) - firstDate) * xScale,
            y: chartHeight - data[i].totalXP * yScale,
        };
        newData.push(obj);

        if (i == data.length - 1) {
            obj2 = {
                x: (Date.now() - firstDate) * xScale,
                y: chartHeight - data[i].totalXP * yScale,
            };
        } else {
            obj2 = {
                x: (parseCreatedAt(data[i + 1].createdAt) - firstDate) * xScale,
                y: chartHeight - data[i].totalXP * yScale,
            };
        }

        newData.push(obj2);
    }

    return newData;
}

function formatXp(amount) {
    let xp;

    if (amount < 1000) {
        xp = amount + "B";
    } else if (amount < 1000 * 1000) {
        xp = (amount / 1000).toFixed(0) + "KB";
    } else if (amount < 1000 * 1000 * 1000) {
        xp = (amount / (1000 * 1000)).toFixed(1) + "MB";
    } else {
        xp = (amount / (1000 * 1000 * 1000)).toFixed(1) + "GB";
    }
    return xp;
}

function formatDate(date) {
    var originalDate = parseCreatedAt(date);
    var day = originalDate.getDate();
    var month = originalDate.toLocaleString("en-US", { month: "short" });
    var year = originalDate.getFullYear();

    // Ensure day and month have leading zeros if needed
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return day + "-" + month + "-" + year;
}

function parseCreatedAt(dateString) {
    return new Date(dateString);
}

"use strict";

// global variables
let data = "no data";
let startYear;
let endYear;
let red = "#eb4034";
let green = "#44ad4c";
let darkBlue = "#173b75";
let mediumBlue = "#158cbf";
let lightBlue = "#80cbe0";

async function getData() {
    let response = await axios
        .get("https://run.mocky.io/v3/a2cc3707-8691-4188-8413-6183a7bb3d32")
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

function setGeneralData(data) {
    //set occupation
    let occupationSpans = document.querySelectorAll(".occupation");
    let occupationTitle = data.occupation.title;
    for (let span of occupationSpans) {
        span.innerText = occupationTitle;
    }

    //set region
    let location = document.querySelector("#location");
    let regionTitle = data.region.title;
    location.innerText = regionTitle;
}

function setSummaryJobs(data) {
    //set Summary > Regional Jobs
    let summaryNumJobs = document.querySelector("#summaryNumJobs");
    let numRegionalJobs = parseInt(data.summary.jobs.regional);
    let strNumRegionalJobs = numRegionalJobs.toLocaleString("en");
    summaryNumJobs.innerText = strNumRegionalJobs;

    //set Summary > Year
    let summaryJobsYear = document.querySelector("#summaryYear");
    let currentYear = data.summary.jobs.year;
    summaryJobsYear.innerText = currentYear;

    //set Summary > National Avg Comparison
    let summaryPercent = document.querySelector("#summaryPercent");
    let numNationalAvgJobs = parseInt(data.summary.jobs.national_avg);
    let percentVsNation;
    let summaryAboveBelow = document.querySelector("#summaryAboveBelow");

    if (numRegionalJobs > numNationalAvgJobs) {
        percentVsNation = Math.round(
            (numRegionalJobs / numNationalAvgJobs) * 100
        );
        summaryAboveBelow.innerText = "above";
        summaryAboveBelow.style.color = green;
    } else {
        percentVsNation = Math.round(
            (numNationalAvgJobs / numRegionalJobs) * 100
        );
        summaryAboveBelow.innerText = "below";
        summaryAboveBelow.style.color = red;
    }
    summaryPercent.innerText = percentVsNation.toString();
}

function setSummaryJobsGrowth(data) {
    let jobsGrowthData = data.summary.jobs_growth;

    // set Summary > JobsGrowth > Regional
    let percentChangeWrapper = document.querySelectorAll(".summaryLvl1")[1];
    let localPlusMinus = document.querySelector("#localPlusMinus");
    let summaryChangePercent = document.querySelector("#summaryChangePercent");
    let regionalChangePercent = parseFloat(jobsGrowthData.regional);
    if (regionalChangePercent > 0) {
        localPlusMinus.innerText = "+";
        percentChangeWrapper.style.color = green;
    } else {
        localPlusMinus.innerText = "-";
        percentChangeWrapper.style.color = red;
    }
    summaryChangePercent.innerText = Math.abs(regionalChangePercent).toString();

    // set Summary > JobsGrowth > Start & End
    let summaryStart = document.querySelector("#summaryStart");
    let summaryEnd = document.querySelector("#summaryEnd");
    startYear = jobsGrowthData.start_year;
    endYear = jobsGrowthData.end_year;
    summaryStart.innerText = startYear;
    summaryEnd.innerText = endYear;

    // set Summary > JobsGrowth > National Avg
    let nationalTrendWrapper = document.querySelector("#nationalTrendWrapper");
    let nationPlusMinus = document.querySelector("#nationPlusMinus");
    let nationPercentChange = document.querySelector("#nationPercentChange");
    let nationalAvg = parseFloat(jobsGrowthData.national_avg);
    if (nationalAvg > 0) {
        nationPlusMinus.innerText = "+";
        nationalTrendWrapper.style.color = green;
    } else {
        nationPlusMinus.innerText = "-";
        nationalTrendWrapper.style.color = red;
    }
    nationPercentChange.innerText = Math.abs(nationalAvg);
}

function getSummaryEarnings() {
    let earningsData = data.summary.earnings;

    //set Summary > Earnings > Regional
    let summaryRegionalEarnings = document.querySelector(
        "#summaryRegionalEarnings"
    );
    let summaryNationalEarnings = document.querySelector(
        "#summaryNationalEarnings"
    );
    let regionalEarnings = earningsData.regional;
    let nationalEarnings = earningsData.national_avg;
    summaryRegionalEarnings.innerText = regionalEarnings;
    summaryNationalEarnings.innerText = nationalEarnings;
}

function populateTrendsTable(data) {
    let trendData = data.trend_comparison;

    // get all DOM elements
    let startYearLabel = document.querySelector("#graphStartYear");
    let endYearLabel = document.querySelector("#graphEndYear");
    let regionStartJobsLabel = document.querySelector("#regionStartJobs");
    let regionEndJobsLabel = document.querySelector("#regionEndJobs");
    let regionChangeNumLabel = document.querySelector("#regionChangeNum");
    let regionPercentChangeLabel = document.querySelector(
        "#regionPercentChange"
    );
    let stateStartJobsLabel = document.querySelector("#stateStartJobs");
    let stateEndJobsLabel = document.querySelector("#stateEndJobs");
    let stateChangeNumLabel = document.querySelector("#stateChangeNum");
    let statePercentChangeLabel = document.querySelector("#statePercentChange");
    let nationStartJobsLabel = document.querySelector("#nationStartJobs");
    let nationEndJobsLabel = document.querySelector("#nationEndJobs");
    let nationChangeNumLabel = document.querySelector("#nationChangeNum");
    let nationPercentChangeLabel = document.querySelector(
        "#nationalPercentChange"
    );
    let trendShapes = document.querySelectorAll(".trendShape");

    // Write start and end years to page
    startYearLabel.innerText = startYear;
    endYearLabel.innerText = endYear;

    // Write data for Region row
    let regionStartJobs = parseInt(trendData.regional[0]);
    let regionEndJobs = parseInt(
        trendData.regional[trendData.regional.length - 1]
    );
    regionStartJobsLabel.innerText = regionStartJobs.toLocaleString("en");
    regionEndJobsLabel.innerText = regionEndJobs.toLocaleString("en");
    regionChangeNumLabel.innerText = (
        regionEndJobs - regionStartJobs
    ).toLocaleString("en");
    regionPercentChangeLabel.innerText = (
        ((regionEndJobs - regionStartJobs) / regionStartJobs) *
        100
    ).toFixed(1);

    // write data for State row
    let stateStartJobs = parseInt(trendData.state[0]);
    let stateEndJobs = parseInt(trendData.state[trendData.state.length - 1]);
    stateStartJobsLabel.innerText = stateStartJobs.toLocaleString("en");
    stateEndJobsLabel.innerText = stateEndJobs.toLocaleString("en");
    stateChangeNumLabel.innerText = (
        stateEndJobs - stateStartJobs
    ).toLocaleString("en");
    statePercentChangeLabel.innerText = (
        ((stateEndJobs - stateStartJobs) / stateStartJobs) *
        100
    ).toFixed(1);

    // write data for Nation row
    let nationStartJobs = parseInt(trendData.nation[0]);
    let nationEndJobs = parseInt(trendData.nation[trendData.nation.length - 1]);
    nationStartJobsLabel.innerText = nationStartJobs.toLocaleString("en");
    nationEndJobsLabel.innerText = nationEndJobs.toLocaleString("en");
    nationChangeNumLabel.innerText = (
        nationEndJobs - nationStartJobs
    ).toLocaleString("en");
    let nationPercentChange = (
        ((nationEndJobs - nationStartJobs) / nationStartJobs) *
        100
    ).toFixed(1);
    nationPercentChangeLabel.innerText = nationPercentChange;

    trendShapes[0].style.backgroundColor = darkBlue;
    trendShapes[1].style.backgroundColor = mediumBlue;
}

function populateIndustryTable(data) {
    const industryData = data.employing_industries;
    const table = document.querySelector("#industryTableBody");
    const yearLabels = document.querySelectorAll(".IndustryCurrentYear");

    // write current year to table labels
    for (let label of yearLabels) {
        label.innerText = industryData.year;
    }

    // helper function to add a new table row
    function addTableRow(
        title,
        inOccupationJobs,
        percentageJobsInIndustry,
        percentageTotalJobs
    ) {
        // creates new, empty table row
        let rowCount = table.rows.length;
        let newRow = table.insertRow(rowCount);

        // adds first cell ("Industry" column)
        let industryCell = newRow.insertCell(0);
        industryCell.innerHTML = `<div><object data="buildingIcon.svg"
        class="buildingIcon" type="image/svg+xml"></object><span class="industryTitle">${title}</span></div><div class="industryDiv" style="width: ${percentageJobsInIndustry}%; overflow="visible"></div>`;

        // adds second cell ("Occupation Jobs in Industry" column)
        let occupationJobsCell = newRow.insertCell(1);
        occupationJobsCell.innerText = inOccupationJobs.toLocaleString("en");
        occupationJobsCell.classList.add("rightAlign");

        // adds third cell ("% of Occupation Jobs in Industry" column)
        let percentOccupationJobsCell = newRow.insertCell(2);
        percentOccupationJobsCell.innerHTML = `<span>${percentageJobsInIndustry}</span>%`;
        percentOccupationJobsCell.classList.add("rightAlign");

        // adds fourth column ("% Total Jobs in Industry" column)
        let percentTotalJobsCell = newRow.insertCell(3);
        percentTotalJobsCell.innerHTML = `<span>${percentageTotalJobs}</span>%`;
        percentTotalJobsCell.classList.add("rightAlign");
    }

    // Gets info for each row, and pass to helper addTableRow() function
    for (let i = 0; i < industryData.industries.length; i++) {
        let title = industryData.industries[i].title;
        let inOccupationJobs = industryData.industries[i].in_occupation_jobs;
        let percentageTotalJobs = (
            (inOccupationJobs / industryData.industries[i].jobs) *
            100
        ).toFixed(1);
        let percentageJobsInIndustry = (
            (inOccupationJobs / industryData.jobs) *
            100
        ).toFixed(1);
        addTableRow(
            title,
            inOccupationJobs,
            percentageJobsInIndustry,
            percentageTotalJobs
        );
    }
}

window.addEventListener("load", async function (event) {
    await getData();

    setGeneralData(data);
    setSummaryJobs(data);
    setSummaryJobsGrowth(data);
    getSummaryEarnings(data);
    populateTrendsTable(data);
    populateIndustryTable(data);
});

"use strict";
let data = "no data";
let red = "#eb4034";
let green = "#44ad4c";

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
    let startYear = jobsGrowthData.start_year;
    let endYear = jobsGrowthData.end_year;
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

window.addEventListener("load", async function (event) {
    await getData();

    setGeneralData(data);
    setSummaryJobs(data);
    setSummaryJobsGrowth(data);
    getSummaryEarnings(data);
});

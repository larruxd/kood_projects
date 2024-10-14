import { isAuthorized, getJwtToken } from "./helpers.js";
import { createSkillChart, createXpChart } from "./charts.js";

export async function createHomePage() {
    const jwtToken = getJwtToken();
    const apiUrl = "https://01.kood.tech/api/graphql-engine/v1/graphql";
    const graphqlQuery = `
    {
        user {
            id
            login
            auditRatio
        }

        xp: transaction(
            where: {
                type: {_eq: "xp"},
                path: {_regex: "div-01", _nregex: "piscine"},
            }
            order_by: {createdAt: asc}
        ) {
            amount
            createdAt
            object {
                name
            }
        }

        level: transaction(
            where: {
                type: {_eq: "level"}, 
                object: {type: {_nregex: "exercise|raid"}}
            }
            limit: 1
            offset: 0
            order_by: {amount: desc}
        ) {
            amount
        }

        skillPoints: transaction(
            where: {type: {_regex: "skill"}}
            order_by: {amount: asc}
        ) {
            type
            amount
            path
        }
    }
`;
    const data = await getData(jwtToken, apiUrl, graphqlQuery);

    populateProfileCard([data.user[0], data.xp, data.level[0]]);
    createSkillChart(formatSkillData(data.skillPoints));
    createXpChart(data.xp);
}

async function getData(jwtToken, url, graphqlQuery) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`, // Include the JWT token here
        },
        body: JSON.stringify({ query: graphqlQuery }),
    };

    try {
        let resp = await fetch(url, requestOptions);
        if (resp.status === 200) {
            let data = await resp.json();
            return data.data;
        }
    } catch (e) {
        console.error(e);
    }
}

function populateProfileCard(data) {
    const username = data[0].login,
        auditRatio = data[0].auditRatio.toFixed(1),
        xp = calculateXP(data[1]),
        level = data[2].amount;
    // SET IMG
    document.querySelector(
        "#pfp"
    ).style.background = `url("https://01.kood.tech/git/user/avatar/${username}/-1") center center / cover`;
    // SET NAME
    document.querySelector("#username").innerHTML = username;

    // SET STATS
    document.querySelector("#user-info-table").innerHTML = `
    <tr>
        <th>XP:</th>
        <td>${xp}</td>
    </tr>
    <tr>
        <th>Level:</th>
        <td>${level}</td>
    </tr>
    <tr>
        <th>Audit ratio:</th>
        <td>${auditRatio}</td>
    </tr>
    `;
}

function calculateXP(dataXP) {
    let bytes = 0;
    let xp;
    dataXP.forEach((elem) => {
        bytes += elem.amount;
    });

    if (bytes < 1000) {
        xp = bytes + " B";
    } else if (bytes < 1000 * 1000) {
        xp = (bytes / 1000).toFixed(0) + " KB";
    } else if (bytes < 1000 * 1000 * 1000) {
        xp = (bytes / (1000 * 1000)).toFixed(1) + " MB";
    } else {
        xp = (bytes / (1000 * 1000 * 1000)).toFixed(1) + " GB";
    }
    return xp;
}

function formatSkillData(data) {
    let formatedObj = {};
    let formatedData = [];
    let key;
    let value;
    // add values together
    for (let i = 0; i < data.length; i++) {
        key = data[i].type;
        value = data[i].amount;
        if (!formatedObj.hasOwnProperty(key)) {
            formatedObj[key] = value;
        } else {
            formatedObj[key] += value;
        }
    }
    // add obejcts to array
    for (const [key, value] of Object.entries(formatedObj)) {
        // add obj only if value is above ...
        //          |
        //          v
        if (value > 50) {
            formatedData.push({ label: key, value: value });
        }
    }
    return formatedData;
}

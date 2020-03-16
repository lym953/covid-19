const firebase = require("firebase");
require("firebase/firestore");
const firebaseConfig = require('../website/src/firebaseConfig.json');
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const moment = require("moment");
var states = require('us-state-codes');

function snapshotToArray(snapshot) {
    var returnArr = []
    snapshot.forEach(function (childSnapshot) {
        returnArr.push(childSnapshot.data());
    });
    return returnArr;
};

async function updateDataInDB(info) {
    let docRef = db.collection("DATA").doc("latest");
    await docRef.set(info).then((doc) => {
        console.log(`done updating latest`);
    }).catch(err => {
        console.log(err);
        return null;
    });

    docRef = db.collection("ARCHIVED_DATA").doc(info.timestamp);
    await docRef.set(info).then((doc) => {
        console.log(`done updating archive`);
    }).catch(err => {
        console.log(err);
        return null;
    });
}

var cases = require('../website/src/data/1.3cases.json');

async function doit() {
    let time = moment();

    cases = cases.map (c => {
        c.state_full_name = states.getStateNameByStateCode(c.state_name);
        delete c["comments"];
        return c;
    });

    let info = {
        timestamp: time.format(),
        data: JSON.stringify(cases, 0, 2),
    }

    await updateDataInDB(info);

    process.exit();
}

doit();
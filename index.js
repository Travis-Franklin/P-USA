const pgp = require('pg-promise')({
    query : e => {
        console.log(`QUERY: ${e.query}`);
    }
});

const options = {
    host: 'localhost',
    database: 'USA_Table'
};

const db = pgp(options);


async function modelUniverse (){
    const countTotal = await db.query(`
    SELECT * from USA_Table
    WHERE support_score >= 0.7
    AND turnout_score <= 0.8
    ;`)
    .catch(err => {
        console.log(err);
        return [];
    });
    let countTotalMapped = countTotal.map( async (item) => (
    await db.any(`
    INSERT into Model_Universe 
        (unique_id, race, age_bucket, gender, support_score, turnout_score)
        VALUES ('
        ${item.unique_id}', 
        '${item.race}', 
        '${item.age_bucket}', 
        '${item.gender}',
        '${item.support_score}', 
        '${item.turnout_score}');`)
        .catch(err => {
            console.log(err);
            return [];
        })))
    };

// modelUniverse();

async function AgeUniverse (){
    const countTotal = await db.query(`
    SELECT * from USA_Table
    WHERE age_bucket = '18-34'
    AND support_score < 0.7
    ;`)
    .catch(err => {
        console.log(err);
        return [];
    });
    let countTotalMapped = countTotal.map( async (item) => (
    await db.any(`
    INSERT into Age_Universe 
        (unique_id, race, age_bucket, gender, support_score, turnout_score)
        VALUES (
        '${item.unique_id}', 
        '${item.race}', 
        '${item.age_bucket}', 
        '${item.gender}',
        '${item.support_score}', 
        '${item.turnout_score}');`)
        .catch(err => {
            console.log(err);
            return [];
        })))
    };

AgeUniverse();










// async function raceUniverse (){
//     const countTotal = await db.query(`SELECT count(*) from USA_Table 
//     WHERE race='AfAm' OR race='Hispanic'
//     AND turnout_score<=0.7
//     AND support_score>=0.6
//     ;`)
//     .then( data => {
//         return data;
//     })
//     .catch(err => {
//         console.log(err);
//         return [];
//     })
//     console.log(countTotal);
// };

// raceUniverse();


module.exports = db;
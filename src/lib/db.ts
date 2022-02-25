/*
Mongo will have an auth database, "Auth", and a database for each competition

Auth will have 2 collections:
"Users" will store data for each user including their username and password hash 
"Sessions" will store session data.


Each competition database will have a few collections:
"Prescout" which will hold pre-scout data
"Matches" which will hold data for the matches at a competition
"ScoutedMatches" which will hold data for each match scouted and each robot
*/
//Crypto
import {randomBytes} from 'crypto'


//Setup Mongo
import { Collection, MongoClient } from "mongodb"

let client = new MongoClient("mongodb://localhost")
client.connect()

let authDB = client.db("Auth")
let usersColl: Collection<App.StoredUser> = authDB.collection("Users")
let sessionColl: Collection<App.StoredSession> = authDB.collection("Sessions")

let compDB = client.db("TESTING_COMP_DATABASE")
let scoutedDataColl: Collection<App.ScoutedMatch> = compDB.collection("MatchData")
let pitDataColl: Collection<App.PitData> = compDB.collection("PitData")

//Methods
export async function aggregate() {

}

export async function getUser(username: string): Promise<App.StoredUser> {
    return (await usersColl.findOne({username: username}))
}

export async function doesUserExist(username: string): Promise<boolean> {
    return (await usersColl.countDocuments({username: username})) > 0
}

export async function createUser(user: App.StoredUser): Promise<void> {
    if(await doesUserExist(user.username)) throw new Error("Username taken, make sure to check for that")
    await usersColl.insertOne(user)
}

export async function createSession(username: string): Promise<string> {
    if(!username) throw new Error("Username can't be undefined...")
    let token = randomBytes(30).toString('hex').slice(0,30)
    let user = await getUser(username)
    if(!user) throw new Error("A session can't be created for a nonexistient user")
    //Delete old sessions for user
    await sessionColl.deleteMany({username: username})
    await sessionColl.insertOne({
        username: username,
        sessionId: token
    })
    return token
}

export async function retreiveSession(sessionId: string): Promise<App.StoredUser> {
    console.log("Retreiving session: " + sessionId)
    let session = await sessionColl.findOne({sessionId: sessionId})
    if (!session) throw new Error("You need to test if a session exists before trying to retrieve it")
    return await usersColl.findOne({username: session.username})
}
export async function doesSessionExist(sessionId: string): Promise<boolean> {
    console.log("Testing session: " + sessionId)
    let session = await sessionColl.findOne({sessionId: sessionId})
    console.log(session)
    if(session) return true
    return false
}

export async function destroySession(sessionId: string): Promise<void> {
    await sessionColl.findOneAndDelete({sessionId: sessionId})
}

export async function addScoutedDataToDB(scoutedData: App.ScoutedMatch) {
    await scoutedDataColl.insertOne(scoutedData)
}

export async function addPitDataToDB(scoutedData: App.PitData) {
    console.log("DATA")
    console.log(scoutedData)
    await pitDataColl.insertOne(scoutedData)
}
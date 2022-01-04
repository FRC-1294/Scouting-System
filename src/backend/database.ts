import mongoose from 'mongoose'
export class DatabaseManager {
    matchSchema = new mongoose.Schema({
        matchNumber: Number,
        redBots: [Number],
        blueBots: [Number],
    })
    MATCH = mongoose.model('match', this.matchSchema)
    
    //The idea here is that the scouts would send data to the server, and the server would create a document for each match/team combo.
    //To get data on a team, I'll setup an aggregation to merge all these match/team documents into a single team document.
    robotDataSchema = new mongoose.Schema({
        teamNumber: Number,
        matchNumber: Number,
    
        auto: Number, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
        boxesMovedAuto: Number,
        boxesMovedTeleop: Number,
        efficient: Boolean, //Whether the robot navigated "Efficiently"
    })
    ROBOTDATA = mongoose.model('robotdata', this.robotDataSchema)
    
    /**
     * @param {string} url - The URL of the database as mongo://{username}:{password}@{IP}/
     */
    constructor(url: string) {
        mongoose.connect(url)
    }

   /**
    * submitData
    */
   public submitData(dataToSumbit: Object) { //TODO validate
       let dataObject: mongoose.Document = new this.ROBOTDATA(dataToSumbit)
       dataObject.save()
   }

   /**
    * aggregateTeams
    */
   public async aggregateTeams() {
    let pipeline = [
        {
            $group: {
                _id: '$teamNumber',
                MaxAuto: {
                    $max: '$auto',
                },
                AvgAuto: {
                    $avg: '$auto',
                },
                MinAuto: {
                    $min: '$auto',
                },
                AvgBoxesMovedAuto: {
                    $avg: '$boxesMovedAuto',
                },
                AvgBoxesMovedTeleop: {
                    $avg: '$boxesMovedTeleop',
                },
                MaxBoxesMovedAuto: {
                    $max: '$boxesMovedAuto',
                },
                MaxBoxesMovedTeleop: {
                    $max: '$boxesMovedTeleop',
                },
            },
        },
        {
            $sort: {
                AvgBoxesMovedTeleop: -1,
                AvgBoxesMovedAuto: -1,
                MaxAuto: -1,
                AvgAuto: -1,
            },
        },
    ]
    console.log('Aggregation requested')
    let result = await this.ROBOTDATA.aggregate(pipeline).exec()
    return result
   }
}
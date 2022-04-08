import { getHumans } from "./db";

export async function generateScoutSchedule(firstDayNumberOfShifts: number, secondDayNumberOfShifts: number): Promise<App.Shift[]> {
    let shifts: App.Shift[] = [];
    let listOfHumans = await getHumans();
    let shuffledListOfHumans = [...listOfHumans];

    function shuffleHumans() {
        shuffledListOfHumans = [...listOfHumans];
        shuffledListOfHumans.sort((a, b) => 0.5 - Math.random())
    }

    function getRandomHuman(shiftNumber: number, dayNumber: number): App.Human {
        if(shuffledListOfHumans.length < 1) shuffleHumans();
        let human = shuffledListOfHumans.splice(Math.floor(Math.random()*shuffledListOfHumans.length), 1)[0]

        //Check day        
        if(dayNumber == 1 ? !human.dayOne : !human.dayTwo) {
            let tempHuman = getRandomHuman(shiftNumber, dayNumber); //Get a new human while the current human isn't selected
            shuffledListOfHumans.push(human); //Add the current human since they're not being returned
            return tempHuman; //Return the temporary human
        }

        //Check arrival departure
        /*
        if(((dayNumber == 1 ? human.leaving1 : human.leaving2) ?? firstDayNumberOfShifts + 1) < shiftNumber) {
            return getRandomHuman(shiftNumber, dayNumber);
        } 
        if((dayNumber == 1 ? human.arriving1 : human.arriving2) > shiftNumber) {
            let tempHuman = getRandomHuman(shiftNumber, dayNumber); //Get a new human while the current human isn't selected
            shuffledListOfHumans.push(human); //Add the current human since they're not being returned
            return tempHuman; //Return the temporary human
        }*/
        if(human.leaving1 && dayNumber == 1) {
            if(human.leaving1 < shiftNumber) {
                return getRandomHuman(shiftNumber,dayNumber)
            }
        }
        
        return human;
    }

    shuffleHumans()
    
    for (let i = 1; i <= firstDayNumberOfShifts; i++) {
        let currentShift: App.Shift = {
            shiftNumber: i,
            day: 1,
            r1: null,
            r2: null,
            r3: null,
            b1: null,
            b2: null,
            b3: null,
        }
        
        let humanArr = [];

        while (humanArr.length < 6) {
            let human = getRandomHuman(i, 1);
            if(humanArr.includes(human)) continue;
            humanArr.push(human);
        }

        currentShift.r1 = humanArr[0];
        currentShift.r2 = humanArr[1];
        currentShift.r3 = humanArr[2];
        currentShift.b1 = humanArr[3];
        currentShift.b2 = humanArr[4];
        currentShift.b3 = humanArr[5];
        
        shifts.push(currentShift);
    }

    for (let i = firstDayNumberOfShifts + 1; i <= firstDayNumberOfShifts + secondDayNumberOfShifts; i++) {
        let currentShift: App.Shift = {
            shiftNumber: i,
            day: 2,
            r1: null,
            r2: null,
            r3: null,
            b1: null,
            b2: null,
            b3: null,
        }
        
        let humanArr = [];

        while (humanArr.length < 6) {
            let human = getRandomHuman(i, 2);
            if(humanArr.includes(human)) continue;
            humanArr.push(human);
        }

        currentShift.r1 = humanArr[0];
        currentShift.r2 = humanArr[1];
        currentShift.r3 = humanArr[2];
        currentShift.b1 = humanArr[3];
        currentShift.b2 = humanArr[4];
        currentShift.b3 = humanArr[5];
        
        shifts.push(currentShift);
    }

    return shifts;
}
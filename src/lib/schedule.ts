import { getHumans } from "./db";

export async function generateScoutSchedule(numberOfShifts: number): Promise<App.Shift[]> {
    let shifts: App.Shift[] = [];
    let listOfHumans = await getHumans();
    let shuffledListOfHumans = [...listOfHumans];

    function shuffleHumans() {
        shuffledListOfHumans = [...listOfHumans];
        shuffledListOfHumans.sort((a, b) => 0.5 - Math.random())
    }

    function getRandomHuman(shiftNumber: number): App.Human {
        if(shuffledListOfHumans.length < 1) shuffleHumans();
        let human = shuffledListOfHumans.splice(Math.floor(Math.random()*shuffledListOfHumans.length), 1)[0]
        if((human.leaving ?? numberOfShifts + 1) < shiftNumber) {
            return getRandomHuman(shiftNumber);
        } 
        if((human.arriving ?? 0) > shiftNumber) {
            let tempHuman = getRandomHuman(shiftNumber); //Get a new human while the current human isn't selected
            shuffledListOfHumans.push(human); //Add the current human since they're not being returned
            return tempHuman; //Return the temporary human
        }
        return human;
    }

    shuffleHumans()
    
    for (let i = 1; i <= numberOfShifts; i++) {
        let currentShift: App.Shift = {
            shiftNumber: i,
            r1: null,
            r2: null,
            r3: null,
            b1: null,
            b2: null,
            b3: null,
        }
        
        let humanArr = [];

        while (humanArr.length < 6) {
            let human = getRandomHuman(i);
            if(humanArr.includes(human)) continue;
            humanArr.push(human);
        }

        currentShift.r1 = humanArr[0];
        currentShift.r2 = humanArr[1];
        currentShift.r3 = humanArr[2];
        currentShift.b1 = humanArr[3];
        currentShift.b2 = humanArr[4];
        currentShift.b3 = humanArr[5];
        
        console.log(currentShift)
        shifts.push(currentShift);
    }

    return shifts;
}
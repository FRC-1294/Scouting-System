import { getHumans } from "./db";

export async function generateMatchSchedule(numberOfShifts: number): Promise<App.Shift[]> {
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
            shuffledListOfHumans.push(human);
            return getRandomHuman(shiftNumber);
        }
        return human;
    }

    shuffleHumans()
    
    for (let i = 0; i < numberOfShifts; i++) {
        let currentShift: App.Shift = {
            shiftNumber: i,
            r1: null,
            r2: null,
            r3: null,
            b1: null,
            b2: null,
            b3: null,
        }
        
        currentShift.r1 = getRandomHuman(i);
        currentShift.r2 = getRandomHuman(i);
        currentShift.r3 = getRandomHuman(i);
        currentShift.b1 = getRandomHuman(i);
        currentShift.b2 = getRandomHuman(i);
        currentShift.b3 = getRandomHuman(i);
        
        console.log(currentShift)
        shifts.push(currentShift);
    }

    return shifts;
}
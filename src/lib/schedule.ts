import { getHumans } from "./db";

export async function generateMatchSchedule(numberOfShifts: number): Promise<App.Shift[]> {
    let shifts: App.Shift[] = [];
    let listOfHumans = await getHumans();
    let shuffledListOfHumans = [...listOfHumans];

    function shuffleHumans() {
        shuffledListOfHumans = [...listOfHumans];
        shuffledListOfHumans.sort((a, b) => 0.5 - Math.random())
    }

    function getRandomHuman(): App.Human {
        if(shuffledListOfHumans.length < 1) shuffleHumans();
        return shuffledListOfHumans.splice(Math.floor(Math.random()*shuffledListOfHumans.length), 1)[0];
    }

    shuffleHumans()
    
    for (let i = 0; i < numberOfShifts; i++) {
        let currentShift: App.Shift = {
            r1: null,
            r2: null,
            r3: null,
            b1: null,
            b2: null,
            b3: null,
        }
        
        currentShift.r1 = getRandomHuman();
        currentShift.r2 = getRandomHuman();
        currentShift.r3 = getRandomHuman();
        currentShift.b1 = getRandomHuman();
        currentShift.b2 = getRandomHuman();
        currentShift.b3 = getRandomHuman();
        
        console.log(currentShift)
        shifts.push(currentShift);
    }

    return shifts;
}
import { clsx } from "clsx";

export function cn(...inputs) {
    return clsx(inputs);
}

export function shuffle(array) {
    // Create a copy to avoid mutating original array if needed, 
    // but standard in-place functionality is often expected. 
    // Let's copy to be safe purely for React state reasons.
    const newArray = [...array];
    let currentIndex = newArray.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
}

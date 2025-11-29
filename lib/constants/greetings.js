// Time-based greeting messages (30 variations)
export const GREETINGS = [
  { timeStart: 5, timeEnd: 7, text: "Good morning, light chaser." },
  { timeStart: 6, timeEnd: 8, text: "Soft dawn, sharp ideas." },
  { timeStart: 7, timeEnd: 9, text: "Golden hour minds work early." },
  { timeStart: 9, timeEnd: 11, text: "Mid-morning focus. Perfect." },
  { timeStart: 11, timeEnd: 13, text: "Midday glare, stay intentional." },
  { timeStart: 12, timeEnd: 14, text: "Afternoon grind, cinematic mindset." },
  { timeStart: 13, timeEnd: 15, text: "Good afternoon, frame by frame." },
  { timeStart: 15, timeEnd: 17, text: "Late afternoon — storyboarding time." },
  { timeStart: 17, timeEnd: 19, text: "Golden hour. Best time to shoot." },
  { timeStart: 18, timeEnd: 20, text: "Sunset: the sky's in production design mode." },
  { timeStart: 19, timeEnd: 21, text: "Blue hour. Details hit different now." },
  { timeStart: 20, timeEnd: 22, text: "Evening hustle. Directors don't sleep." },
  { timeStart: 21, timeEnd: 23, text: "Night shift. Vision is 24/7." },
  { timeStart: 22, timeEnd: 24, text: "Midnight oil, premium ideas." },
  { timeStart: 23, timeEnd: 2, text: "Past midnight — only obsessives are awake." },
  { timeStart: 0, timeEnd: 3, text: "Early hours. Scripts write themselves now." },
  { timeStart: 1, timeEnd: 4, text: "Dead of night, alive ideas." },
  { timeStart: 2, timeEnd: 5, text: "This hour belongs to your legend." },
  { timeStart: 4, timeEnd: 6, text: "New day, new scenes to shoot." },
  { timeStart: 8, timeEnd: 10, text: "Prime time — audience is awake." },
  { timeStart: 14, timeEnd: 16, text: "Creative hours unlocked." },
  { timeStart: 16, timeEnd: 18, text: "Late-night render in progress." },
  { timeStart: 3, timeEnd: 5, text: "Weekend mode, but the grind's still rolling." },
  { timeStart: 10, timeEnd: 12, text: "New week, same mission." },
  { timeStart: 6, timeEnd: 9, text: "Clear skies, clean timelines." },
  { timeStart: 7, timeEnd: 10, text: "Cloudy skies, sharp thinking." },
  { timeStart: 11, timeEnd: 14, text: "Rain outside, perfect time for worldbuilding." },
  { timeStart: 15, timeEnd: 18, text: "Holiday glow — still, the story continues." },
  { timeStart: 0, timeEnd: 1, text: "Year's end — edit your life like a reel." },
  { timeStart: 1, timeEnd: 2, text: "New year, new season arc." }
];

export function getGreeting() {
  const hour = new Date().getHours();

  // Find matching greetings
  const matching = GREETINGS.filter(g => {
    if (g.timeStart <= g.timeEnd) {
      return hour >= g.timeStart && hour < g.timeEnd;
    } else {
      // Handle wrap-around (e.g., 23:00 to 2:00)
      return hour >= g.timeStart || hour < g.timeEnd;
    }
  });

  // Return random matching greeting or default
  if (matching.length > 0) {
    return matching[Math.floor(Math.random() * matching.length)].text;
  }

  return "Welcome back.";
}

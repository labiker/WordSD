export const gameData = {
    legacy: {
        // Legacy
        humanCorpse: 0, // Human corpse
        vegetableSeed: 0, // Vegetable seed
    },
    collection: {
        smilingAngel_1: false, // Smile Angel part1
        smilingAngel_2: false, // Smile Angel part2
    },
    item: {
        CorpsePieces: 0, // Corpse pieces
    },
    story: {
        sledDogDeathSceneI: false, // Sled dog death scene I
        sledDogDeathSceneII: false, // Sled dog death scene II
    },
    system: {
        language: '', // Language
        firstTime: true, // Whether it is the first time to play
        RoundsPerDay: 4, // Number of rounds per day
        totlaDays: 7, // Total number of days
        currentDay: 1, // Current day
        currentTime: 18, // Current time
        isEnableToGoOut: false, // Whether to enable going out
    },
    player: {
        credibility: 50, // Credibility
        survival: true, // Whether to survive
        playerPosition: 0, // Player position
        place: {
            // Place
            home: 0, // Home
            staircase: 1, // Staircase
            elevator: 2, // Elevator
            neighborHouse: 3, // Neighbor's house
        },
        viewTheDoorEye: false, // Whether to view the cat's eye
        doorIsOpened: false, // Whether the door is opened
        healthMax: 100, // Maximum health
        health: 100, // Current health
        healthIncreasePerHour: 10, // health recovery per hour
        stressLevel: 0, // Stress level
        stressMax: 100, // Maximum stress
        stress: 0, // Current stress
        stressConsumePerHour: 10, // stress consumption per hour
        stressDecreasePerHour: 3, // stress recovery per hour (when sleeping)
        foodMax: 100, // Food (upper limit)
        food: 100, // Food
        foodConsumePerHour: 1, // Food consumption per hour
        purchasedFood: 0, // Purchased food
        purchasedFoodMax: 100, // Purchased food (upper limit)
        purchasedFoodMin: 20, // Purchased food (lower limit)
        isNoteProcessed: false, // Whether the note is processed
    },
};

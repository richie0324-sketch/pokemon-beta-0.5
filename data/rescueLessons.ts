
import { MathTopic } from '../types';

export interface RescueLesson {
    id: string;
    topic: MathTopic;
    title: string;
    content: string;
    question: string;
    options: string[];
    correctIndex: number;
}

export const RESCUE_LESSONS: RescueLesson[] = [
    // --- LINEAR EQUATIONS (Year 8 AU) ---
    {
        id: 'lin_gradient_def',
        topic: 'linear',
        title: 'Understanding Gradient (m)',
        content: "In the equation y = mx + c, 'm' represents the gradient (or slope). It measures the steepness of the line. Gradient = Rise / Run. A higher number means a steeper line.",
        question: "In y = 5x + 2, what represents the steepness?",
        options: ["The 5 (m)", "The 2 (c)", "The x", "The y"],
        correctIndex: 0
    },
    {
        id: 'lin_intercept_def',
        topic: 'linear',
        title: 'The Y-Intercept (c)',
        content: "In the linear equation y = mx + c, the value 'c' is the y-intercept. This is the point where the line crosses the vertical y-axis (where x = 0).",
        question: "If y = 2x + 7, where does the line cross the y-axis?",
        options: ["At 2", "At 7", "At 0", "At -7"],
        correctIndex: 1
    },
    {
        id: 'lin_horizontal',
        topic: 'linear',
        title: 'Horizontal Lines',
        content: "A horizontal line goes straight across (left to right). It has a gradient of 0. Its equation looks like y = c (e.g., y = 4).",
        question: "What is the gradient of a horizontal line?",
        options: ["1", "Undefined", "0", "100"],
        correctIndex: 2
    },
    {
        id: 'lin_vertical',
        topic: 'linear',
        title: 'Vertical Lines',
        content: "A vertical line goes straight up and down. Its gradient is undefined (because the 'run' is zero). Its equation looks like x = c (e.g., x = 3).",
        question: "Which equation represents a vertical line?",
        options: ["y = 3", "y = x", "x = 5", "y = 2x + 1"],
        correctIndex: 2
    },
    {
        id: 'lin_origin',
        topic: 'linear',
        title: 'The Origin',
        content: "The origin is the center point of the Cartesian plane where the x-axis and y-axis intersect. Its coordinates are always (0, 0).",
        question: "What are the coordinates of the origin?",
        options: ["(1, 1)", "(0, 1)", "(1, 0)", "(0, 0)"],
        correctIndex: 3
    },
    {
        id: 'lin_direction',
        topic: 'linear',
        title: 'Positive vs Negative Gradient',
        content: "If a line goes UP from left to right, the gradient (m) is positive. If it goes DOWN from left to right, the gradient is negative.",
        question: "A line goes down from left to right. Its gradient is:",
        options: ["Positive", "Negative", "Zero", "Undefined"],
        correctIndex: 1
    },

    // --- PROBABILITY (Year 8 AU) ---
    {
        id: 'prob_range',
        topic: 'probability',
        title: 'Probability Scale',
        content: "Probability is always a number between 0 and 1. 0 means 'Impossible' (0%), and 1 means 'Certain' (100%). You cannot have a probability like 1.5 or -0.2.",
        question: "Which of these is a valid probability?",
        options: ["1.5", "-0.5", "0.7", "120%"],
        correctIndex: 2
    },
    {
        id: 'prob_complement',
        topic: 'probability',
        title: 'Complementary Events',
        content: "The 'complement' of an event A is 'not A'. The probabilities of an event and its complement always add up to 1. Formula: P(not A) = 1 - P(A).",
        question: "If P(Win) = 0.4, what is P(Lose)?",
        options: ["0.4", "0.6", "0", "1.4"],
        correctIndex: 1
    },
    {
        id: 'prob_sample_space',
        topic: 'probability',
        title: 'Sample Space',
        content: "The Sample Space is the list of ALL possible outcomes of an experiment. For a standard die, the sample space is {1, 2, 3, 4, 5, 6}.",
        question: "What is the sample space for flipping a coin?",
        options: ["{Heads}", "{Tails}", "{Heads, Tails}", "{1, 2}"],
        correctIndex: 2
    },
    {
        id: 'prob_independence',
        topic: 'probability',
        title: 'Independent Events',
        content: "Two events are independent if the result of one does not affect the other (e.g., rolling a die and flipping a coin). You multiply their probabilities: P(A and B) = P(A) × P(B).",
        question: "If you roll a die and flip a coin, are they independent?",
        options: ["Yes", "No", "Only if you get Heads", "Only on Tuesdays"],
        correctIndex: 0
    },
    {
        id: 'prob_impossible',
        topic: 'probability',
        title: 'Impossible Events',
        content: "An event is 'Impossible' if it has a 0% chance of happening. For example, rolling a 7 on a standard 6-sided die is impossible.",
        question: "Which event is impossible?",
        options: ["Rolling a 6", "Flipping Heads", "Rolling a 7 on a standard die", "Rain in winter"],
        correctIndex: 2
    }
];

export const getRandomLesson = (topic: MathTopic): RescueLesson => {
    const lessons = RESCUE_LESSONS.filter(l => l.topic === topic);
    // Fallback if no lessons found (shouldn't happen)
    if (lessons.length === 0) return RESCUE_LESSONS[0];
    return lessons[Math.floor(Math.random() * lessons.length)];
};

import type { Option, Quiz } from "./Quiz"

export type GameSession = {
    id : string,
    pin : string,
    status : string,
    currentQuestionIndex : number,
    questionStartTime : Date,
    quiz : Quiz,
    players : PlayerSession[]
}



export type PlayerSession = {
    userId : string,
    username : string,
    score : number,
    answers : Option[]
}

export type PlayerData = {
    username : string;
}

export type QuestionData = {
    id : string,
    text : string,
    questionStartTime : string,
    timeLimitSeconds : number,
    options : Option[],
    hasNext : boolean,
}

export type AnswerReceived = {
    currentCount : number
}

export type QuestionStats = {
    optionId : string,
    text: string,
    correct : boolean,
    count : number,
    order : number
}

export type EventMessage = 
    | {event:  "PLAYER_JOINED", data: PlayerData}
    | {event:  "PLAYER_LEFT", data: PlayerData}
    | {event:  "GAME_STARTED", data: QuestionData}
    | {event:  "ANSWER_RECEIVED", data: AnswerReceived}
    | {event:  "QUESTION_END", data: QuestionStats[]}
    | {event:  "NEXT_QUESTION", data: QuestionData};

export type AnswerRequest = {
    username : string,
    questionId : string,
    selectedOptionId: string
}

export type LoginResponse = {
    token : string
}
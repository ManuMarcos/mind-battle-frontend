
export type Quiz = {
    id : string,
    title : string,
    description : string,
    createdBy : string,
    questions : Question[]
    totalTime: number
}

export type Question = {
    id : string,
    text : string,
    timeLimitSeconds : number,
    options: Option[]
}

export type Option = {
    id : string,
    text : string,
    correct : boolean
}

export type QuizForm = {
    title: string;
    description: string;
    questions: QuestionForm[];
}

export type QuestionForm = {
    id: string; 
    text: string;
    timeLimitSeconds: number;
    options: OptionForm[];
}

export type OptionForm = {
    id: number;
    text: string;
    correct: boolean;
}

export type QuizRequest = {
    title: string;
    description: string;
    questions: {
        text: string;
        timeLimitSeconds: number;
        options: {
            text: string;
            correct: boolean;
        }[];
    }[];
}

export const mapQuizFormToRequest = (form: QuizForm): QuizRequest => {
    return {
      title: form.title,
      description: form.description,
      questions: form.questions.map(q => ({
        text: q.text,
        timeLimitSeconds: q.timeLimitSeconds,
        options: q.options.map(opt => ({
          text: opt.text,
          correct: opt.correct
        }))
      }))
    };
  }
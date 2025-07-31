import type { QuestionData } from "@/types";

export const mockQuestion: QuestionData = {
  id: "c09bc571-1fc7-4edc-a671-7e42822a9de1",
  text: "En que equipo juega actualmente Neymar?",
  timeLimitSeconds: 30,
  questionStartTime: "2025-07-29T07:52:14.123456Z",
  hasNext: true,
  options: [
    {
      id: "71629664-e0ed-4f65-8f15-2bf2a2c9b1ff",
      text: "Santos FC",
      correct: true,
    },
    {
      id: "91e4a023-532f-426d-9140-413562a18534",
      text: "Barcelona",
      correct: false,
    },
    {
      id: "7e468b6a-b6e0-4eb7-bdcd-c6911dab462b",
      text: "PSG",
      correct: false,
    },
    {
      id: "a8945aa9-a2bc-44a7-85bc-3473ef01fe26",
      text: "Manchester City",
      correct: false,
    },
  ],
};

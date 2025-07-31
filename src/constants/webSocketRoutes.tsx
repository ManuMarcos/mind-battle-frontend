



export const WebSocketRoutes = {
    TOPIC_SESSION : (sessionId : string) => `/topic/session.${sessionId}`,
    APP_JOIN_SESSION: (sessionId : string) => `/app/session/${sessionId}/join`,
    APP_START_SESSION: (sessionId : string) => `/app/session/${sessionId}/start`,
    APP_ANSWER_QUESTION: (sessionId : string) => `/app/session/${sessionId}/answer`,
    APP_SHOW_RESULTS: (sessionId : string) => `/app/session/${sessionId}/show-results`

}
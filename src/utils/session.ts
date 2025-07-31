


export const getSessionInfo = () : { gameSessionId : string, username : string } | null => {
    const username = sessionStorage.getItem("username");
    const gameSessionId = sessionStorage.getItem("gameSessionId");
    return username && gameSessionId ? {username, gameSessionId} : null;
} 


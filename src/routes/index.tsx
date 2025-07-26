import { CenteredLayout } from "@/components/CenteredLayout";
import { DashboardLayout } from "@/components/DashBoardLayout";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { useAuth} from "@/hooks/useAuth";
import { CreateQuizPage } from "@/pages/CreateQuizPage";
import { GameFlowManager } from "@/pages/GameFlowManager";
import { JoinPage } from "@/pages/JoinPage";
import { QuizDetailsPage } from "@/pages/QuizDetailsPage";
import { QuizzesPage } from "@/pages/QuizzesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";



export const Routes = () => {
    const { isAuthenticated } = useAuth();

    const publicRoutes = [
        {
            path: "/",
            element: <CenteredLayout><JoinPage/></CenteredLayout>
        },
        {
            path: "/game",
            element: <WebSocketProvider><GameFlowManager/></WebSocketProvider>
        },
        {
            path: "/quizzes",
            element: <QuizzesPage/>
        },
        {
            path: "/quizzes/:id",
            element: <QuizDetailsPage/>
        },
        {
            path: "/createQuiz",
            element: <DashboardLayout><CreateQuizPage/></DashboardLayout>
        }
    ];

    const authenticatedOnlyRoutes = [
        {}
    ];

    const nonAuthenticatedOnlyRoutes = [
        {}
    ];

    const router = createBrowserRouter([
        ...publicRoutes,
        ...(!isAuthenticated ? nonAuthenticatedOnlyRoutes : []),
        ...authenticatedOnlyRoutes
    ])

    return <RouterProvider router={router}/>
}

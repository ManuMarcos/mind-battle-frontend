import { AppLayout } from "@/components/AppLayout";
import { CenteredLayout } from "@/components/CenteredLayout";
import { DashboardLayout } from "@/components/DashBoardLayout";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { useAuth } from "@/hooks/useAuth";
import { CreateGamePage } from "@/features/game/pages/CreateGamePage";
import { CreateQuizPage } from "@/features/quiz/pages/CreateQuizPage";
import { GameFlowManager } from "@/features/game/components/GameFlowManager";
import { JoinPage } from "@/features/join/pages/JoinPage";
import { QuizDetailsPage } from "@/features/quiz/pages/QuizDetailsPage";
import { QuizzesPage } from "@/features/quiz/pages/QuizzesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameResults } from "@/features/game/components/GameResults";

export const Routes = () => {
  const { isAuthenticated } = useAuth();

  const publicRoutes = [
    {
      path: "/",
      element: (
        <CenteredLayout>
          <JoinPage />
        </CenteredLayout>
      ),
    },
    {
      path: "/game",
      element: (
        <WebSocketProvider>
          <AppLayout>
            <GameFlowManager />
          </AppLayout>
        </WebSocketProvider>
      ),
    },
    {
      path: "/quizzes",
      element: (
        <AppLayout>
          <QuizzesPage />
        </AppLayout>
      ),
    },
    {
      path: "/quizzes/:id",
      element: (
        <AppLayout>
          <QuizDetailsPage />
        </AppLayout>
      ),
    },
    {
      path: "/create-game",
      element: (
        <AppLayout>
          <CreateGamePage />
        </AppLayout>
      ),
    },
    {
      path: "/create-quiz",
      element: (
        <AppLayout>
          <DashboardLayout>
            <CreateQuizPage />
          </DashboardLayout>
        </AppLayout>
      ),
    },
    {
      path: "/dev/show-results",
      element: (
        <AppLayout>
          <GameResults/>
        </AppLayout>
      ),
    },
  ];

  const authenticatedOnlyRoutes = [{}];

  const nonAuthenticatedOnlyRoutes = [{}];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...(!isAuthenticated ? nonAuthenticatedOnlyRoutes : []),
    ...authenticatedOnlyRoutes,
  ]);

  return <RouterProvider router={router} />;
};

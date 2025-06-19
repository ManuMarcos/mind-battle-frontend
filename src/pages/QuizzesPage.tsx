import { ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Bar, BarChart } from "recharts";

export const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const chartData = 
    [
        {
            red: 3, yellow : 10, green: 3, blue: 5
        },
    ]
  

  const chartConfig = {
    red : {
        label : "Red",
        color: "#f6250c"
    },
    yellow: {
        label: "Yellow",
        color: "#f6cb0c"
    },
    blue: {
        label : "Blue",
        color: "#0c5ef6"
    },
    green: {
        label : "Green",
        color: "#08e012"
    }
  }

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      setQuizzes(await response.json());
    } catch (error) {
      console.log("Ocurrio un error", error);
    }
  };

  useEffect(() => {
    console.log("Quizzes")
  }, []);

  return (
    <div className="flex bg-amber-200 max-h-10">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-100">
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="red" fill="var(--color-red)" radius={4} />
          <Bar dataKey="yellow" fill="var(--color-yellow)" radius={4} />
          <Bar dataKey="green" fill="var(--color-green)" radius={4} />
          <Bar dataKey="blue" fill="var(--color-blue)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

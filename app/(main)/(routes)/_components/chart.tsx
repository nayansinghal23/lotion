import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { IChart } from "@/interfaces/interface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ views }: IChart) => {
  return (
    <Line
      data={{
        labels: views.map((view) => view.date),
        datasets: [
          {
            label: "Total views",
            data: views.map((view) => {
              return Math.round(
                view.emails.reduce(
                  (acc: number, { frequency }) => (acc += frequency),
                  0
                ) / 2
              );
            }),
            borderColor: "rgb(75, 192, 192)",
          },
          {
            label: "Unique Views",
            data: views.map((view) => {
              return view.emails.length;
            }),
            borderColor: "rgb(205, 92, 92)",
          },
        ],
      }}
    />
  );
};

export default Chart;

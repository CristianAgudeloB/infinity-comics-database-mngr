import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SeriesList from "../pages/SeriesList";
import SeriesForm from "../pages/SeriesForm";
import SeriesDetail from "../pages/SeriesDetail";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/series", element: <SeriesList /> },
      { path: "/series/new", element: <SeriesForm /> },
      { path: "/series/:id", element: <SeriesDetail /> },
      { path: "/series/:id/edit", element: <SeriesForm /> },
    ]
  }
]);


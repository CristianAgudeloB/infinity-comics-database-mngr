import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SeriesList from "../pages/SeriesList";
import SeriesForm from "../pages/SeriesForm";
import ComicsList from "../pages/ComicsList";
import ComicsForm from "../pages/ComicsForm";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/series", element: <SeriesList /> },
      { path: "/series/new", element: <SeriesForm /> },
      { path: "/series/:id/edit", element: <SeriesForm /> },
      { path: "/comics", element: <ComicsList /> },
      { path: "/comics/new", element: <ComicsForm /> },
      { path: "/comics/:id/edit", element: <ComicsForm /> },
    ]
  }
]);


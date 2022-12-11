import {
  Navigate,
  useRoutes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ReactComponent as ProjectLogo } from "assets/project.svg";
import Projects from "pages/Projects";
import Project from "pages/Project";
import Job from "pages/Job";
import { ReactComponent as UsersLogo } from "assets/users.svg";
import Users from "pages/Users";

import DefaultLayout from "layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DefaultLayout
        navs={[
          {
            title: "Projects",
            path: "/projects",
            icon: <ProjectLogo height="40px" width="40px" />,
          },
          {
            title: "Users",
            path: "/users",
            icon: <UsersLogo height="40px" width="40px" />,
          },
        ]}
      />
    ),
    children: [
      {
        element: <Users />,
        path: "/users",
        tab: "Job",
      },
      {
        element: <Projects />,
        path: "/projects",
      },
      {
        element: <Project />,
        path: "/projects/:id",
        tab: "Project",
      },
      {
        element: <Job />,
        path: "/projects/:id/job/:job",
        tab: "Job",
      },
      { path: "*", element: () => <Navigate to="/projects" /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

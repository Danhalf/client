import { Router as RemixRouter } from "@remix-run/router/dist/router";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "App";
import Dashboard from "dashboard";
import NotFound from "not-found";
import Home from "./dashboard/home";
import Inventory from "./dashboard/inventory";
import SignIn from "./sign/sign-in";
import Contacts from "./dashboard/contacts";
import Deals from "dashboard/deals";
import Accounts from "dashboard/accounts";
import Reports from "dashboard/reports";
import { CreateInventory } from "dashboard/inventory/create";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const router: RemixRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                path: "",
                element: <SignIn />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "",
                        element: <Home />,
                    },
                    {
                        path: "inventory",
                        children: [
                            { path: "", element: <Inventory /> },
                            { path: "create", element: <CreateInventory /> },
                        ],
                    },
                    {
                        path: "contacts",
                        element: <Contacts />,
                    },
                    {
                        path: "deals",
                        element: <Deals />,
                    },
                    {
                        path: "accounts",
                        element: <Accounts />,
                    },
                    {
                        path: "reports",
                        element: <Reports />,
                    },
                ],
            },
        ],
    },
]);

root.render(<RouterProvider router={router} />);

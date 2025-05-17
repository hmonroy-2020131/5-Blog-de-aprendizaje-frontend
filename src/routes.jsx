import { DashboardPage } from "./pages/dashboard.jsx"
import { PublicationDetailPage } from "./pages/publicationDetailPage.jsx";

const routes = [
    {path : '/', element: <DashboardPage/>},
    { path: "/publication/:id", element: <PublicationDetailPage /> },
]

export default routes
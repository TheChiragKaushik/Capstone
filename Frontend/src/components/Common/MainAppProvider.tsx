import * as React from "react"
import type { Session } from "@toolpad/core/AppProvider"
import { AppProvider } from "@toolpad/core/AppProvider"
import { DashboardLayout } from "@toolpad/core/DashboardLayout"
import ToolbarActionsSearch from "../MainApp/ToolbarActionsSearch"
import { AppTheme, colors } from "../../utils/Constants"
import AppTitle from "../MainApp/AppTitle"


export type MainAppProviderProps = {
    session: Session | null
    children: React.ReactNode
    role: "Patient" | "Provider" | "Pharmacy"
}

const MainAppProvider: React.FC<MainAppProviderProps> = ({
    session,
    children,
    role,
}) => {
    return (
        <AppProvider
            theme={AppTheme}
            session={session}
        >
            <DashboardLayout
                defaultSidebarCollapsed
                slots={{
                    appTitle: AppTitle,
                    toolbarActions: () => (
                        <ToolbarActionsSearch
                            role={role}
                        />
                    ),
                }}
                sx={{
                    "& .MuiStack-root > .MuiStack-root:nth-of-type(1)": {
                        width: { xs: "70%", sm: "65%" },
                        justifyContent: "space-between",
                    },
                    "& .MuiPaper-root": {
                        background: colors.beige100,
                    },
                }}
            >
                {children}
            </DashboardLayout>
        </AppProvider>
    )
}

export default MainAppProvider

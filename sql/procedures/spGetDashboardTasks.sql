USE [TASK_DASHBOARD]
GO
/****** Object:  StoredProcedure [dbo].[spGetDashboardTasks]    Script Date: 9-3-2026 17:01:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[spGetDashboardTasks]
    @Day DATE = NULL,
    @ShowChecked BIT = 0,
    @RideId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Day IS NULL
        SET @Day = CAST(GETDATE() AS DATE);

    SELECT
        *
    FROM dbo.vw_Dashboard_Tasks_Checked
    WHERE
        RideStartDatum >= @Day
        AND RideStartDatum < DATEADD(DAY, 1, @Day)
        AND (@RideId IS NULL OR Ritnummer = @RideId)
        AND (@ShowChecked = 1 OR IsChecked = 0)
    ORDER BY
        RouteSortKey,
        Ritnummer,
        GeplandVan,   -- MomentPTA
        GeplandTot,   -- MomentPTD (tie-breaker)
        Taaknummer;
END;

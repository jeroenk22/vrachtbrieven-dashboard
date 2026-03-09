USE [TASK_DASHBOARD]
GO
/****** Object:  StoredProcedure [dbo].[spGetDashboardRoutes]    Script Date: 9-3-2026 17:01:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER   PROCEDURE [dbo].[spGetDashboardRoutes]
    @Day DATE = NULL,
    @UserName NVARCHAR(128)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Day IS NULL
        SET @Day = CAST(GETDATE() AS DATE);

    ;WITH RouteAgg AS (
        SELECT
            t.Ritnummer                AS RideId,
            t.Route,
            t.RouteSortKey,
            MIN(t.RideStartDatum)      AS RideStartDatum,
            MAX(t.NaamChauffeur)       AS NaamChauffeur,
            MAX(t.Kenteken)            AS Kenteken,
            MAX(t.NaamAuto)            AS NaamAuto,

            COUNT(*)                   AS TaakAantal,
            SUM(CASE WHEN t.AfgerondTot IS NULL THEN 1 ELSE 0 END) AS OpenTaken,
            MAX(CASE WHEN COALESCE(t.AantalFotos,0) > 0 THEN 1 ELSE 0 END) AS HeeftFotos,

            -- Fingerprint van “wat je belangrijk vindt”:
            -- Taaknummer + status + momentdone + fotocount + probleemstatus
            CHECKSUM_AGG(BINARY_CHECKSUM(
                t.Taaknummer,
                t.Status,
                t.AfgerondTot,
                COALESCE(t.AantalFotos, 0),
                COALESCE(t.ProbleemStatusId, 0)
            )) AS CurrentHash
        FROM dbo.vw_Dashboard_Tasks t
        WHERE t.RideStartDatum >= @Day
          AND t.RideStartDatum <  DATEADD(DAY, 1, @Day)
        GROUP BY
            t.Ritnummer,
            t.Route,
            t.RouteSortKey
    )
    SELECT
        a.RideId,
        a.Route,
        a.RouteSortKey,
        a.RideStartDatum,
        a.NaamChauffeur,
        a.Kenteken,
        a.NaamAuto,
        a.TaakAantal,
        a.OpenTaken,
        a.HeeftFotos,
        a.CurrentHash,

        s.LastSeenAt,
        s.LastSeenHash,

        CASE
            WHEN s.LastSeenHash IS NULL THEN 1              -- nog nooit gezien => bolletje
            WHEN s.LastSeenHash <> a.CurrentHash THEN 1     -- gewijzigd => bolletje
            ELSE 0
        END AS HasUpdates

    FROM RouteAgg a
    LEFT JOIN dbo.RouteSeenState s
        ON s.UserName = @UserName
        AND s.[Day] = @Day
        AND s.RideId = a.RideId
    ORDER BY
        a.RouteSortKey, a.RideId;
END;

USE [TASK_DASHBOARD]
GO
/****** Object:  StoredProcedure [dbo].[spMarkRouteSeen]    Script Date: 9-3-2026 17:01:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER   PROCEDURE [dbo].[spMarkRouteSeen]
    @Day DATE = NULL,
    @UserName NVARCHAR(128),
    @RideId INT,
    @CurrentHash INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Day IS NULL
        SET @Day = CAST(GETDATE() AS DATE);

    IF EXISTS (
        SELECT 1
        FROM dbo.RouteSeenState
        WHERE UserName = @UserName AND [Day] = @Day AND RideId = @RideId
    )
    BEGIN
        UPDATE dbo.RouteSeenState
        SET LastSeenAt = GETDATE(),
            LastSeenHash = @CurrentHash
        WHERE UserName = @UserName AND [Day] = @Day AND RideId = @RideId;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.RouteSeenState (UserName, [Day], RideId, LastSeenHash)
        VALUES (@UserName, @Day, @RideId, @CurrentHash);
    END
END;

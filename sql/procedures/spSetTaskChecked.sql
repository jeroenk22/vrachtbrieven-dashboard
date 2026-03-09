USE [TASK_DASHBOARD]
GO
/****** Object:  StoredProcedure [dbo].[spSetTaskChecked]    Script Date: 9-3-2026 17:01:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* =========================================================
   4) PROCEDURE: CHECK / UNCHECK (met commentaar)
   ========================================================= */
ALTER   PROCEDURE [dbo].[spSetTaskChecked]
    @OrdSubTaskNo INT,
    @Checked BIT,
    @CheckedBy NVARCHAR(128),
    @Comment NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TaskCheckEvent (OrdSubTaskNo, Checked, CheckedBy, Comment)
    VALUES (@OrdSubTaskNo, @Checked, @CheckedBy, @Comment);
END;

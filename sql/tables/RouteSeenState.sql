USE [TASK_DASHBOARD]
GO

/****** Object:  Table [dbo].[RouteSeenState]    Script Date: 9-3-2026 17:04:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RouteSeenState](
	[UserName] [nvarchar](128) NOT NULL,
	[Day] [date] NOT NULL,
	[RideId] [int] NOT NULL,
	[LastSeenAt] [datetime] NOT NULL,
	[LastSeenHash] [int] NOT NULL,
 CONSTRAINT [PK_RouteSeenState] PRIMARY KEY CLUSTERED 
(
	[UserName] ASC,
	[Day] ASC,
	[RideId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[RouteSeenState] ADD  CONSTRAINT [DF_RouteSeen_LastSeenAt]  DEFAULT (getdate()) FOR [LastSeenAt]
GO



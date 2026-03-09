USE [TASK_DASHBOARD]
GO

/****** Object:  Table [dbo].[TaskCheckEvent]    Script Date: 9-3-2026 17:04:27 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TaskCheckEvent](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[OrdSubTaskNo] [int] NOT NULL,
	[Checked] [bit] NOT NULL,
	[CheckedBy] [nvarchar](128) NOT NULL,
	[CheckedAt] [datetime] NOT NULL,
	[Comment] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[TaskCheckEvent] ADD  CONSTRAINT [DF_TaskCheckEvent_CheckedAt]  DEFAULT (getdate()) FOR [CheckedAt]
GO



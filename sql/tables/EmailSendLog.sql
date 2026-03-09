USE [TASK_DASHBOARD]
GO

/****** Object:  Table [dbo].[EmailSendLog]    Script Date: 9-3-2026 17:03:30 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[EmailSendLog](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[RideId] [int] NULL,
	[OrdSubTaskNo] [int] NULL,
	[MailType] [nvarchar](30) NOT NULL,
	[ToEmail] [nvarchar](254) NOT NULL,
	[Subject] [nvarchar](200) NULL,
	[AttachmentCount] [int] NOT NULL,
	[SentBy] [nvarchar](128) NOT NULL,
	[SentAt] [datetime] NOT NULL,
	[IsSuccess] [bit] NOT NULL,
	[ErrorMessage] [nvarchar](1000) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EmailSendLog] ADD  CONSTRAINT [DF_Email_AttCount]  DEFAULT ((0)) FOR [AttachmentCount]
GO

ALTER TABLE [dbo].[EmailSendLog] ADD  CONSTRAINT [DF_Email_SentAt]  DEFAULT (getdate()) FOR [SentAt]
GO



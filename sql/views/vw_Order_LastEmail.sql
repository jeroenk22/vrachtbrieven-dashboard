SELECT
  x.OrderId,
  x.SentAt AS LastEmailSentAt,
  x.SentBy AS LastEmailSentBy,
  x.MailType AS LastEmailType,
  x.ToEmail AS LastEmailTo
FROM
  (
    SELECT
      e.*,
      ROW_NUMBER() OVER (
        PARTITION BY
          e.OrderId
        ORDER BY
          e.SentAt DESC
      ) AS rn
    FROM
      dbo.EmailSendLog e
    WHERE
      e.IsSuccess = 1
  ) x
WHERE
  x.rn = 1;

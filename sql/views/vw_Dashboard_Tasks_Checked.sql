SELECT
  t.*,
  /* Dossier indicatoren (order-level, zichtbaar bij elke taak)*/
  CASE
    WHEN COALESCE(t.AantalFotos, 0) > 0 THEN 1
    ELSE 0
  END AS HeeftFotos,
  le.LastEmailSentAt,
  le.LastEmailSentBy,
  le.LastEmailType,
  le.LastEmailTo,
  /* Check-status (laatste event)*/
  COALESCE(lastCheck.Checked, 0) AS IsChecked,
  lastCheck.CheckedBy,
  lastCheck.CheckedAt,
  lastCheck.Comment AS CheckedComment
FROM
  dbo.vw_Dashboard_Tasks t
  LEFT JOIN dbo.vw_Order_LastEmail le ON le.OrderId = t.OrderId OUTER APPLY (
    SELECT
      TOP (1) e.Checked,
      e.CheckedBy,
      e.CheckedAt,
      e.Comment
    FROM
      dbo.TaskCheckEvent e
    WHERE
      e.OrdSubTaskNo = t.Taaknummer
    ORDER BY
      e.CheckedAt DESC
  ) lastCheck;

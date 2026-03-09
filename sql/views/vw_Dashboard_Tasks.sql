SELECT
  t.RideId AS Ritnummer,
  rs.Route,
  rs.RouteSortNumber,
  rs.RouteSortKey,
  rs.RideStartDatum,
  p.Name AS NaamChauffeur,
  v.LicenceNo AS Kenteken,
  v.Notes AS NaamAuto,
  t.OrdSubTaskNo AS Taaknummer,
  t.TaskType AS Type,
  t.TaskState AS Status,
  t.TaskProblem AS ProbleemStatusId,
  ps.ProblemStatusName AS ProbleemStatusNaam,
  c.Number AS Klantnummer,
  c.ComName AS Klantnaam,
  c.Email AS EmailAdresKlant,
  t.LocEmail AS TaakEmailAdres,
  pr.ProductCode AS Product,
  pr.ProductDescription AS ProductOmschrijving,
  o.OrderId,
  o.ClientNo,
  o.Amount AS Omzet,
  COALESCE(o.ImagesMobileCount, 0) AS AantalFotos,
  t.MomentATA AS AfgerondVan,
  t.MomentDone AS AfgerondTot,
  t.MomentPTA AS GeplandVan,
  t.MomentPTD AS GeplandTot,
  t.MomentETA AS GewenstVan,
  t.MomentETD AS GewenstTot,
  t.LocName AS Naam,
  t.LocStreet AS Adres,
  t.LocCity AS Plaats,
  t.Comments AS Commentaar,
  t.Notes AS Instructies,
  t.WaitUnits AS Wachttijd,
  t.ColliDescription AS Colliomschrijving,
  t.OpenFrom,
  t.OpenTo
FROM
  MENDRIXDB01.dbo.ordsubtask AS t
  INNER JOIN dbo.vw_Dashboard_Rides_Sort AS rs ON rs.RideId = t.RideId
  INNER JOIN MENDRIXDB01.dbo.Orders AS o ON o.OrderId = t.OrderId
  AND o.IsActive = 1
  AND o.Deleted = 0
  INNER JOIN MENDRIXDB01.dbo.clients AS c ON c.ClientNo = o.ClientNo
  LEFT OUTER JOIN MENDRIXDB01.dbo.Products AS pr ON pr.ProductId = o.ProductFid
  LEFT OUTER JOIN MENDRIXDB01.dbo.personal AS p ON p.PersonalNo = rs.OperatorId
  LEFT OUTER JOIN MENDRIXDB01.dbo.vehicles AS v ON v.VehNo = rs.VehicleId
  LEFT OUTER JOIN MENDRIXDB01.dbo.ProblemStatuses AS ps ON ps.ProblemStatusId = t.TaskProblem

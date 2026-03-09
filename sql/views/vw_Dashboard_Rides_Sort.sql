SELECT
  RideId,
  LTRIM (RTRIM (NameManual)) AS Route,
  COALESCE(AddressStartMomentPTA, AddressStartMomentPTD) AS RideStartDatum,
  OperatorId,
  VehicleId,
  CASE
    WHEN ISNUMERIC (
      LEFT (
        LTRIM (r.NameManual),
        PATINDEX ('%[^0-9]%', LTRIM (r.NameManual) + 'X') - 1
      )
    ) = 1 THEN CAST(
      LEFT (
        LTRIM (r.NameManual),
        PATINDEX ('%[^0-9]%', LTRIM (r.NameManual) + 'X') - 1
      ) AS INT
    )
    ELSE NULL
  END AS RouteSortNumber,
  RIGHT (
    '00000' + CAST(
      CASE
        WHEN ISNUMERIC (
          LEFT (
            LTRIM (r.NameManual),
            PATINDEX ('%[^0-9]%', LTRIM (r.NameManual) + 'X') - 1
          )
        ) = 1 THEN CAST(
          LEFT (
            LTRIM (r.NameManual),
            PATINDEX ('%[^0-9]%', LTRIM (r.NameManual) + 'X') - 1
          ) AS INT
        )
        ELSE 99999
      END AS VARCHAR(10)
    ),
    5
  ) + '|' + LTRIM (RTRIM (NameManual)) AS RouteSortKey
FROM
  MENDRIXDB01.dbo.Rides AS r

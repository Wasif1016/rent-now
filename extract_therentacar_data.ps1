$ratesFile = "temp_rentacar_rates.html"
$ratesContent = Get-Content $ratesFile -Raw -Encoding UTF8

$prices = @{}
$pattern = '(?s)<tr>\s*<td>\d+</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>'
$matches = [regex]::Matches($ratesContent, $pattern)

foreach ($match in $matches) {
    $name = $match.Groups[1].Value.Trim()
    $priceRaw = $match.Groups[2].Value.Trim()
    $price = $priceRaw -replace '[^\d]', ''
    if ($price) {
        $prices[$name.ToLower()] = $price
    }
}

$files = Get-ChildItem "temp_*.html" | Where-Object { $_.Name -notin @("temp_rentacar_rates.html", "temp_rentacar_pk.html", "temp_page.html") }
$results = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match '<meta property="og:title" content="(.*?)" />') {
        $title = $matches[1] -replace ' - .*', '' -replace 'For Rent In Islamabad', '' -replace 'For Rent In .*', ''
        $title = $title.Trim()
    } else {
        $title = "Vehicle"
    }

    if ($content -match '<meta property="og:image" content="(.*?)" />') {
        $imageUrl = $matches[1]
    } else {
        $imageUrl = ""
    }
    
    if (-not $imageUrl) { continue }

    $descMatches = [regex]::Matches($content, '(?s)<p>(.*?)</p>')
    $fullText = ""
    foreach ($m in $descMatches) {
        $text = $m.Groups[1].Value -replace '<[^>]+>', ''
        $text = $text.Trim()
        
        if ($text.Length -gt 20 -and $text -notmatch '^&nbsp;$') {
            $text = $text -replace '&nbsp;', ' '
            $text = $text -replace [char]160, ' '
            # Remove any non-ascii if needed, but lets just stick to whitespace normalization
            $text = $text -replace '\s+', ' '
            $fullText += " " + $text
        }
    }
    
    $words = $fullText.Split([char[]]@(' ', "`t", "`r", "`n"), [System.StringSplitOptions]::RemoveEmptyEntries)
    if ($words.Count -gt 20) {
        $description = ($words[0..19] -join " ")
    } else {
        $description = ($words -join " ")
    }
    
    if (-not $description) {
        $description = "Reliable car rental service offering best rates and comfortable experience."
    }

    $lowerTitle = $title.ToLower()
    $lowerFilename = $file.Name.ToLower()
    
    $brand = "Toyota" 
    $model = $title
    $type = "Sedan" 
    
    if ($lowerFilename -match "revo" -or $lowerTitle -match "revo") { $brand="Toyota"; $model="Revo"; $type="SUV" }
    elseif ($lowerFilename -match "vigo" -or $lowerTitle -match "vigo") { $brand="Toyota"; $model="Vigo"; $type="SUV" }
    elseif ($lowerFilename -match "land-cruser" -or $lowerTitle -match "land cruiser") { $brand="Toyota"; $model="Land Cruiser V8"; $type="SUV" }
    elseif ($lowerFilename -match "prado" -or $lowerTitle -match "prado") { $brand="Toyota"; $model="Prado"; $type="SUV" }
    elseif ($lowerFilename -match "grande" -or $lowerTitle -match "grande") { $brand="Toyota"; $model="Grande"; $type="Sedan" }
    elseif ($lowerFilename -match "altis" -or $lowerTitle -match "altis") { $brand="Toyota"; $model="Altis"; $type="Sedan" }
    elseif ($lowerFilename -match "corolla-gli" -or $lowerTitle -match "gli") { $brand="Toyota"; $model="Corolla GLI"; $type="Sedan" }
    elseif ($lowerFilename -match "civic" -or $lowerTitle -match "civic") { $brand="Honda"; $model="Civic"; $type="Sedan" }
    elseif ($lowerFilename -match "city" -or $lowerTitle -match "city") { $brand="Honda"; $model="City"; $type="Sedan" }
    elseif ($lowerFilename -match "brv" -or $lowerTitle -match "brv") { $brand="Honda"; $model="BRV"; $type="SUV" }
    elseif ($lowerFilename -match "grand-cabin" -or $lowerTitle -match "grand cabin") { $brand="Toyota"; $model="Grand Cabin"; $type="Van" }
    elseif ($lowerFilename -match "coaster" -or $lowerTitle -match "coaster") { $brand="Toyota"; $model="Coaster"; $type="Bus" }
    elseif ($lowerFilename -match "apv" -or $lowerTitle -match "apv") { $brand="Suzuki"; $model="APV"; $type="Van" }

    $price = ""
    foreach ($k in $prices.Keys) {
        if ($k.Contains($model.ToLower())) {
            $price = $prices[$k]
            break
        }
    }
    if (-not $price) {
        foreach ($k in $prices.Keys) {
             if ($model -eq "Corolla GLI" -and $k -match "gli") { $price = $prices[$k]; break }
             if ($model -eq "Civic" -and $k -match "civic") { $price = $prices[$k]; break }
             if ($model -eq "City" -and $k -match "city") { $price = $prices[$k]; break }
             if ($model -eq "Revo" -and $k -match "revo") { $price = $prices[$k]; break }
             if ($model -eq "Vigo" -and $k -match "vigo") { $price = $prices[$k]; break }
             if ($model -eq "APV" -and $k -match "apv") { $price = $prices[$k]; break }
             if ($model -eq "Grand Cabin" -and $k -match "grand cabin") { $price = $prices[$k]; break }
             if ($model -eq "Coaster" -and $k -match "coaster") { $price = $prices[$k]; break }
        }
    }

    $seats = "4"
    if ($type -eq "Van") { $seats = "13" }
    if ($model -eq "APV") { $seats = "7" }
    if ($model -eq "BRV") { $seats = "7" }
    if ($type -eq "Bus" -or $model -eq "Coaster") { $seats = "22" }
    if ($model -eq "Land Cruiser V8" -or $model -eq "Prado") { $seats = "7" }
    if ($model -eq "Revo" -or $model -eq "Vigo") { $seats = "5" }

    $obj = [PSCustomObject]@{
        title = $title
        description = $description
        year = ""
        mileage = ""
        brand = $brand
        model = $model
        type = $type
        city = "Rawalpindi"
        town = "Saddar"
        seats = $seats
        fuel = "Without Fuel"
        transmission = ""
        color = ""
        features = "AC|Music System|Bluetooth|Comfortable Seats"
        driver_option = "With_Driver"
        price_with_driver = ""
        price_self_drive = ""
        price_daily = $price
        price_monthly = ""
        price_within_city = ""
        price_out_of_city = ""
        image_urls = $imageUrl
        plate_number = ""
        business_location = ""
    }
    $results += $obj
}

if ($results.Count -gt 0) {
    if ($results.Count -gt 1) {
        # Sort by title to ensure deterministic order if file system order varies
        $results = $results | Sort-Object title
    }
    $results[0].business_location = "Al Amin Plaza, Ground Floor,, Mall Rd, Saddar, Rawalpindi, 46000, Pakistan"
}

$columns = @("title","description","year","mileage","brand","model","type","city","town","seats","fuel","transmission","color","features","driver_option","price_with_driver","price_self_drive","price_daily","price_monthly","price_within_city","price_out_of_city","image_urls","plate_number","business_location")

$results | Select-Object $columns | Export-Csv -Path "therentacar_vehicles.csv" -NoTypeInformation -Encoding UTF8

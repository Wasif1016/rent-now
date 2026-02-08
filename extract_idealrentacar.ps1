$urls = @(
    "https://idealrentacar.pk/product/changan-alsvin/",
    "https://idealrentacar.pk/product/suzuki-alto/",
    "https://idealrentacar.pk/product/honda-city-new-model-2023/",
    "https://idealrentacar.pk/product/haval-jolion/",
    "https://idealrentacar.pk/product/daihatsu-mira/",
    "https://idealrentacar.pk/product/toyota-vitz/",
    "https://idealrentacar.pk/product/honda-city/",
    "https://idealrentacar.pk/product/toyota-yaris/",
    "https://idealrentacar.pk/product/toyota-corolla-2020/",
    "https://idealrentacar.pk/product/honda-civic/",
    "https://idealrentacar.pk/product/toyota-revo/",
    "https://idealrentacar.pk/product/toyota-fortuner/",
    "https://idealrentacar.pk/product/kia-sportage/",
    "https://idealrentacar.pk/product/toyota-prado/"
)

$results = @()

foreach ($url in $urls) {
    if ($url -eq "https://idealrentacar.pk/product/toyota-corolla-2020/" -and (Test-Path "temp_ideal_corolla.html")) {
        $file = "temp_ideal_corolla.html"
    } else {
        $file = "temp_" + ($url -split "/")[-2] + ".html"
        if (-not (Test-Path $file)) {
            Invoke-WebRequest -Uri $url -OutFile $file
        }
    }
    
    $content = Get-Content $file -Raw -Encoding UTF8

    # Title
    if ($content -match '<h1 class="product_title entry-title">(.*?)</h1>') {
        $title = $matches[1].Trim()
    } else {
        $title = ($url -split "/")[-2] -replace '-', ' '
    }

    # Description
    $desc = ""
    $descRaw = $null
    if ($content -match '(?s)<div class="woocommerce-product-details__short-description">(.*?)</div>') {
        $descRaw = $matches[1] -replace '<[^>]+>', ' ' -replace '&nbsp;', ' ' -replace '\s+', ' '
    } elseif ($content -match '<meta name="description" content="(.*?)"\s*/>') {
        $descRaw = $matches[1]
    } elseif ($content -match '<meta property="og:description" content="(.*?)"\s*/>') {
        $descRaw = $matches[1]
    }

    if ($descRaw) {
        $descRaw = $descRaw.Trim()
        $descWords = $descRaw.Split([char[]]@(' '), [System.StringSplitOptions]::RemoveEmptyEntries)
        if ($descWords.Count -gt 20) {
            $desc = ($descWords[0..19] -join " ")
        } else {
            $desc = ($descWords -join " ")
        }
    }

    # Image
    if ($content -match '<meta property="og:image" content="(.*?)" />') {
        $imageUrl = $matches[1]
    } else {
        $imageUrl = ""
    }

    # Price
    $price = ""
    # Look for daily price specifically if possible, usually first price block
    if ($content -match '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#8360;</span>(.*?)</bdi></span>') {
        $price = $matches[1] -replace ',', '' -replace '\.00', ''
    }

    # Features Parsing
    $fuel = "Petrol"
    $transmission = "Automatic"
    $seats = "4"
    $year = ""
    $driver = "With Driver" # Default based on observation
    
    # Check simple text matches for features
    if ($content -match 'Fuel:\s*</label>\s*<span>(.*?)</span>') { $fuel = $matches[1].Trim() }
    if ($content -match 'Gearbox:\s*</label>\s*<span>(.*?)</span>') { $transmission = $matches[1].Trim() }
    if ($content -match 'Seats Capacity:\s*</label>\s*<span>(\d+)\s*Seats</span>') { $seats = $matches[1].Trim() }
    if ($content -match 'Car Year:\s*</label>\s*<span>(.*?)</span>') { $year = $matches[1].Trim() }
    if ($content -match 'Driver:\s*</label>\s*<span>(.*?)</span>') { $driver = $matches[1].Trim() }

    # Other Features
    $featuresList = @()
    # Regex to find all spans with class other-feature-item
    $otherFeaturesMatches = [regex]::Matches($content, '<span class="other-feature-item">(.*?)</span>')
    foreach ($m in $otherFeaturesMatches) {
        $featuresList += $m.Groups[1].Value
    }
    $features = $featuresList -join "|"
    if (-not $features) { $features = "AC|Music System|Bluetooth|Comfortable Seats" }

    # Brand/Model Logic
    $brand = "Toyota"
    $model = $title
    $type = "Sedan"
    
    $lowerTitle = $title.ToLower()
    
    if ($lowerTitle -match "^honda") { $brand = "Honda"; $model = $title -replace "Honda ", "" }
    elseif ($lowerTitle -match "^toyota") { $brand = "Toyota"; $model = $title -replace "Toyota ", "" }
    elseif ($lowerTitle -match "^suzuki") { $brand = "Suzuki"; $model = $title -replace "Suzuki ", "" }
    elseif ($lowerTitle -match "^daihatsu") { $brand = "Daihatsu"; $model = $title -replace "Daihatsu ", "" }
    elseif ($lowerTitle -match "^kia") { $brand = "KIA"; $model = $title -replace "KIA ", "" }
    elseif ($lowerTitle -match "^changan") { $brand = "Changan"; $model = $title -replace "Changan ", "" }
    elseif ($lowerTitle -match "^haval") { $brand = "Haval"; $model = $title -replace "Haval ", "" }

    if ($lowerTitle -match "sportage|fortuner|prado|land cruiser|revo|vigo|brv|jolion") { 
        $type = "SUV" 
        if ($seats -eq "4") { $seats = "5" } # SUVs usually 5 or 7
    }
    elseif ($lowerTitle -match "alto|mira|vitz") { $type = "Hatchback" }
    elseif ($lowerTitle -match "coaster") { $type = "Bus"; $seats = "22" }
    elseif ($lowerTitle -match "hiace|grand cabin|apv") { $type = "Van"; $seats = "13" }

    $obj = [PSCustomObject]@{
        title = $title
        description = $desc
        year = $year
        mileage = ""
        brand = $brand
        model = $model
        type = $type
        city = "Karachi"
        town = "Gulshan-e-Iqbal"
        seats = $seats
        fuel = $fuel
        transmission = $transmission
        color = ""
        features = $features
        driver_option = $driver -replace ' ', '_'
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
        $results = $results | Sort-Object title
    }
    $results[0].business_location = "Block-5A, Shop 01, Main Abul Hasan Isphani Road, Gulshan-e-Iqbal, Karachi, 75300, Pakistan"
    
    # Filter out empty columns
    $allProperties = $results[0].PSObject.Properties.Name
    $propertiesToKeep = @()
    
    foreach ($prop in $allProperties) {
        $hasValue = $false
        foreach ($item in $results) {
            if (-not [string]::IsNullOrWhiteSpace($item.$prop)) {
                $hasValue = $true
                break
            }
        }
        if ($hasValue) {
            $propertiesToKeep += $prop
        }
    }
    
    # Ensure specific order if properties exist
    $desiredOrder = @("title","description","year","mileage","brand","model","type","city","town","seats","fuel","transmission","color","features","driver_option","price_with_driver","price_self_drive","price_daily","price_monthly","price_within_city","price_out_of_city","image_urls","plate_number","business_location")
    $finalProps = @()
    foreach ($p in $desiredOrder) {
        if ($propertiesToKeep -contains $p) {
            $finalProps += $p
        }
    }
    # Add any remaining properties not in desired order (though shouldn't be any with current logic)
    foreach ($p in $propertiesToKeep) {
        if ($finalProps -notcontains $p) {
            $finalProps += $p
        }
    }

    $results | Select-Object $finalProps | Export-Csv -Path "idealrentacar_vehicles.csv" -NoTypeInformation -Encoding UTF8
}

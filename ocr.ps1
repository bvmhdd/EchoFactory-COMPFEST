11[System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime") | Out-Null
$asyncNoResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name.StartsWith('IAsyncAction') }
$asyncWithResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name.StartsWith('IAsyncOperation`1') }

function Await($async) {
    $paramType = $async.GetType().GetInterfaces() | Where-Object { $_.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
    if ($paramType) {
        $returnType = $paramType.GetGenericArguments()[0]
        $m = $asyncWithResult.MakeGenericMethod($returnType)
        return $m.Invoke($null, @($async)).Result
    } else {
        $m = $asyncNoResult
        $m.Invoke($null, @($async)).Wait()
    }
}

[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('id-ID'))
if (-not $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
}

$outText = ""
for ($i = 1; $i -le 28; $i++) {
    $imgPath = (Get-Item "page_$i.png").FullName
    $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath))
    $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
    $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
    $bmp = Await ($decoder.GetSoftwareBitmapAsync())
    $result = Await ($engine.RecognizeAsync($bmp))
    $outText += "=== PAGE $i ===`n" + $result.Text + "`n`n"
    Write-Host "Processed page $i"
}

Set-Content -Path 'booklet_winocr.txt' -Value $outText -Encoding UTF8

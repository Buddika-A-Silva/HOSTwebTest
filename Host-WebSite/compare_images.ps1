$tracked = Get-Content tracked_images_rel.txt | ForEach-Object { $_ -replace '^"|"$','' }
$trackedNames = $tracked | ForEach-Object { Split-Path -Leaf $_ } | Sort-Object
$all = Get-ChildItem -Recurse -File -Include *.png,*.jpg,*.jpeg,*.gif,*.svg
$allNames = $all | ForEach-Object { $_.Name } | Sort-Object
$trackedNames | Set-Content tracked_image_names.txt
$allNames | Set-Content all_image_names.txt
$untracked = Compare-Object $trackedNames $allNames -PassThru | Where-Object { $_ -notin $trackedNames }
$untracked | Set-Content untracked_image_names.txt
Write-Output "WROTE tracked_image_names.txt, all_image_names.txt, untracked_image_names.txt"
Write-Output "Untracked count: $(Get-Content untracked_image_names.txt | Measure-Object -Line).Lines"

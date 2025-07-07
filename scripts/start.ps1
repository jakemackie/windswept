param([switch]$Build)

$BUILD_FLAG = ""
if ($Build) {
    $BUILD_FLAG = "--build"
}

# Run docker with doppler secrets
Write-Host "🐳 Docker container starting..." -ForegroundColor Cyan
doppler run -- docker-compose --profile local up $BUILD_FLAG

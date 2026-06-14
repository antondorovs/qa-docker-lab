$testExitCode = 0

try {
    docker compose up --build --abort-on-container-exit --exit-code-from tests
    $testExitCode = $LASTEXITCODE
}
finally {
    docker compose down --remove-orphans

    if ($testExitCode -eq 0 -and $LASTEXITCODE -ne 0) {
        $testExitCode = $LASTEXITCODE
    }
}

exit $testExitCode

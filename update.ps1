# 更新线上版本：把本地改动提交并推送到 GitHub，自动触发重新发布
# 用法：powershell -ExecutionPolicy Bypass -File .\update.ps1
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

function Find-Git {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $roots = @("$env:LOCALAPPDATA\GitHubDesktop", "C:\Program Files\Git", "C:\Program Files (x86)\Git", "$env:LOCALAPPDATA\Programs\Git")
  foreach ($r in $roots) {
    if (Test-Path $r) {
      $hit = Get-ChildItem $r -Recurse -Filter git.exe -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($hit) { return $hit.FullName }
    }
  }
  throw "找不到 git.exe，请先安装 Git 或 GitHub Desktop。"
}

$git = Find-Git
$key = Join-Path $PSScriptRoot ".deploy\id_ed25519"
if (-not (Test-Path $key)) { throw "缺少部署密钥：.deploy\id_ed25519（换机器需要重新生成并添加 Deploy key）" }
$knownHosts = Join-Path $PSScriptRoot ".deploy\known_hosts"
$env:GIT_SSH_COMMAND = "ssh -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=`"$knownHosts`" -i `"$key`""
$env:GIT_TERMINAL_PROMPT = "0"

$changes = (& $git status --porcelain)
if (-not $changes) {
  Write-Host "没有新的改动，无需发布。" -ForegroundColor Yellow
  exit 0
}

& $git add -A
& $git -c user.name="sxfhdry" -c user.email="3401498350@qq.com" commit -m ("update: " + (Get-Date -Format "yyyy-MM-dd HH:mm"))
$push = Start-Process -FilePath $git -ArgumentList "push" -NoNewWindow -Wait -PassThru
if ($push.ExitCode -ne 0) { throw "推送失败，检查 .deploy 密钥是否还有写权限。" }

Write-Host ""
Write-Host "已推送，30–60 秒后自动生效： https://sxfhdry.github.io/fitplan/" -ForegroundColor Green
Write-Host "发布进度可在 Actions 页查看： https://github.com/sxfhdry/fitplan/actions" -ForegroundColor DarkGray

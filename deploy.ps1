# 一键部署到 GitHub Pages（需要先装 git 和 gh，并 gh auth login）
# 用法：
#   powershell -ExecutionPolicy Bypass -File .\deploy.ps1
#   powershell -ExecutionPolicy Bypass -File .\deploy.ps1 -Repo my-plan
param(
  [string]$Repo = "fitplan",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

function Fail([string]$msg) {
  Write-Host ""
  Write-Host $msg -ForegroundColor Yellow
  exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail "没有检测到 git。先安装：`n  winget install --id Git.Git -e`n装完新开一个终端再运行本脚本。"
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Fail "没有检测到 GitHub CLI。先安装：`n  winget install --id GitHub.cli -e`n装完新开一个终端再运行本脚本。"
}

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Fail "还没有登录 GitHub。先运行：`n  gh auth login`n（GitHub.com → HTTPS → Login with a web browser）"
}

$owner = (gh api user --jq .login).Trim()
Write-Host "GitHub 账号：$owner" -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
  Write-Host "初始化本地仓库…"
  git init -b main | Out-Null
}

git add -A
git -c user.name="fitplan" -c user.email="fitplan@users.noreply.github.com" commit -m "chore: 更新计划软件" *> $null

gh repo view "$owner/$Repo" *> $null
$exists = ($LASTEXITCODE -eq 0)

if (-not $exists) {
  Write-Host "创建仓库 $owner/$Repo …"
  gh repo create $Repo "--$Visibility" --source . --remote origin --push
} else {
  Write-Host "仓库已存在，推送更新…"
  git remote get-url origin *> $null
  if ($LASTEXITCODE -ne 0) {
    git remote add origin "https://github.com/$owner/$Repo.git"
  }
  git push -u origin main
}

Write-Host "启用 GitHub Pages（GitHub Actions 模式）…"
gh api -X POST "repos/$owner/$Repo/pages" -f build_type=workflow *> $null
if ($LASTEXITCODE -ne 0) {
  gh api -X PUT "repos/$owner/$Repo/pages" -f build_type=workflow *> $null
}

$url = "https://$owner.github.io/$Repo/"
Write-Host ""
Write-Host "完成，网址：$url" -ForegroundColor Green
Write-Host "首次发布约 30–60 秒，进度："
Write-Host "  https://github.com/$owner/$Repo/actions" -ForegroundColor DarkGray
Write-Host ""
Write-Host "手机打开上面的网址 → 添加到主屏幕 → 允许通知。" -ForegroundColor Green
Start-Process $url

# SteamRush - Push to GitHub Script
# This script will commit and push all your admin dashboard changes to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SteamRush GitHub Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "D:\Antigravity\Vibe Coding\steamrush-main"
Write-Host "✓ Changed to project directory" -ForegroundColor Green

# Set PATH to include Git
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Configure Git user (if not already configured)
Write-Host ""
Write-Host "Configuring Git user..." -ForegroundColor Yellow
git config user.email "sush8471@gmail.com"
git config user.name "Sushant"
Write-Host "✓ Git user configured" -ForegroundColor Green

# Check if we need to add files
Write-Host ""
Write-Host "Checking Git status..." -ForegroundColor Yellow
$status = git status --short

if ($status) {
    Write-Host "✓ Found files to commit" -ForegroundColor Green
    
    # Add all files
    Write-Host ""
    Write-Host "Adding files to staging..." -ForegroundColor Yellow
    git add .
    Write-Host "✓ Files staged" -ForegroundColor Green
    
    # Commit changes
    Write-Host ""
    Write-Host "Creating commit..." -ForegroundColor Yellow
    git commit -m "feat: Complete SteamRush website with admin dashboard

Admin Dashboard Features:
- Dark Mode OLED design with Fira Code/Sans fonts
- Sidebar navigation (Dashboard, Games, Orders, Settings)
- Real-time Supabase integration for all data
- Responsive mobile-friendly design

Dashboard Overview:
- 4 stats cards (games, orders, revenue, users)
- Recent activity feed and top games chart

Games Management:
- Full CRUD operations (Create, Read, Update, Delete)
- Search by title and filter by genre
- Toggle game availability
- Comprehensive edit form with genre/tag chips

Orders Management:
- Orders table with search and status filter
- Editable status dropdown
- WhatsApp contact integration
- Stats summary cards

Authentication:
- Supabase Auth integration
- Beautiful standalone login page
- Middleware protection for all /admin routes
- Session management with logout

UI Improvements:
- Added Admin link to main navbar
- Removed chatbot widget
- Added Fira fonts for modern typography

Documentation:
- Admin authentication setup guide
- Migration completion documentation"
    
    Write-Host "✓ Commit created successfully" -ForegroundColor Green
} else {
    Write-Host "✓ No new files to commit (already committed)" -ForegroundColor Green
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: https://github.com/sush8471/steamrush.git" -ForegroundColor Cyan
Write-Host ""

# Ask for confirmation before force push
Write-Host "⚠️  This will FORCE PUSH to your GitHub repository." -ForegroundColor Red
Write-Host "   This will overwrite any existing code on GitHub." -ForegroundColor Red
$confirmation = Read-Host "Do you want to continue? (yes/no)"

if ($confirmation -eq "yes") {
    git push -u origin main --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ SUCCESS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your code has been pushed to GitHub!" -ForegroundColor Green
        Write-Host "Repository: https://github.com/sush8471/steamrush" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "What's been pushed:" -ForegroundColor Yellow
        Write-Host "  ✓ Complete admin dashboard" -ForegroundColor White
        Write-Host "  ✓ Supabase authentication" -ForegroundColor White
        Write-Host "  ✓ Games management (CRUD)" -ForegroundColor White
        Write-Host "  ✓ Orders management" -ForegroundColor White
        Write-Host "  ✓ All documentation" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ✗ PUSH FAILED" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Possible issues:" -ForegroundColor Yellow
        Write-Host "  1. No internet connection" -ForegroundColor White
        Write-Host "  2. GitHub authentication required" -ForegroundColor White
        Write-Host "  3. Repository URL incorrect" -ForegroundColor White
        Write-Host ""
        Write-Host "Try:" -ForegroundColor Yellow
        Write-Host "  - Use GitHub Desktop (easier): https://desktop.github.com/" -ForegroundColor White
        Write-Host "  - Check your GitHub credentials" -ForegroundColor White
        Write-Host "  - Verify repository exists: https://github.com/sush8471/steamrush" -ForegroundColor White
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "Push cancelled. Your changes are committed locally but not pushed to GitHub." -ForegroundColor Yellow
    Write-Host "Run this script again when you're ready to push." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

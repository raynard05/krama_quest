Add-Type @"
using System;
using System.Runtime.InteropServices;

public class Win32 {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
    
    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }
}
"@

# Find emulator processes (typically qemu-system-x86_64 or emulator)
$processes = Get-Process | Where-Object { $_.ProcessName -like "*qemu*" -or $_.ProcessName -like "*emulator*" }

if ($processes.Count -eq 0) {
    Write-Host "No running emulator processes found."
    exit
}

foreach ($p in $processes) {
    $hWnd = $p.MainWindowHandle
    if ($hWnd -ne [IntPtr]::Zero) {
        Write-Host "Found window for process '$($p.ProcessName)' (PID: $($p.Id)) with title: '$($p.MainWindowTitle)'"
        $rect = New-Object Win32+RECT
        if ([Win32]::GetWindowRect($hWnd, [ref]$rect)) {
            $width = $rect.Right - $rect.Left
            $height = $rect.Bottom - $rect.Top
            
            # Fallback size if dimensions are invalid or minimized
            if ($width -le 0 -or $height -le 0) {
                $width = 450
                $height = 850
            }
            
            Write-Host "Repositioning window to (100, 100) on visible screen..."
            # SWP_NOZORDER = 0x0004, SWP_SHOWWINDOW = 0x0040
            $result = [Win32]::SetWindowPos($hWnd, [IntPtr]::Zero, 100, 100, $width, $height, 0x0040)
            if ($result) {
                Write-Host "Successfully moved emulator window to visible space!"
            } else {
                Write-Host "Failed to move window."
            }
        }
    } else {
        Write-Host "Process '$($p.ProcessName)' (PID: $($p.Id)) exists but window handle is zero."
    }
}

const { execSync, spawn } = require('child_process');

// AVD mapping configuration
const AVD_MAP = {
  'pxl10': 'Pixel_10_Pro',
  'pixel10': 'Pixel_10_Pro',
  'pxl5': 'Pixel_5',
  'pixel5': 'Pixel_5'
};

const arg = process.argv[2] || 'pxl10';
const avdName = AVD_MAP[arg.toLowerCase()] || arg;

console.log(`Targeting Android AVD: ${avdName}`);

// Helper to query running emulator serials and their AVD names
function getRunningEmulators() {
  try {
    const devicesOutput = execSync('adb devices').toString();
    const lines = devicesOutput.split('\r\n').join('\n').split('\n').map(line => line.trim());
    const emulators = [];
    
    for (const line of lines) {
      if (line.endsWith('device')) {
        const serial = line.split('\t')[0];
        if (serial.startsWith('emulator-')) {
          try {
            // Get AVD name for the emulator serial
            const avd = execSync(`adb -s ${serial} emu avd name`).toString().trim();
            emulators.push({ serial, avd });
          } catch (e) {
            emulators.push({ serial, avd: 'Unknown' });
          }
        }
      }
    }
    return emulators;
  } catch (e) {
    return [];
  }
}

// 1. Check if the emulator is already running
const running = getRunningEmulators();
const alreadyRunning = running.find(emu => emu.avd.toLowerCase() === avdName.toLowerCase());

let targetSerial = alreadyRunning ? alreadyRunning.serial : null;

if (alreadyRunning) {
  console.log(`Emulator "${avdName}" is already running on port ${targetSerial}.`);
} else {
  console.log(`Launching emulator "${avdName}" in the background...`);
  
  // Start emulator process in background detached
  const emulatorProcess = spawn('emulator', ['-avd', avdName], {
    detached: true,
    stdio: 'ignore'
  });
  emulatorProcess.unref();

  // Wait for emulator to register on adb
  console.log('Waiting for emulator to connect to ADB (max 45s)...');
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    // Sleep 1.5 seconds using PowerShell Start-Sleep
    execSync('powershell -Command "Start-Sleep -Milliseconds 1500"');
    const currentRunning = getRunningEmulators();
    const found = currentRunning.find(emu => 
      emu.avd.toLowerCase() === avdName.toLowerCase() || 
      !running.some(r => r.serial === emu.serial)
    );
    if (found) {
      targetSerial = found.serial;
      console.log(`Emulator connected on port: ${targetSerial}`);
      break;
    }
    attempts++;
  }

  if (!targetSerial) {
    console.log('Warning: Target emulator serial not detected. Proceeding to run Expo on default device.');
  } else {
    console.log('Waiting for emulator to complete booting...');
    try {
      execSync(`adb -s ${targetSerial} wait-for-device`);
      
      // Poll boot completed property
      let booted = false;
      let bootAttempts = 0;
      while (!booted && bootAttempts < 30) {
        const bootStatus = execSync(`adb -s ${targetSerial} shell getprop sys.boot_completed`).toString().trim();
        if (bootStatus === '1') {
          booted = true;
          console.log('Emulator fully booted!');
        } else {
          execSync('powershell -Command "Start-Sleep -Milliseconds 1000"');
          bootAttempts++;
        }
      }
    } catch (e) {
      console.log('Error checking emulator boot status, starting Expo anyway...');
    }
  }
}

// 2. Start Expo and target the specific serial using env
const env = { ...process.env };
if (targetSerial) {
  console.log(`Setting ANDROID_SERIAL=${targetSerial} to lock target device.`);
  env.ANDROID_SERIAL = targetSerial;
}

console.log('Starting Expo server...');
const expoProcess = spawn('npx', ['expo', 'start', '--android'], {
  stdio: 'inherit',
  shell: true,
  env
});

expoProcess.on('close', (code) => {
  process.exit(code);
});

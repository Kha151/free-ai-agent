import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

/**
 * Kiểm tra xem một CLI có sẵn trong PATH không.
 */
export async function isCliAvailable(cmd) {
  try {
    const check = process.platform === "win32" ? `where ${cmd}` : `which ${cmd}`;
    await execAsync(check);
    return true;
  } catch {
    return false;
  }
}

/**
 * Phát hiện môi trường hiện có trên máy.
 * Trả về object { docker, wsl, hyperV } với giá trị boolean.
 */
export async function detectEnvironments() {
  const [docker, wsl, hyperV] = await Promise.all([
    isCliAvailable("docker"),
    isCliAvailable("wsl"),
    // Hyper‑V có thể kiểm tra bằng PowerShell cmdlet Get‑VM
    (async () => {
      try {
        // PowerShell chạy trong Windows, dùng exec để gọi Get-VM
        await execAsync(`powershell -NoProfile -Command "Get-VM -ErrorAction SilentlyContinue"`);
        return true;
      } catch {
        return false;
      }
    })()
  ]);
  return { docker, wsl, hyperV };
}

/**
 * Chạy lệnh trong container Docker.
 * @param {string} container Tên hoặc ID của container.
 * @param {string} cmd       Lệnh Linux cần chạy.
 */
export async function runInDocker(container, cmd) {
  const safeCmd = cmd.replace(/(["`$\\])/g, "\\$1"); // escape quotes etc.
  const full = `docker exec ${container} ${safeCmd}`;
  try {
    const { stdout, stderr } = await execAsync(full);
    return { stdout, stderr };
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Chạy lệnh trong một distro WSL.
 * @param {string} distro Tên distro (default từ env KALI_WSL_DISTRO).
 * @param {string} cmd   Lệnh Linux.
 */
export async function runInWsl(distro, cmd) {
  const safeCmd = cmd.replace(/(["`$\\])/g, "\\$1");
  const full = `wsl -d ${distro} -- ${safeCmd}`;
  try {
    const { stdout, stderr } = await execAsync(full);
    return { stdout, stderr };
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Chạy lệnh trong VM Hyper‑V.
 * Yêu cầu PowerShell Remoting được bật và VM đang chạy.
 * @param {string} vmName Tên VM.
 * @param {string} cmd   Lệnh Windows hoặc Linux (nếu VM chạy Linux).
 */
export async function runInHyperV(vmName, cmd) {
  // Escape double quotes for PowerShell string.
  const escapedCmd = cmd.replace(/"/g, "`\"");
  const ps = `powershell -NoProfile -Command "Invoke-Command -VMName ${vmName} -ScriptBlock { ${escapedCmd} }"`;
  try {
    const { stdout, stderr } = await execAsync(ps);
    return { stdout, stderr };
  } catch (e) {
    return { error: e.message };
  }
}


# Tài Liệu Đã Học: Purity//FA Upgrades: Changing Purity//FA Version
- **File gốc**: `knowledge\uploads\purity__fa_upgrades_changing_purity__fa_version_2025-04-11-17-12-45.pdf`
- **Định dạng**: `.pdf`
- **Số từ**: ~949 từ
- **Thời gian học**: 2026-11-03T08:42:54.549Z

## Nội dung trích xuất
```text
Changing Purity//FA
Version
Generated on: 11 April 2025
1

-- 1 of 6 --

Contents
Changing Purity//FA Version . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
©2025 Copyright Pure Storage. All right reserved
2

-- 2 of 6 --

Changing Purity//FA Version
When a new array is received on-site, the Purity//FA version may not match the version that we want to
run on the customer site. This procedure is performed after the array has been powered on, but before
pureinstall or puresetup have been executed. If Purity//FA has already been started, you will not be
able to move to a Purity//FA version lower than the one that is currently running, and you will need to
contact Support.
Note:
This procedure is used during implementation time only, and it is not available or applicable on GA
production arrays.
Partner - Partner Note
Please open a case with Support to obtain the PPKG and SHA1 files for the desired Purity version.
1. Obtain the recommended POC Release, from Pure Storage Support.
a. You may want to take advantage of the situation to show the customer the upgrade
process and to receive the benefits of what the upgrade script does automatically. If so,
install a lower version of Purity than what was intended to be the final version the
customer will use. If that is the case, contact Pure Support to schedule the upgrade. If
not, skip this step.
2. Copy the files to a USB Drive. Ensure the USB is formatted as NTFS.
Note: Per Loading an Upgrade Bundle from USB to the Flasharray, new Purity releases
require more than 4 GB, and do not fit on a USB device using fat32. Newer Purity
releases support NTFS file systems on USB drives.
3. Insert the USB with the Purity//FA code on it in any slot on CT0.
4. If the array is running 4.8.0 or later, log in using the following credentials:
User: puresetup
Password (including spaces):
embind anecdota praiser obelize
©2025 Copyright Pure Storage. All right reserved
3

-- 3 of 6 --

5. Use the following command to find your disk in the list. The USB should appear as the last option,
probably /dev/sdb1 or /dev/sdb2
ls /dev/sd* -lrt
Note: Another way to find your USB device is to give it a label when you format it, and
then check /dev/disk/by-label to find it. You can then mount it using that path.
6. Mount the USB. The following is an example and will change based on the device address from
the previous step:
mount /dev/sdb1 /mnt
7. Confirm that the USB with Purity//FA code is mounted:
ls -l /mnt
8. Copy the purity_<version>_<build>.ppkg and purity_<version>_<build>.ppkg.sha1	purity_<version>_<build>.ppkg.sha1
files in the /home/puresetup directory on the array:
cp /mnt/purity_<version>* /home/puresetup
9. Confirm that the files have been moved:
ls -la /home/puresetup
10. Once the files have been moved, unmount the USB. This must be done before starting Purity on
versions prior to 4.8.
umount /mnt
11. Change directory to /home/puresetup, if not logged in as puresetup user:
cd /home/puresetup
12. Use the pureinstall command followed by the ppkg name to upgrade CT0:
puresetup@FlashArray-ct0:~# pureinstall purity_<version>_<build>.ppkg
Verifying package...
Installing on alternate partition labeled first
Erasing alternate firmware image.
WARNING: Do not interrupt this process!!
Unpacking new firmware
..................................................
©2025 Copyright Pure Storage. All right reserved
4

-- 4 of 6 --

..................................................
..................................................
..................................................
..................................................
..................................................
..................................................
..................................................
..................................................
..................................................
...........................
Finalizing installation. This may take several minutes.
Purity installed
Thank you, installation complete. New Purity will load at next reboot.
13. Verify the version that will be installed on the next Purity//FA boot with the pureboot command:
pureboot list
14. Reboot CT0
a. 4.0.18+: Use selective reboot command:
pureboot reboot --offline
b. Prior to 4.0.18 you use:
reboot
15. Repeat steps 3-14 on CT1.
16. You can now continue the Quick Install Guide, and proceed with puresetup newarrayon CT0,
and subsequently puresetup secondary on CT1.
17. Contact Pure Support to make sure that default tunables that are set by the upgrade script have
been successfully set on the FlashArray and that the array has been successfully rebooted.
©2025 Copyright Pure Storage. All right reserved
5

-- 5 of 6 --

© 2015-2025 Pure Storage® (“Pure”), Portworx® and associated its trademarks can be found here as and its virtual patent
marking program can be found here. Third party names may be trademarks of their respective owners. The Pure Storage
products and programs described in this documentation are distributed under a license agreement restricting the use,
copying, distribution, and decompilation/reverse engineering of the products. No part of this documentation may be
reproduced in any form by any means without prior written authorization from Pure Storage, Inc. and its licensors, if any.
Pure Storage may make improvements and/or changes in the Pure Storage products and/or the programs described in this
documentation at any time without notice. This documentation is provided "as is" and all express or implied conditions,
representations and warranties, including any implied warranty of merchantability, fitness for a particular purpose, or
non-infringement, are disclaimed, except to the extent that such disclaimers are held to be legally invalid. Pure shall
not be liable for incidental or consequential damages in connection with the furnishing, performance, or use of this
documentation. The information contained in this documentation is subject to change without notice.
©2025 Copyright Pure Storage. All right reserved
6

-- 6 of 6 --

```

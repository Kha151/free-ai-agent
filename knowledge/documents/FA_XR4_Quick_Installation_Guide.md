# Tài Liệu Đã Học: FA_XR4 Quick Installation Guide
- **File gốc**: `knowledge\uploads\FA_XR4_Quick_Installation_Guide.pdf`
- **Định dạng**: `.pdf`
- **Số từ**: ~3070 từ
- **Thời gian học**: 2026-11-03T08:42:05.096Z

## Nội dung trích xuất
```text
FlashArray//XR4 Quick Installation Guide
50-0091-00
purestorage.com

-- 1 of 18 --

© 2024 Pure Storage, the Pure P Logo, and the marks on the Pure Trademark List at
https://www.purestorage.com/legal/productenduserinfo.html are trademarks of Pure Storage, Inc. Other names are trademarks of
their respective owners..
The Pure Storage products and programs described in this documentation are distributed under a license agreement restricting
the use, copying, distribution, and decompilation/reverse engineering of the products. No part of this documentation may be
reproduced in any form by any means without prior written authorization from Pure Storage, Inc. and its licensors, if any. Pure
Storage may make improvements and/or changes in the Pure Storage products and/or the programs described in this
documentation at any time without notice.
THIS DOCUMENTATION IS PROVIDED "AS IS" AND ALL EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND
WARRANTIES, INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
OR NON-INFRINGEMENT, ARE DISCLAIMED, EXCEPT TO THE EXTENT THAT SUCH DISCLAIMERS ARE HELD TO BE
LEGALLY INVALID. PURE STORAGE SHALL NOT BE LIABLE FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES IN
CONNECTION WITH THE FURNISHING, PERFORMANCE, OR USE OF THIS DOCUMENTATION. THE INFORMATION
CONTAINED IN THIS DOCUMENTATION IS SUBJECT TO CHANGE WITHOUT NOTICE.
Pure Storage, Inc.
2555 Augustine Dr
Santa Clara, CA 95054
http://www.purestorage.com
Direct comments to DocumentFeedback@purestorage.com.

-- 2 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	3 	May 2, 2024
Change Log
Document Version 	Major Changes
50-0091-00 	New document. Ports diagram shows latest R4b board revision.

-- 3 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	4 	May 2, 2024
Contents
Conventions and Guidelines 	5
Document Conventions 	5
Safety and Handling Guidelines 	5
Before You Begin 	6
Contacting Customer Support 	6
Estimated Installation Time 	6
Preparing For Installation 	7
1. Unpack the FlashArray//XR4 	8
2. Install the FlashArray//XR4 To the Rack 	9
3. Install DirectFlash Modules or Blanks to the FlashArray//XR4 	12
4. Connect Cables to the FlashArray//XR4 	13
Install and Power On Any DirectFlash Shelf 	14
5. Unpack and Install a DirectFlash Shelf (if Present) 	14
Complete the FlashArray//XR4 Installation 	15
6. Power On the FlashArray//XR4 	15
7. Check FlashArray//XR4 LEDs After Powering On 	16
8. Install the Optional Bezel 	17

-- 4 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	5 	May 2, 2024
Conventions and Guidelines
Document Conventions
Each note in this guide is preceded by one of the following icons:
Symbol 	Meaning
Potential for injury, physical damage, or loss of data or array configuration information
Supplementary instruction
Best practice
For your information
( Login access or assistance from Pure Storage Technical Support required
Safety and Handling Guidelines
If this equipment is used in a manner not specified by the manufacturer, the protection provided
by the equipment might be impaired.
Avoid contact with backplane components and connectors.
Disconnect all power cords before moving the chassis and shelves or performing any powered-
off service operation.
Verify that rack electrical distribution systems meet all safety requirements of UL 62368-1 and
IEC 62368-1 when fully populated, and that they provide adequate 100-240V 50-60Hz AC power,
overcurrent protection, and electrical ground for all installed equipment.
Verify that all electrical connections are grounded before powering on.
Do not open chassis or shelf enclosures, or any component unless you are a qualified service
representative performing a service procedure in accordance with instructions published by Pure
Storage.
Do not use the controller or PSU handles to lift a chassis. Use the attachable chassis lift handles.
When servicing rack-mounted equipment, extend only one chassis at a time.
Do not insert anything into any FlashArray connector except as specified in installation or repair
instructions.
Be careful when disconnecting cables. The connector casing might be hot.
Ensure that all components are in place before powering on or operating an array.
Leave failed components in place until replacements are available.

-- 5 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	6 	May 2, 2024
Before You Begin
Before installation, refer to FlashArray, FlashArray//XL, and DirectFlash Shelf Safety and
Compliance.
l Recommended clearance for the front (cold aisle) is 91.5 cm (36 in.). The minimum requirement
is 81.5 cm (32 in.).
l Recommended clearance for the rear (hot aisle) is 91.5 cm (36 in.). The minimum requirement
is 61 cm (24 in.).
l No special clearance is required on top, bottom, or sides.
l Recommended front-to-rear clearance for rack posts is 74 cm (29 in.) (the default on most
racks). Minimum is 61 cm (24 in.), Maximum is 81.25 cm (32 in.).
Contacting Customer Support
For assistance, contact Pure Storage Technical Services. You can reach support the following ways:
l Visit https://support.purestorage.com
l Email support@purestorage.com
l Call (800) 379-7873 in the U.S. For international support, see https://support.purestorage.com
Support is available 24 hours a day, seven days a week.
Estimated Installation Time
You should be able to install the system in approximately 1 hour and 15 minutes.

-- 6 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	7 	May 2, 2024
Preparing For Installation
The FlashArray//XR4 chassis weighs up to 44 kg (97 lbs.). A DirectFlash Shelf weighs 39.8 kg
(85.8 lbs.). Make arrangements for safe lifting during installation.
Make sure you install drive modules or blanks after rack mounting each chassis. The
FlashArray//XR4 chassis with drive modules installed weighs up to 44 kg (97 lbs).
Mount heavier equipment lower in the rack.
Make sure that the rack can support the total weight of all installed equipment including cables
and rails (approximately 48.5 kg or 107 lbs.), and that the total weight is within the floor loading
limit.
Have all necessary Fibre Channel and Ethernet cables (not supplied by Pure Storage) available.
Verify that you have 3RU (13.3 cm or 5.25 in.) of vertical rack space for each FlashArray//XR4
chassis and 3RU for each DirectFlash Shelf chassis.
Verify that the installation environment meets the following conditions:
l It is within the operating temperature range of 5 - 35°C.
l It does not have airflow ducts aimed directly at any FlashArray chassis, controller, or shelf.
Have a local console (VGA monitor and USB keyboard or a computer with terminal emulation cap-
ability) available in case it is required for software configuration or diagnosis.
Make sure that cable lengths are adequate by mounting the chassis and shelves in a contiguous
stack.
Before unpacking, inspect packages for shipping damage. If damage is present, photograph it
and contact Pure Technical Services before proceeding.
Save cartons and packing material in case return shipment to Pure Storage is necessary.

-- 7 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	8 	May 2, 2024
1. Unpack the FlashArray//XR4
Verify that the FlashArray//XR4 package contains the items shown in Figure 1.
Figure 1. Unpacking the FlashArray//XR4
1
Open Me First box: u Torx and Phillips drivers,
v this Quick Installation Guide, wEnd User Agreement,
Passed/Refreshed sheet, Safety and Compliance
document.
4 Open Me Last boxes: DFMe DirectFlash Modules
2 Rack-mount rails (two) and optional bezel. 	5 Accessory Kit: u Two C13-C14 power cords,
v 5 screws and 4 cage nuts for rack mounting.
3 Chassis includes 2 FlashArray//XR4 controllers
and 2 power supplies.

-- 8 of 18 --

FlashArray//XR4 Quick Installation Guide
50-0091-00 	9 	May 2, 2024
2. Install the FlashArray//XR4 To the Rack
1. (Square-hole racks only) Install the #10-
32 cage nuts (from the Rail Kit) on a
front rack post, as shown in Figure 2.
Optionally us

... (nội dung tiếp tục được lưu trong file gốc) ...
```

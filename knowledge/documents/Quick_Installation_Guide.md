# Tài Liệu Đã Học: Quick Installation Guide (General)
- **File gốc**: `knowledge\uploads\Quick_Installation_Guide.pdf`
- **Định dạng**: `.pdf`
- **Số từ**: ~3369 từ
- **Thời gian học**: 2026-11-03T08:43:07.029Z

## Nội dung trích xuất
```text
FlashArray//XR2 and //XR3 Quick Installation Guide
Before You Begin
Recommended clearance for the front (cold aisle) is 91.5 cm
(36 in.). The minimum requirement is 81.5 cm (32 in.).
Recommended clearance for the rear (hot aisle) is 91.5 cm
(36 in.). The minimum requirement is 61 cm (24 in.).
No special clearance is required on top, bottom, or sides.
Recommended clearance for rack posts is 74 cm (29 in.) (the
default on most racks). Minimum is 61 cm (24 in.), Maximum
is 81.25 cm (32 in.).
Document Conventions
Symbol 	Meaning
Potential for injury, physical damage, or loss of data
or array configuration information
Supplementary instruction
Best practice
For your information
Safety and Handling
Before you install the system, refer to FlashArray,
FlashArray//XL, and DirectFlash Shelf Safety and Com-
pliance.
Contacting Customer Support
For assistance, contact Pure Technical Services. You can
reach support the following ways:
l Visit https://support.purestorage.com
l Email support@purestorage.com
l Call (800) 379-7873 in the U.S. For international sup-
port, see https://support.purestorage.com
Support is available 24 hours a day, seven days a week.
Estimated Installation Time
You should be able to install the FlashArray in approximately
one hour and 15 minutes.
Preparing for Installation
The FlashArray chassis weighs up to 44 kg (97 lbs.) and
DirectFlash Shelves weigh 39.8 kg (85.8 lbs.). Make
arrangements for safe lifting during installation.
Make sure you install DirectFlash Modules, Flash Mod-
ules, or blanks after rack mounting each chassis. The
FlashArray chassis with modules installed weighs up to
44 kg (97 lbs.).
Make sure that the rack can support the total weight of all
installed equipment including cables and rails (approx-
imately 48.5 kg or 107 lbs.), and that the total weight is
within the floor loading limit.
Have all necessary Fibre Channel and Ethernet cables
(not supplied by Pure Storage) available.
Verify that front and rear rack mounting posts are
between 61 and 81.25 cm (24-32 in.) apart, and that you
have 3 RU (13.3 cm or 5.25 in.) of vertical rack space for
each FlashArray chassis or DirectFlash Shelf.
Verify that the installation environment
l Is within the operating temperature range of 5-35°C.
l Does not have airflow ducts aimed directly at any
FlashArray chassis, controller, or shelf.
Have a local console (VGA monitor and USB keyboard
or a computer with terminal emulation capability) avail-
able in case it is required for software configuration or
diagnosis.
Make sure that cable lengths are adequate by mounting
the FlashArray chassis and shelves in a contiguous
stack as shown in the DirectFlash Shelf Quick Install-
ation Guide.
Before unpacking, inspect packages for shipping dam-
age. If damage is present, photograph it and contact
Pure Storage Technical Support before proceeding.
Save cartons and packing material in case return ship-
ment to Pure Storage is necessary.
1. Unpack the FlashArray
Verify that the FlashArray package contains the items shown in Figure 1.
Figure 1. Unpacking the FlashArray
1 Open Me First box: u Torx driver, v Quick Installation
Guide, w DirectFlash or SAS cables, if shelves ordered 4 FlashArray//XR3 chassis, includes 2 power supplies,
2 controllers, and 2 or 4 NVRAM modules
2 End User Agreement, Passed/Refreshed sheet,
Safety and Compliance document 5 Open Me Last box contains 10 DirectFlash modules, 10
Flash modules, or 10 blanks
3 Rails and optional bezel 	6 Accessory Kit: u 2 C13-C14 power cords, v KVM cable,
w Phillips screwdriver, x 5 screws, 3 cage nuts
40-0235-03 	Page 1 of 6

-- 1 of 6 --

Planning the Installation
Mount heavier equipment lower in the rack. A fully loaded FlashArray chassis weighs up to 44 kg (97 lbs.). If possible, install
the chassis below other devices in the rack.
2. Install the Rails
1. (Square-hole racks only) Install the #10-32 cage nuts (from
the Accessory Kit) on the front of the rack, as shown in Fig-
ure 2. Optionally use a flathead screwdriver to wedge the
cage nut into position. See u in Figure 2.
Install the cage nut 3 holes up from where the rail bottom
will be. See v in Figure 2.
On round-hole racks, use clip nuts (not provided by Pure
Storage, Inc.) instead of cage nuts.
The FlashArray includes two rails, labeled right and left.
The rails have locating pins (for square- and round-hole
racks) or positioning studs (visible if you unscrew and
remove the locating pins for threaded-hole racks) that you
align with the holes in the rack.
2. Install one of the two rails (the installation order does not
matter) by pulling the spring-loaded lever back and insert-
ing the locating pins or positioning studs in the front mount-
ing post at the desired height. Release the lever once the
rail is in place. See Figure 3.
3. Extend the rear of the rail until the locating pins or pos-
itioning studs reach the rear mounting post, and press the
rail into the rear post until the latch engages. See Figure 4
(left rail shown).
Install the rear screws only. Front screws are installed
later.
4. (All rack types) Secure the rear of each rail to the rack with
the screws provided in the Accessory Kit. One screw is
provided for the rear of each rail. Use the second or fifth
hole up from the bottom of each rail (shown going into the
fifth hole on Figure 4).
5. Repeat 1–4 above to install the second rail.
Make sure to install the rear of each rail into the post holes
that are at the same height as the holes being used on the
front post. Otherwise, the chassis might slide off the rails
causing personal injury and damage to the FlashArray.
Figure 2. Installing Cage Nuts
Figure 3. Installing a Rail (Front Post)
Figure 4. Installing a Rail (Rear Post)
3. Mount the Chassis in the Rack
The FlashArray chassis weighs up to 44 kg (97 lbs.) before you install DirectFlash Modules or blanks. Make arrangements
for safe lifting during installation. Pure Storage recommends two people for this procedure.
1. Remove the chassis from the antistatic bag.
2. With one person on each side, lift the chassis by the handles and slide it onto the rails until the rear handles are two inches
from touching the rack.
3. Support the front of the chassis while resting the rear on the rails, and then remove each rear handle. Pull the spring-
loaded plunger on the handle and then slide the handle down. See u on Figure 5.
4. Continue to slide the chassis on the rails until the front handles are two inches from touching the rack.
5. Continue to support the front of the chassis as you remove the front handles. See v on Figure 5.
Figure 5. Mounting Chassis in Rack
FlashArray//XR2 and //XR3 Quick Installation Guide
40-0235-03 	Page 2 of 6 	October 18, 2022

-- 2 of 6 --

3. Mount the Chassis in the Rack (Cont'd)
6. Slide the chassis completely into the rack so that the
chassis ears are flush with the front of the rack and the
slam latches lock into place. See Figure 6.
7. (Square- and round-hole racks only) Secure the front of
each rail to the rack and chassis with the screws
provided in the Accessory Kit. One screw is provided for
each rail front.
To install the screws, open both slam latches on the
chassis front panel and thread the screws (see u on
Figure 7) through each slam latch hole to the cage nut
or clip nut that you installed to the rack post (see v on
Figure 7).
(Threaded-hole racks only) Secure the front of each rail
to the rack with screws that fit the rack's threaded holes.
For example, if the rack has #10-32 threads, you can
use the screws provided in the Accessory Kit. If the rack
has threads of another size, you must obtain matching
screws.
8. Tighten the screws and then close the slam latches.
Figure 6. Mounted Chassis
Figure 7. Securing Front of Rail
4. Install DirectFlash Modules, Flash Modules, or Blanks
Install DirectFlash Modules, Flash Modules, or blanks in groups of 10. Do not alternate module types. DirectFlash Module
and Flash Module labels show the capacity in terabytes (see Figure 8).
Make sure all un

... (nội dung tiếp tục được lưu trong file gốc) ...
```

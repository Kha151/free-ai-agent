# Tài Liệu Đã Học: General FlashArray Hardware Reference Knowledge
- **File gốc**: `knowledge\uploads\general_flasharray_hardware_reference_knowledge_for_a_first_new_install_2025-04-11-17-16-10.pdf`
- **Định dạng**: `.pdf`
- **Số từ**: ~2268 từ
- **Thời gian học**: 2026-11-03T08:42:39.488Z

## Nội dung trích xuất
```text
Knowledge for a First
New Install
Generated on: 11 April 2025
1

-- 1 of 9 --

Contents
Knowledge for a First New Install . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Prerequisites . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Support Email Template . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Preparation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
On Site Documentation Review . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Installation Preparation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Articles. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Notes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Installation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
Post Install . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
Customer Follow-up . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
©2025 Copyright Pure Storage. All right reserved
2

-- 2 of 9 --

Knowledge for a First New Install
New Install (Single System)
If you have any questions, please reach out to the Pure Storage account team.
Prerequisites
Pre-Install Checklist
Download this Pre-install checklist spreadsheet and review it with your customer. The checklist helps
customers prepare their site. Please put the AE/SE from Pure on cc when you are emailing your customer.
This document is for a single array install. If you need replication, please visit this page (Replication), and
make sure the customer has all the design and planning for this in place. Please also notify support about
this since they can do saturation tests on the replication network.
Please review with the customer what contacts they want, and how Pure support should reach out to
them. Questions that you should ask your customer and report to the account team:
1. Do they have a function like infra@customer.com that they want the emails to come to?
2. Specific people that maybe need cc on the support email?
3. How should we tag people in our internal system? Technical, Manager, Sales etc.?
4. Is this a dark site?
5. Do we need to have any special handling instructions?
6. Who will be Pure1 admin?
Note:
A minimum of two weeks before going to the customer site, please send an email to
support@purestorage.com telling them that the install is coming up.
Support Email Template
Partner - Partner Note
©2025 Copyright Pure Storage. All right reserved
3

-- 3 of 9 --

Suggested template:
“Hello Pure Support. My name is NAME, and I will do a new install of a Flasharray at customer
CUSTOMER. I will be there at this date 202*-**-** between 9-12 I would like to have a support
agent that can do Health checks and if I’m in need of any assistance, I would like to know who to
reach out to.
This is my email: EMAIL This is my phone number: PHONE NUMBER."
Tip: If the customer is a VMware customer you would also like to include “Please upgrade HTML5
plugin to the latest available GA” in that support case. If you want to use the internal one. The
external OVA you can find further down in this document.
If support@purestorage.com is not responding, please send an email to case-
escalation@purestorage.com with the case number.
To call, use this list of international numbers: Contact Us
Please also share the international numbers and the email for escalation to the customer.
Preparation
Please make sure you have the following before going to the customer:
• Support case number
• Enterprise Ready release of Purity firmware (not mandatory) this should be on a FAT32 formatted
USB stick minimum 4GB.
• If you are using 6.3 or above then 6GB+ USB with with ExFAT, NTFS, EXT2, EXT3.
• Documentation on how to install FlashArray (or this document).
• Confirm with the account team that the customer is set-up in Pure internal systems according to
your interview with the customer.
• Instructions to connect a laptop to a Pure FlashArray; Console.pdf.
• Basically 115200 baud 8 bits, No Parity, 1 stop bit.
• Optional: Connect monitor and USB typing board (note that clipboard operations will not work).
©2025 Copyright Pure Storage. All right reserved
4

-- 4 of 9 --

On Site Documentation Review
After installation and with the customer, review the GUI and PURE1 and explain the basics. (This demo can
be done remotely if needed). Also present the cellphone app. What we also want to share with your
customers is some pages where they can find information.
Review the following documentation with the customer:
• Pure Storage Customer Support Guide
• Contact Us
• Knowledge Base
• Solutions
Installation Preparation
Note that you don’t have to connect cables to the array. It can be installed on your desk without anything
connected. After the installation you can move it to the data center.
Articles
• Quick Installation Guide: FlashArray//XR2 and //XR3 Quick Installation Guide
• Quick Installation Guide: FlashArray//XR4 Quick Installation Guide
• More Information About Puresetup: Purity User Info: puresetup
• FAT32 (for version below 6.1 if you are running 6.3 and greater, the USB has to be 6GB+, so
mandatory with ExFAT, NTFS, EXT2, EXT3, EXT4) FlashArray Installation: Changing Purity//FA
Version on a New FlashArray
Notes
Note:
Please make sure to reboot the controllers before running “puresetup newinstall” if you have
upgraded the system. This upgrade procedure is ONLY if the system is not installed. If the system
is installed already or in production, you MUST use another procedure and files. Do NOT attempt
to upgrade the system with purity_version.PPKG if it’s already installed or in production.
©2025 Copyright Pure Storage. All right reserved
5

-- 5 of 9 --

This upgrade can be a good exercise to do this after install. It tests support + all the connectivity to
ascertain that everything is working like expected.
Installation
Use the Pre-Install Checklist that you prepared before going to the datacenter as you go through these
steps.
1. Connect the console to CT0 that is the TOP controller and get prompt.
2. Enter puresetup.
3. Copy and paste this password:
embind anecdota praiser obelize
4. Run:
hardware_check.py
Note:
//XR4 models run: cobalt_check.py.
5. Inspect the script results and make sure the results are satisfactory.
6. If this is a XR4 model and the commands fail, there might be ongoing Firmware upgrades in the
background. Do not pull the power or reboot. Let the firmware upgrades finish and then try again.
This can take about 20 minutes.
7. Run:
puresetup newarray --skip-connectivity-tests
Note:
--skip skips some connectivity tests that take some time to fail if the array can’t access the
internet. With live internet then it’s recommended not to add the --skip flag.
1. Possible NVME firmware upgrades may take a couple of minutes.
2. If prompted: Configure Rapid Data Locking? Select No in 99.9% of cases.
3. The installation will ask you to type continue and hit enter. Type CONTINUE.
4. Wait on a reply. Press ENTER again if nothing happens after 3 minutes.
©2025 Copyright Pure Storage. All right reserved
6

-- 6 of 9 --

5. Enter all the configuration parameters.
6. Prompt: "Would you like to save this configuration?" Select YES, if everything is correct.
7. Change your time zone.
8. The system kicks off an automatic restart.
9. In case it asks you for “Set new password” do that. (The old user is pureuser).
10. 

... (nội dung tiếp tục được lưu trong file gốc) ...
```

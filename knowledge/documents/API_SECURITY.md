# Tài Liệu Đã Học: API_SECURITY.pdf
- **File gốc**: `knowledge\uploads\API_SECURITY.pdf`
- **Định dạng**: `.pdf`
- **Số từ**: ~2419 từ
- **Thời gian học**: 2026-11-03T08:36:01.907Z

## Nội dung trích xuất
```text
API SECURITY
The Complete, Proactive API Security Platform

-- 1 of 8 --

Table of contents
User Interface Admin Guide > Managing UI Users
Managing Teams, Users, and Service Accounts
Overview
Managing Teams
Managing Users
SaaS Support Email Addresses
Adding Users
Managing Users
Managing Service Accounts
Service Account Access
Actions for Service Accounts
Copying Your Client ID and Secret
Generating a Service Account Access Token
System Service Accounts
3
3
3
4
4
4
5
6
6
6
6
7
7
© Copyri ght 2026 Aka ma i Technol ogi es . Al l ri ghts res erved.
Page: 2

-- 2 of 8 --

Overview
The Se tti n g s > U s e r Ma n a g e m e n t	Se tti n g s > U s e r Ma n a g e m e n t area enables administrators to control how users access and interact with the
system.
Key actions you can perform include:
Configure teams to control which API groups, incidents, and findings users can access.
When Active Testing is enabled, teams also control access to Active Testing applications.
Use roles and permissions to define what actions users can perform and which areas of the UI they can
access.
Create and manage users, assigning them to teams and roles.
Create and manage service accounts, which provide API-only access (no UI access).
Configure SSO / SAML Integration to enable SSO authentication and manage identity providers.
Additionally, the Se tti n g s > Au d i t L o g	Se tti n g s > Au d i t L o g page provides an audit report for all user actions performed in the UI. You can
create workflows to email or process these logs, although audit log entries cannot trigger prevention or ticketing
workflows.
Many security and compliance settings also affect user experience and access control.
Managing Teams
Teams control user visibility into specific API groups, incidents, and findings.
Each user is assigned to one or more teams.
They can be logged in under only one team at a time.
The a d m i n s	a d m i n s team is preconfigured with access to all API groups and cannot be modified.
Create, edit, and delete custom teams from Se tti n g s > U s e r Ma n a g e m e n t > Te a m s	Se tti n g s > U s e r Ma n a g e m e n t > Te a m s .
Team names can be up to 50 characters.
Managing Teams, Users, and Service
Accounts
Permission Requirement	Permission Requirement
Access to this page requires Te a m s	Te a m s permission. See Pe rm i s s i o n R e fe re n ce	Pe rm i s s i o n R e fe re n ce .
© Copyri ght 2026 Aka ma i Technol ogi es . Al l ri ghts res erved.
Page: 3

-- 3 of 8 --

Managing Users
You can add, edit, or delete users on the Se tti n g s > U s e r Ma n a g e m e n t > U s e rs	Se tti n g s > U s e r Ma n a g e m e n t > U s e rs page.
All user activities are recorded in the Audit Log. In the Audit Log, view user activity, export the activity records, and/or
route them to workflows.
SaaS Support Email Addresses
Your SaaS server deployment includes the following default user accounts required for maintenance, troubleshooting,
and diagnostics.
m a i n te n a n ce _ vi e w @a ka m a i .co m	m a i n te n a n ce _ vi e w @a ka m a i .co m - Maintenance with Viewer role.
m a i n te n a n ce @a ka m a i .co m	m a i n te n a n ce @a ka m a i .co m - Maintenance with Contributor role.
s u p p o rt@a ka m a i .co m	s u p p o rt@a ka m a i .co m - Maintenance with Admin role.
These accounts cannot be edited or deleted.
The initial admin user account is d e fa u l t@a ka m a i .co m	d e fa u l t@a ka m a i .co m . If you have another admin user, you can safely delete this
account.
You can enable or disable these accounts in Configuring Support Access .
Adding Users
Active Testing	Active Testing
When Active Testing is enabled, team configuration also determines access to Active Testing applications. Use
the Ap p l i ca ti o n s	Ap p l i ca ti o n s tab when editing a team to define application access.
First User	First User
The first admin user is created during deployment. If this user cannot log in, contact Akamai
support.
Access to this page requires U s e rs	U s e rs permission, as well as (minimally) Read permission for
Te a m s	Te a m s and R o l e s	R o l e s . See Pe rm i s s i o n R e fe re n ce	Pe rm i s s i o n R e fe re n ce .
© Copyri ght 2026 Aka ma i Technol ogi es . Al l ri ghts res erved.
Page: 4

-- 4 of 8 --

1. In Se tti n g s > U s e r Ma n a g e m e n t > U s e rs	Se tti n g s > U s e r Ma n a g e m e n t > U s e rs , select C re a te U s e r	C re a te U s e r . The Create User pane appears.
Wh e n u s i n g Aka m a i SSO, e n s u re u s e rs a re co n fi g u re d w i th Ad va n ce d R BAC .	Wh e n u s i n g Aka m a i SSO, e n s u re u s e rs a re co n fi g u re d w i th Ad va n ce d R BAC .
2. Enter a unique username, up to 50 characters (SSO users are exempt).
3. Optionally enter a job title.
4. Optionally add/create tags for the user.
5. Create a list of teams and corresponding roles for the user. If a user has more than one team/role
combination, they can switch between teams/roles within the UI.
Teams control the APIs the user can view / manage.
Roles control the UI pages / actions the user can view / perform.
6. Select Sa ve	Sa ve . The UI generates a registration link.
7. Send this link to the user to complete registration.
Users remain Pe n d i n g R e g i s tra ti o n	Pe n d i n g R e g i s tra ti o n until they complete this step and can be deleted if
necessary. After registering, the user is R e g i s te re d	R e g i s te re d .
You can regenerate the registration link on the Users page.
Managing Users
Ed i t	Ed i t - Modify the user's job title, tag(s), team(s), and role(s).
D e l e te	D e l e te - You can delete any user other than yourself (see note about Akamai provisioned users, below)
You are prompted to add/edit the user's tags during the delete process, and to confirm the
deletion.
Deleting a user invalidates their registration link.
R e s to re	R e s to re - Deleted users only.
Deleted users are hidden by default. Display them using the Sta tu s	Sta tu s column filter.
R e g e n e ra te th e re g i s tra ti o n l i n k	R e g e n e ra te th e re g i s tra ti o n l i n k - Pending users only
R e s e t th e p a s s w o rd o r tw o -fa cto r a u th e n ti ca ti o n	R e s e t th e p a s s w o rd o r tw o -fa cto r a u th e n ti ca ti o n - Registered users only, by generating a new
Adding Users Using SSO	Adding Users Using SSO
API Security supports automatic user creation via SSO/SAML.
See SSO / SAML In te g ra ti o n	SSO / SAML In te g ra ti o n .
For Akamai logins, see SSO In te g ra ti o n w i th Aka m a i	SSO In te g ra ti o n w i th Aka m a i . Wh e n u s i n g Aka m a i SSO, e n s u re	Wh e n u s i n g Aka m a i SSO, e n s u re
u s e rs a re co n fi g u re d w i th Ad va n ce d R BAC .	u s e rs a re co n fi g u re d w i th Ad va n ce d R BAC .
Aka m a i Pro vi s i o n e d U s e rs	Aka m a i Pro vi s i o n e d U s e rs
You cannot delete users provisioned using Aka m a i SSO	Aka m a i SSO once they are R e g i s te re d	R e g i s te re d . To delete
these users, contact Akamai support.
© Copyri ght 2026 Aka ma i Technol ogi es . Al l ri ghts res erved.
Page: 5

-- 5 of 8 --

invitation link.
Id	Id , Te a m ID	Te a m ID , and Jo b Ti tl e	Jo b Ti tl e columns are hidden by default. Enable them using the table options menu.
Each user manages their own personal API keys for Management API access. See User Access .
Managing Service Accounts
Service accounts are machine-to-machine accounts that can access the management API but not the UI.
Service Account Access
Generate a secret and access token to use the management API.
Only o n e a cti ve to ke n	o n e a cti ve to ke n can exist at a time.
Regenerating the secret invalidates any existing secret or tokens.
Actions for Service Accounts
C re a te	C re a te – Assign a role, team, and token TTL.
Secret is generated.
Ed i t	Ed i t – Modify role or team.
Secret is regenerated; existing secret and tokens are invalidated.
R e g e n e ra te Se cre t	R e g e n e ra te Se cre t
Secret is regenerated; existing secr

... (nội dung tiếp tục được lưu trong file gốc) ...
```

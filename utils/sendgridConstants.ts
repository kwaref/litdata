export enum MailType {
  Invite = 'invite',
  Magic = 'magiclink',
  Recovery = 'recovery',
  ShareReport = 'share_report',
  MembershipExpiry = 'membership_expiry',
  MembershipExpiryAdmin = 'membership_expiry_admin',
  MembershipRenewal = 'membership_renewal',
  Custom = 'custom',
  NewPassword = 'new_password',
  ChangeManagerEmail = 'change_manager_email',
  ChangeUserEmail = 'change_user_email',
}
export enum SendgridTemplates {
  Invite = 'd-dff86167a6fc456e86bdf1b4a9a9cbab',
  Recovery = 'd-f011c0b3530946a89d692490bfa8d810',
  ShareReport = 'd-74f1826f2ed24f73808a5b4f6999df62',
  MembershipExpiry = 'd-b92329a0ebd64c1797c2f1b7d2e4004f',
  MembershipExpiryAdmin = 'd-75ed0a93dead45d98ac8437ade999cdc',
  MembershipRenewal = 'd-84627cf30c4a4f948f63767a38652b1a',
  NewPassword = 'd-cd4af386c0674c80ad9edb69a2ef2126',
  ChangeManagerEmail = 'd-de945c3afdca48ce8d95797c1641553c',
  ChangeUserEmail = 'd-f33c0cb778974961b642cbc430221d58',
}

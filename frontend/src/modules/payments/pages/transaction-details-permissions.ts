import { useHasPermission } from "@/store";

export const useTransactionDetailsPermissions = () => {
  const hasPermission = useHasPermission();

  // Action permissions
  const canView = hasPermission("transaction_details.view");
  const canApprove = hasPermission("transaction_details.approve");
  const canReject = hasPermission("transaction_details.reject");
  const canEdit = hasPermission("transaction_details.edit");
  const canExport = hasPermission("transaction_details.export");

  // Section visibility
  const viewInfoSection = hasPermission("transactions.sec_info");
  const viewUserSection = hasPermission("transactions.sec_user");
  const viewAttachmentSection = hasPermission("transactions.sec_attachment");
  const viewNotesSection = hasPermission("transactions.sec_notes");
  const viewVerificationSection = hasPermission("transactions.sec_verification");
  const viewTimelineSection = hasPermission("transactions.sec_timeline");
  // const viewHistorySection = hasPermission("transactions.sec_history");

  // Amount visibility
  const viewAmount = hasPermission("transactions.view_amount");
  const editAmount = hasPermission("transactions.edit_amount");

  // Button visibility
  const showApproveButton = hasPermission("transactions.ui_approve");
  const showRejectButton = hasPermission("transactions.ui_reject");
  const showEditButton = hasPermission("transactions.ui_edit");
  const showViewProfileButton = hasPermission("transactions.ui_view_profile");
  const showOpenAttachmentButton = hasPermission("transactions.ui_open_attachment");
  const showDownloadAttachmentButton = hasPermission("transactions.ui_download_attachment");
  const showEditAmountButton = hasPermission("transactions.ui_edit_amount");

  return {
    // Actions
    canView,
    canApprove,
    canReject,
    canEdit,
    canExport,
    // Sections
    viewInfoSection,
    viewUserSection,
    viewAttachmentSection,
    viewNotesSection,
    viewVerificationSection,
    viewTimelineSection,
    // viewHistorySection,
    // Amount
    viewAmount,
    editAmount,
    // Buttons
    showApproveButton,
    showRejectButton,
    showEditButton,
    showViewProfileButton,
    showOpenAttachmentButton,
    showDownloadAttachmentButton,
    showEditAmountButton,
  };
};
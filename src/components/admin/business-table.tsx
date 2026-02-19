"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  Edit,
  Mail,
  MessageCircle,
  UserPlus,
  Ban,
  CheckCircle,
  Trash2,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";
import { CreateAccountModal } from "./create-account-modal";
import { SendEmailModal } from "./send-email-modal";
import { SendWhatsAppModal } from "./send-whatsapp-modal";
import { DeleteBusinessModal } from "./delete-business-modal";
import { buildWhatsAppChatLink } from "@/lib/whatsapp";

type RegistrationStatus =
  | "NOT_REGISTERED"
  | "FORM_SUBMITTED"
  | "ACCOUNT_CREATED"
  | "EMAIL_SENT"
  | "ACTIVE"
  | "SUSPENDED";

interface Business {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  whatsappPhone?: string | null;
  town: string | null;
  province: string | null;
  registrationStatus: RegistrationStatus | null;
  isActive: boolean | null;
  city: {
    name: string;
  } | null;
  _count: {
    vehicles: number;
    bookings: number;
  };
}

interface BusinessTableProps {
  businesses: Business[];
  total: number;
  totalPages: number;
  currentPage: number;
}

function getStatusBadge(status: RegistrationStatus | null) {
  switch (status) {
    case "NOT_REGISTERED":
      return <Badge variant="outline">Not Registered</Badge>;
    case "FORM_SUBMITTED":
      return <Badge className="bg-purple-500">Form Submitted</Badge>;
    case "ACCOUNT_CREATED":
      return <Badge className="bg-blue-500">Account Created</Badge>;
    case "EMAIL_SENT":
      return <Badge className="bg-yellow-500">Email Sent</Badge>;
    case "ACTIVE":
      return <Badge className="bg-green-500">Active</Badge>;
    case "SUSPENDED":
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export function BusinessTable({
  businesses,
  total,
  totalPages,
  currentPage,
}: BusinessTableProps) {
  const router = useRouter();
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [sendEmailModalOpen, setSendEmailModalOpen] = useState(false);
  const [sendWhatsAppModalOpen, setSendWhatsAppModalOpen] = useState(false);
  const [deleteBusinessModalOpen, setDeleteBusinessModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [whatsappPreFillMessage, setWhatsappPreFillMessage] = useState("");
  const [createdPassword, setCreatedPassword] = useState<string | undefined>();
  const [autoOpenWhatsApp, setAutoOpenWhatsApp] = useState(false);

  const selectedBusinesses = useMemo(
    () => businesses.filter((b) => selectedIds.has(b.id)),
    [businesses, selectedIds]
  );

  const allOnPageSelected =
    businesses.length > 0 && businesses.every((b) => selectedIds.has(b.id));

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        businesses.forEach((b) => next.delete(b.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        businesses.forEach((b) => next.add(b.id));
        return next;
      });
    }
  };

  const openBulkDeleteModal = () => {
    setIsBulkDelete(true);
    setSelectedBusiness(null);
    setDeleteBusinessModalOpen(true);
  };

  const openSingleDeleteModal = (business: Business) => {
    setIsBulkDelete(false);
    setSelectedBusiness(business);
    setDeleteBusinessModalOpen(true);
  };

  const handleSendVehicleLink = (business: Business) => {
    const link = `${window.location.origin}/vendor-onboarding/${business.id}`;
    const message = `Hello ${business.name}, please use this link to Rent My Vehicle:\n${link}`;
    setSelectedBusiness(business);
    setWhatsappPreFillMessage(message);
    setSendWhatsAppModalOpen(true);
  };

  // Refresh when modals close after successful operations
  const handleModalClose = (
    modalType: "create" | "email" | "whatsapp" | "delete"
  ) => {
    if (modalType === "create") {
      setCreateAccountModalOpen(false);
    } else if (modalType === "email") {
      setSendEmailModalOpen(false);
    } else if (modalType === "whatsapp") {
      setSendWhatsAppModalOpen(false);
      setWhatsappPreFillMessage("");
    } else if (modalType === "delete") {
      setDeleteBusinessModalOpen(false);
      setSelectedIds(new Set());
      setIsBulkDelete(false);
    }
    // Only clear selected business if we weren't chaining
    if (!autoOpenWhatsApp) {
      setSelectedBusiness(null);
    }
    if (modalType === "whatsapp") {
      setCreatedPassword(undefined);
    }
    router.refresh();
  };

  const handleCreateAndSendWhatsApp = (business: Business) => {
    setSelectedBusiness(business);
    setAutoOpenWhatsApp(true);
    setCreateAccountModalOpen(true);
  };

  const handleAccountCreated = (newPassword: string) => {
    setCreatedPassword(newPassword);
    if (autoOpenWhatsApp) {
      setCreateAccountModalOpen(false);
      setTimeout(() => {
        setSendWhatsAppModalOpen(true);
        setAutoOpenWhatsApp(false); // Reset
      }, 500);
    }
  };

  const handleResetPassword = async (business: Business) => {
    if (
      !confirm(
        "Are you sure you want to reset the password for " +
          business.name +
          "? A new password will be generated."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/businesses/${business.id}/reset-password`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successfully. Opening WhatsApp...");
        setCreatedPassword(data.password);
        setSelectedBusiness(business);
        setWhatsappPreFillMessage("");
        setSendWhatsAppModalOpen(true);
      } else {
        alert(data.error || "Failed to reset password");
      }
    } catch (error) {
      alert("Error resetting password");
    }
  };

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-4 p-3 mb-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-sm font-medium">
            {selectedIds.size} business{selectedIds.size !== 1 ? "es" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear selection
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsBulkDelete(false);
                setCreateAccountModalOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Accounts
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={openBulkDeleteModal}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete selected
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-10 p-4">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleAllOnPage}
                    aria-label="Select all on page"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-sm">
                  Business Name
                </th>
                <th className="text-left p-4 font-semibold text-sm">Email</th>
                <th className="text-left p-4 font-semibold text-sm">Phone</th>
                <th className="text-left p-4 font-semibold text-sm">City</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">
                  Vehicles
                </th>
                <th className="text-right p-4 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr
                  key={business.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="w-10 p-4">
                    <Checkbox
                      checked={selectedIds.has(business.id)}
                      onCheckedChange={() => toggleOne(business.id)}
                      aria-label={`Select ${business.name}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{business.name}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.email || "N/A"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.phone || business.whatsappPhone ? (
                      <a
                        href={buildWhatsAppChatLink(
                          business.whatsappPhone || business.phone || ""
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {business.phone || business.whatsappPhone || "N/A"}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.city?.name || business.province || "N/A"}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(business.registrationStatus)}
                  </td>
                  <td className="p-4">
                    <span className="text-muted-foreground">
                      {business._count.vehicles}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {business.registrationStatus === "NOT_REGISTERED" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Create & Send WhatsApp"
                          onClick={() => handleCreateAndSendWhatsApp(business)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      ) : (
                        (business.phone || business.whatsappPhone) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Send WhatsApp"
                            onClick={() => {
                              setSelectedBusiness(business);
                              setWhatsappPreFillMessage("");
                              setSendWhatsAppModalOpen(true);
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        )
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/businesses/${business.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/businesses/${business.id}/edit`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {business.registrationStatus === "NOT_REGISTERED" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBusiness(business);
                                setCreateAccountModalOpen(true);
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Create Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBusiness(business);
                              setSendEmailModalOpen(true);
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBusiness(business);
                              setWhatsappPreFillMessage("");
                              setSendWhatsAppModalOpen(true);
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send WhatsApp
                          </DropdownMenuItem>
                          {business.registrationStatus !== "NOT_REGISTERED" && (
                            <DropdownMenuItem
                              onClick={() => handleResetPassword(business)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleSendVehicleLink(business)}
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            List Vehicle Link
                          </DropdownMenuItem>
                          {business.isActive ? (
                            <DropdownMenuItem>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => openSingleDeleteModal(business)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {businesses.length} of {total} businesses
            </div>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link href={`/admin/businesses?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={`/admin/businesses?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateAccountModal
        open={createAccountModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose("create");
          } else {
            setCreateAccountModalOpen(true);
          }
        }}
        businessId={selectedBusiness?.id}
        businessName={selectedBusiness?.name}
        businessEmail={selectedBusiness?.email || ""}
        businessPhone={selectedBusiness?.phone || ""}
        businessIds={
          selectedIds.size > 0 && !selectedBusiness
            ? Array.from(selectedIds)
            : undefined
        }
        businessNames={
          selectedIds.size > 0 && !selectedBusiness
            ? selectedBusinesses.map((b) => b.name)
            : undefined
        }
        onAccountCreated={handleAccountCreated}
      />

      {selectedBusiness && (
        <>
          <SendEmailModal
            open={sendEmailModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleModalClose("email");
              } else {
                setSendEmailModalOpen(true);
              }
            }}
            businessId={selectedBusiness.id}
            businessName={selectedBusiness.name}
            businessEmail={selectedBusiness.email || ""}
            registrationStatus={selectedBusiness.registrationStatus}
          />
          <SendWhatsAppModal
            open={sendWhatsAppModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleModalClose("whatsapp");
              } else {
                setSendWhatsAppModalOpen(true);
              }
            }}
            businessId={selectedBusiness.id}
            businessName={selectedBusiness.name}
            businessPhone={
              selectedBusiness.whatsappPhone || selectedBusiness.phone
            }
            businessEmail={selectedBusiness.email}
            registrationStatus={selectedBusiness.registrationStatus}
            initialMessage={whatsappPreFillMessage}
            password={createdPassword}
          />
        </>
      )}

      <DeleteBusinessModal
        open={deleteBusinessModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose("delete");
          } else {
            setDeleteBusinessModalOpen(true);
          }
        }}
        businessId={
          !isBulkDelete && selectedBusiness ? selectedBusiness.id : undefined
        }
        businessName={
          !isBulkDelete && selectedBusiness ? selectedBusiness.name : undefined
        }
        businessIds={
          isBulkDelete && selectedIds.size > 0
            ? Array.from(selectedIds)
            : undefined
        }
        businessNames={
          isBulkDelete && selectedBusinesses.length > 0
            ? selectedBusinesses.map((b) => b.name)
            : undefined
        }
      />
    </>
  );
}

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectedContact from "./SelectedContact";

function ContactSearch({
  contactSearchTerm,
  setContactSearchTerm,
  showContactDropdown,
  setShowContactDropdown,
  searchedContacts,
  isSearching,
  selectedContact,
  onContactSelect,
  searchContacts,
  errors,
}) {
  const contactInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (contactSearchTerm.trim() && contactSearchTerm.length >= 2) {
        await searchContacts(contactSearchTerm);
      } else {
        setShowContactDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [contactSearchTerm, searchContacts, setShowContactDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !contactInputRef.current?.contains(event.target)
      ) {
        setShowContactDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowContactDropdown]);

  return (
    <div className="space-y-4">
      <div className="space-y-2 relative">
        <Label htmlFor="contact_search">Supplier Name *</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={contactInputRef}
            id="contact_search"
            placeholder="Search for a supplier..."
            value={contactSearchTerm}
            onChange={(e) => setContactSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchedContacts.length > 0) {
                setShowContactDropdown(true);
              }
            }}
            className={cn("pl-8 pr-8", errors ? "border-red-500" : "")}
          />
          {selectedContact && (
            <Check className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
          )}
          {isSearching && (
            <div className="absolute right-2 top-2.5">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Contact Dropdown */}
        {showContactDropdown && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {searchedContacts.length > 0 ? (
              searchedContacts.map((contact) => (
                <div
                  key={contact.contactID}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => onContactSelect(contact)}
                >
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-500">
                    {contact.emailAddress && (
                      <span className="mr-3">{contact.emailAddress}</span>
                    )}
                    {(contact.bankAccountDetails ||
                      contact.batchPayments?.bankAccountNumber) && (
                      <span>
                        Bank:{" "}
                        {contact.bankAccountDetails ||
                          contact.batchPayments?.bankAccountNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No suppliers found</div>
            )}
          </div>
        )}

        {errors && <p className="text-sm text-red-500">{errors}</p>}
      </div>

      {selectedContact && <SelectedContact data={selectedContact} />}
    </div>
  );
}

ContactSearch.propTypes = {
  contactSearchTerm: PropTypes.string.isRequired,
  setContactSearchTerm: PropTypes.func.isRequired,
  showContactDropdown: PropTypes.bool.isRequired,
  setShowContactDropdown: PropTypes.func.isRequired,
  searchedContacts: PropTypes.array.isRequired,
  isSearching: PropTypes.bool.isRequired,
  selectedContact: PropTypes.object,
  onContactSelect: PropTypes.func.isRequired,
  searchContacts: PropTypes.func.isRequired,
  errors: PropTypes.string,
};

export default ContactSearch;

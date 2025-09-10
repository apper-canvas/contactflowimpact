import { useState, useEffect } from "react";
import ContactList from "@/components/organisms/ContactList";
import ContactModal from "@/components/organisms/ContactModal";
import ContactDetailModal from "@/components/organisms/ContactDetailModal";

const ContactsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactListKey, setContactListKey] = useState(0);

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowAddModal(true);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleContactSaved = (savedContact) => {
    // Refresh the contact list by updating the key
    setContactListKey(prev => prev + 1);
    
    // If we're editing, update the selected contact for the detail modal
    if (showEditModal && selectedContact) {
      setSelectedContact(savedContact);
    }
  };

  const handleContactDeleted = (deletedContactId) => {
    // Refresh the contact list
    setContactListKey(prev => prev + 1);
    setSelectedContact(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <ContactList
          key={contactListKey}
          onContactClick={handleContactClick}
          onAddContact={handleAddContact}
        />

        <ContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onContactSaved={handleContactSaved}
        />

        <ContactModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          contact={selectedContact}
          onContactSaved={handleContactSaved}
        />

        <ContactDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          contact={selectedContact}
          onContactEdit={handleEditContact}
          onContactDeleted={handleContactDeleted}
        />
      </div>
    </div>
  );
};

export default ContactsPage;
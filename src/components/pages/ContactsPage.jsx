import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactModal from "@/components/organisms/ContactModal";
import ContactList from "@/components/organisms/ContactList";

const ContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactListKey, setContactListKey] = useState(0);

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowAddModal(true);
  };

const handleContactClick = (contact) => {
    navigate(`/contacts/${contact.Id}`);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowEditModal(true);
  };

const handleContactSaved = (savedContact) => {
    // Refresh the contact list by updating the key
    setContactListKey(prev => prev + 1);
    // Close modals after saving
    setShowAddModal(false);
    setShowEditModal(false);
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
          onEditContact={handleEditContact}
          onContactDeleted={handleContactDeleted}
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
      </div>
    </div>
  );
};

export default ContactsPage;
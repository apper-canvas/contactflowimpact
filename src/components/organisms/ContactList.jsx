import { useState, useEffect } from "react";
import ContactCard from "@/components/molecules/ContactCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";

const ContactList = ({ onContactClick, onAddContact }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      setError("");
      setSearchQuery(query);
      
      if (query.trim()) {
        const results = await contactService.search(query);
        setContacts(results);
      } else {
        const allContacts = await contactService.getAll();
        setContacts(allContacts);
      }
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return <Loading message="Loading contacts..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadContacts}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Contacts</h1>
          <p className="text-neutral-600">
            {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} 
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <Button onClick={onAddContact} className="sm:w-auto">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search contacts by name, email, company..."
          className="max-w-md"
        />
        {isSearching && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Contact List */}
      {contacts.length === 0 ? (
        <Empty
          icon="Users"
          title={searchQuery ? "No contacts found" : "No contacts yet"}
          message={
            searchQuery 
              ? `No contacts match "${searchQuery}". Try adjusting your search terms.`
              : "Start building your contact database by adding your first contact."
          }
          actionLabel={searchQuery ? "Clear Search" : "Add Your First Contact"}
          onAction={searchQuery ? () => handleSearch("") : onAddContact}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.Id}
              contact={contact}
              onClick={() => onContactClick(contact)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
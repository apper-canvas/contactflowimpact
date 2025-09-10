import contactsData from "@/services/mockData/contacts.json";

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await delay();
    return [...this.contacts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getById(id) {
    await delay(200);
    const contact = this.contacts.find(contact => contact.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await delay(400);
    
    // Validation
    if (!contactData.firstName?.trim()) {
      throw new Error("First name is required");
    }
    if (!contactData.lastName?.trim()) {
      throw new Error("Last name is required");
    }
    if (!contactData.email?.trim()) {
      throw new Error("Email is required");
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      throw new Error("Please enter a valid email address");
    }

    // Check for duplicate email
    const existingContact = this.contacts.find(
      contact => contact.email.toLowerCase() === contactData.email.toLowerCase()
    );
    if (existingContact) {
      throw new Error("A contact with this email already exists");
    }

    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      firstName: contactData.firstName.trim(),
      lastName: contactData.lastName.trim(),
      email: contactData.email.trim().toLowerCase(),
      phone: contactData.phone?.trim() || "",
      company: contactData.company?.trim() || "",
      jobTitle: contactData.jobTitle?.trim() || "",
      address: contactData.address?.trim() || "",
      notes: contactData.notes?.trim() || "",
      tags: contactData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await delay(350);
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }

    // Validation
    if (!contactData.firstName?.trim()) {
      throw new Error("First name is required");
    }
    if (!contactData.lastName?.trim()) {
      throw new Error("Last name is required");
    }
    if (!contactData.email?.trim()) {
      throw new Error("Email is required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      throw new Error("Please enter a valid email address");
    }

    // Check for duplicate email (excluding current contact)
    const existingContact = this.contacts.find(
      contact => contact.Id !== parseInt(id) && 
      contact.email.toLowerCase() === contactData.email.toLowerCase()
    );
    if (existingContact) {
      throw new Error("A contact with this email already exists");
    }

    const updatedContact = {
      ...this.contacts[index],
      firstName: contactData.firstName.trim(),
      lastName: contactData.lastName.trim(),
      email: contactData.email.trim().toLowerCase(),
      phone: contactData.phone?.trim() || "",
      company: contactData.company?.trim() || "",
      jobTitle: contactData.jobTitle?.trim() || "",
      address: contactData.address?.trim() || "",
      notes: contactData.notes?.trim() || "",
      tags: contactData.tags || this.contacts[index].tags,
      updatedAt: new Date().toISOString()
    };

    this.contacts[index] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }

    const deletedContact = { ...this.contacts[index] };
    this.contacts.splice(index, 1);
    return deletedContact;
  }

  async search(query) {
    await delay(200);
    
    if (!query.trim()) {
      return await this.getAll();
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = this.contacts.filter(contact => {
      return (
        contact.firstName.toLowerCase().includes(searchTerm) ||
        contact.lastName.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.company.toLowerCase().includes(searchTerm) ||
        contact.jobTitle.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });

    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

export default new ContactService();
'use client';

import { useState } from 'react';
import { createCustomer, createCustomersBulk } from '../lib/api';
import { Customer } from '../lib/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function NewCustomerModal({ isOpen, onClose, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // CSV import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedCustomers, setParsedCustomers] = useState<Partial<Customer>[]>([]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await createCustomer({ name, email, phone });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      parseCsv(file);
    }
  };

  const parseCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        setError('CSV must have a header and at least one data row.');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const customers: Partial<Customer>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const customer = headers.reduce((obj, header, index) => {
          // Simple mapping, assumes CSV headers match DTO fields (name, email, phone)
          if (['name', 'email', 'phone'].includes(header)) {
            (obj as any)[header] = values[index];
          }
          return obj;
        }, {} as Partial<Customer>);
        customers.push(customer);
      }
      setParsedCustomers(customers);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    if (parsedCustomers.length === 0) {
      setError('No customers to import.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createCustomersBulk(parsedCustomers);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during import.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold">&times;</button>
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('manual')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${ 
                activeTab === 'manual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${ 
                activeTab === 'csv'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              Import from CSV
            </button>
          </nav>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit}>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
              <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
                {isLoading ? 'Saving...' : 'Save Customer'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'csv' && (
          <div>
            <input type="file" accept=".csv" onChange={handleFileChange} className="w-full p-2 border rounded-md" />
            {parsedCustomers.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Found {parsedCustomers.length} customers to import.</p>
                <div className="h-48 overflow-y-auto border rounded-md mt-2 p-2 bg-gray-50">
                  <pre className="text-sm">{JSON.stringify(parsedCustomers, null, 2)}</pre>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button onClick={handleImportSubmit} disabled={isLoading || parsedCustomers.length === 0} className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
                {isLoading ? 'Importing...' : `Import ${parsedCustomers.length} Customers`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

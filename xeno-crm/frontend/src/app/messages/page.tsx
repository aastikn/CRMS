'use client';

import React, { useEffect, useState } from 'react';
import { getCommunicationLogs } from '../../lib/api';
import { CommunicationLog } from '../../lib/types';

export default function MessagesPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCommunicationLogs()
      .then(data => setLogs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const customerMessages = logs.reduce((acc, log) => {
    const customerId = log.customer.id;
    if (!acc[customerId]) {
      acc[customerId] = {
        customer: log.customer,
        messages: [],
      };
    }
    acc[customerId].messages.push(log);
    return acc;
  }, {} as Record<string, { customer: CommunicationLog['customer']; messages: CommunicationLog[] }>);

  return (
    <div>
      <h1 class="text-3xl font-bold mb-8">Customer Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div class="space-y-8">
          {Object.values(customerMessages).map(({ customer, messages }) => (
            <div key={customer.id} class="border rounded-lg p-4">
              <h2 class="text-xl font-semibold mb-4">{customer.name}</h2>
              <div class="space-y-4">
                {messages.map(log => (
                  <div key={log.id} class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-lg font-semibold text-gray-600">{customer.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div class="flex-grow">
                      <div class="bg-gray-100 rounded-lg p-3">
                        <p class="font-medium">{log.campaign.name}</p>
                        <p class="text-sm text-gray-500">{new Date(log.sent_at).toLocaleString()}</p>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
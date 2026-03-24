import { ChatMessage } from '@/interface/Chat';

export interface MockChat {
    id: string;
    title: string;
    date: string;
    time: string;
    messages: any[];
}

const generateTimestamp = (daysAgo: number, timeStr: string) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const [hours, mins, modifier] = timeStr.match(/(\d+):(\d+) (\w+)/)?.slice(1) || ['0', '0', 'AM'];
    let hr = parseInt(hours);
    if (modifier === 'PM' && hr < 12) hr += 12;
    if (modifier === 'AM' && hr === 12) hr = 0;
    d.setHours(hr, parseInt(mins), 0, 0);
    return d.toISOString();
};

export const mockChats: MockChat[] = [
    {
        id: '1',
        title: 'Shipment Tracking Issue',
        date: 'Today',
        time: '10:30 AM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'I noticed a delayed shipment for client XYZ. How do we escalate this?',
                IsUser: true,
                Timestamp: generateTimestamp(0, '10:30 AM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'For delayed shipments, please check the tracking details in FedEx Ship Manager and initiate an investigation ticket. Ensure you log the package ID and estimated delivery for SLA reporting.',
                IsUser: false,
                Timestamp: generateTimestamp(0, '10:30 AM'),
                Status: 'delivered'
            }
        ]
    },
    {
        id: '2',
        title: 'Clark Gateway Hub Update',
        date: 'Today',
        time: '09:15 AM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'Has the Clark Gateway Hub fully implemented the new automation systems?',
                IsUser: true,
                Timestamp: generateTimestamp(0, '09:15 AM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'Yes, the automation system is live. It has improved sorting efficiency by 20% and reduced transit delays. All team leads were briefed last week on operational changes.',
                IsUser: false,
                Timestamp: generateTimestamp(0, '09:15 AM'),
                Status: 'delivered'
            }
        ]
    },
    {
        id: '3',
        title: 'Customs Clearance',
        date: 'Yesterday',
        time: '04:20 PM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'Client shipment to Singapore is stuck at customs. Any guidance?',
                IsUser: true,
                Timestamp: generateTimestamp(1, '04:20 PM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'Please use FedEx Electronic Trade Documents (ETD) for faster processing. Contact the customs broker assigned to the shipment and confirm required documents are submitted.',
                IsUser: false,
                Timestamp: generateTimestamp(1, '04:20 PM'),
                Status: 'delivered'
            }
        ]
    },
    {
        id: '4',
        title: 'Employee Training Session',
        date: 'Yesterday',
        time: '11:00 AM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'When is the next e-commerce solutions training for staff?',
                IsUser: true,
                Timestamp: generateTimestamp(1, '11:00 AM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'The next session is scheduled for Thursday at 2 PM in the BGC office. It will cover FedEx Ship Manager updates and SME support tools.',
                IsUser: false,
                Timestamp: generateTimestamp(1, '11:00 AM'),
                Status: 'delivered'
            }
        ]
    },
    {
        id: '5',
        title: 'Sustainability Initiatives',
        date: '7 Days Ago',
        time: '02:00 PM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'Any updates on the EV fleet deployment in Metro Manila?',
                IsUser: true,
                Timestamp: generateTimestamp(7, '02:00 PM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'The pilot program launched last month. Initial results show a 15% reduction in fuel usage and positive feedback from drivers. Expansion plans are underway for Q2.',
                IsUser: false,
                Timestamp: generateTimestamp(7, '02:00 PM'),
                Status: 'delivered'
            }
        ]
    },
    {
        id: '6',
        title: 'IT System Maintenance',
        date: '7 Days Ago',
        time: '09:45 AM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'Will there be downtime for FedEx Ship Manager this weekend?',
                IsUser: true,
                Timestamp: generateTimestamp(7, '09:45 AM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'Maintenance is scheduled from 10 PM Saturday to 4 AM Sunday. All shipment tracking and scheduling will be paused during this window. Notifications have been sent to all users.',
                IsUser: false,
                Timestamp: generateTimestamp(7, '09:45 AM'),
                Status: 'delivered'
            }
        ]
    },
    {
        id: '7',
        title: 'International Priority Shipments',
        date: '7 Days Ago',
        time: '08:15 AM',
        messages: [
            {
                AccountID: 'user',
                Nickname: 'Employee',
                Text: 'How do we prioritize International Priority packages for urgent clients?',
                IsUser: true,
                Timestamp: generateTimestamp(7, '08:15 AM'),
                Status: 'delivered'
            },
            {
                AccountID: 'ai',
                Nickname: 'FedEx Bot',
                Text: 'Use the “Priority Handling” flag in Ship Manager and confirm pickup times with the Clark Gateway Hub. Ensure customs documentation is pre-cleared for faster delivery.',
                IsUser: false,
                Timestamp: generateTimestamp(7, '08:15 AM'),
                Status: 'delivered'
            }
        ]
    }
];
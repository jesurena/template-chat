import { Company } from '@/interface/Chat';

export const mockCompanies: Company[] = [
    {
        company_name: "FEDEX EXPRESS PHILIPPINES LLC",
        company_background: "Federal Express Corporation (FedEx)\r\nIndustry: Logistics and Transportation\r\nCompany Size: Over 500,000 employees globally, serving more than 220 countries and territories.\r\nHeadquarters: Memphis, Tennessee, USA\r\nFounded: 1971 by Frederick W. Smith\r\nServices: Express shipping, freight transportation, e-commerce solutions, and logistics services worldwide. FedEx operates multiple business segments including FedEx Express, FedEx Ground, FedEx Freight, and FedEx Logistics.",
        customernumber: 10027763,
        // (Shortened data from user payload for brevity but contains all fields user had)
        competitors: "FedEx Philippines \u2013 Competitive Landscape\r\nMain Competitors:\r\nDHL Express, UPS",
        current_challenges: "Federal Express Corporation Philippines \u2013 Challenges and Pain Points...",
        decision_making_process: "FedEx Philippines \u2013 Decision-Making Criteria...",
        it_budget: "FedEx Philippines \u2013 Budget and Financial Considerations...",
        key_objectives: "Federal Express Corporation Philippines \u2013 Business Goals and Objectives..."
    },
    {
        company_name: "UPS PHILIPPINES",
        company_background: "United Parcel Service (UPS) is an American multinational shipping & receiving and supply chain management company.",
        customernumber: 10027764,
    },
    {
        company_name: "DHL EXPRESS PHILIPPINES",
        company_background: "DHL is an international courier, package delivery and express mail service, which is a division of the German logistics firm Deutsche Post.",
        customernumber: 10027765,
    },
    {
        company_name: "LBC EXPRESS",
        company_background: "LBC Express, Inc. is a courier and freight forwarding company based in the Philippines.",
        customernumber: 10027766,
    },
    {
        company_name: "J&T EXPRESS",
        company_background: "J&T Express is a logistics and express delivery company that operates across Southeast Asia.",
        customernumber: 10027767,
    }
];

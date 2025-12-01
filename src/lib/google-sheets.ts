import { google } from 'googleapis';
import { Order, OrderItem, OrderStatus } from '@/types';

// This function handles authentication and returns an authorized Google Sheets API client.
const getSheetsClient = () => {
  // Ensure environment variables are loaded and available.
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Missing Google Sheets API credentials in environment variables.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: privateKey,
      client_email: clientEmail,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

// This function fetches all orders from the specified Google Sheet.
export const getOrders = async (): Promise<Order[]> => {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;

  if (!spreadsheetId || !sheetName) {
    throw new Error('Missing GOOGLE_SHEET_ID or GOOGLE_SHEET_NAME in environment variables.');
  }
  
  const sheets = getSheetsClient();
  const range = `${sheetName}!A2:I`; // Assumes headers are in row 1, data starts at A2

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Maps the spreadsheet rows to Order objects.
    const orders: Order[] = rows.map((row): Order | null => {
      // Basic validation to skip empty or malformed rows.
      if (!row[0]) return null;

      try {
        const items: OrderItem[] = JSON.parse(row[2] || '[]');
        return {
          id: row[0],
          customerName: row[1] || '',
          items: items,
          status: row[3] as OrderStatus || 'placed',
          orderType: row[4] as Order['orderType'] || 'delivery',
          shippingAddress: row[5] || '',
          trackingId: row[6] || '',
          totalAmount: parseFloat(row[7]) || 0,
          timestamp: row[8] || new Date().toISOString(),
        };
      } catch (e) {
        console.error(`Failed to parse items for order ID ${row[0]}:`, e);
        return null;
      }
    }).filter((order): order is Order => order !== null); // Filter out any null (malformed) orders

    return orders;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw new Error('Failed to communicate with Google Sheets API.');
  }
};

// This function updates the status of a specific order in the Google Sheet.
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;

   if (!spreadsheetId || !sheetName) {
    throw new Error('Missing GOOGLE_SHEET_ID or GOOGLE_SHEET_NAME in environment variables.');
  }

  const sheets = getSheetsClient();

  try {
    // First, find the row number of the order to update.
    const findResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`, // Search in the ID column
    });

    const rows = findResponse.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(row => row[0] === orderId);
    if (rowIndex === -1) {
      console.error(`Order ID ${orderId} not found in sheet.`);
      return false;
    }

    const rowToUpdate = rowIndex + 1; // +1 because sheets are 1-indexed

    // Now, update the status in the 'D' column for that row.
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!D${rowToUpdate}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      },
    });

    return updateResponse.status === 200;
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error);
    return false;
  }
};

    
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { google } from "googleapis";

/* ================================
   CONFIG META WHATSAPP (HARDCODE)
   ================================ */

const META_TOKEN =
  "EAAxw38HijG8BQdtUNdMhTwBstImSMSVO5QEH6qWLg0gNFNYuZAp4pxKpfEJAbfv2ddnTOvuMuOGo7G7quy58FQuZCXWZBbG1YAPA76AYZB8dGS3JUHsdfBuEQIExxn2Mu5weHsz1XgHFuFIg2I6t1pM8CkT0Vsx1ZCEqNPN4wbtCs4opu00zZBbwsZB8k6PM8M6CaE6pQLBXT5vbPtie1xHzxDYwJeeqWTcEJBBpLA3wQpJZA0smkZCXUXC68LGuz2GcAezHBTW74VmvADVRzsuFIPZAjZA";

const PHONE_NUMBER_ID = "105812655900403";

// Números a notificar
const NOTIFY_1 = "59897744363";
// const NOTIFY_2 = "5989XXXXXX"; // opcional

/* ================================
   WHATSAPP META
   ================================ */

async function sendWhatsAppMeta(
  to: string,
  params: string[]
) {
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${META_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "gift_received",
        language: { code: "es" },
        components: [
          {
            type: "body",
            parameters: params.map((p) => ({
              type: "text",
              text: p,
            })),
          },
        ],
      },
    }),
  });
}


export const onAttendanceSheet = onDocumentCreated(
  {
    document: "attendances/{id}",
    region: "us-central1",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1crzFTw293zubVGYezeZAVCsp6r-vpTMlZMrqfnCtAUQ",
      range: "Invitados!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          data.name || "",
          data.family || "",
          data.guests || "",
          data.comments || "",
        ]],
      },
    });
  }
);


/* ================================
   FIRESTORE TRIGGER
   ================================ */

export const onGiftSelectionCreated = onDocumentCreated(
  {
    document: "giftSelections/{id}",
    region: "us-central1",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    /* ===== Google Sheets ===== */

    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1crzFTw293zubVGYezeZAVCsp6r-vpTMlZMrqfnCtAUQ",
      range: "A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString(),
            data.giftName || "",
            data.senderName || "",
            data.visibility === "anonymous" ? "Sí" : "No",
            data.message || "",
          ],
        ],
      },
    });

    /* ===== WhatsApp Meta ===== */

    const sender =
      data.visibility === "anonymous"
        ? "Anónimo"
        : data.senderName || "—";

    await Promise.all([
      sendWhatsAppMeta(NOTIFY_1, [
        data.giftName || "-",
        sender,
        data.message || "-",
        new Date().toLocaleString(),
      ]),
      // sendWhatsAppMeta(NOTIFY_2, [...]) 
    ]);
  }
);
